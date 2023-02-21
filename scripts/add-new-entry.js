#!/usr/bin/env osascript -l JavaScript

//──────────────────────────────────────────────────────────────────────────────

// JXA & Alfred specific
ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function appendToFile(text, absPath) {
	text = text.replaceAll("'", "`"); // ' in text string breaks echo writing method
	app.doShellScript(`echo '${text}' >> '${absPath}'`); // use single quotes to prevent running of input such as "$(rm -rf /)"
}

function readFile(path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

function writeToFile(text, file) {
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
}

//──────────────────────────────────────────────────────────────────────────────

function parseBibtexProperty(arr, property) {
	arr = arr.map(line => line.trim()).filter(p => p.startsWith(property + " "));
	if (!arr.length) return "";
	const value = arr[0]
		.split("=")[1]
		.replace(/{|}|,$/g, "")
		.trim();
	return value;
}

function ensureUniqueCitekey(citekey, libraryPath) {
	// check if citekey already exists
	const citekeyArray = readFile(libraryPath)
		.split("\n")
		.filter(line => line.startsWith("@"))
		.map(line => line.split("{")[1].replaceAll(",", ""));

	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	let i = -1;
	let nextCitekey = citekey;
	while (citekeyArray.includes(nextCitekey)) {
		let nextLetter = alphabet[i];
		if (i === -1) nextLetter = ""; // first loop
		nextCitekey = citekey + nextLetter;
		i++;
		if (i > alphabet.length - 1) break; // in case the citekey is already used 27 times (lol)
	}
	return nextCitekey;
}

function generateCitekey(bibtexPropertyArr) {
	let year = parseBibtexProperty(bibtexPropertyArr, "year");
	if (!year) year = "ND";

	let authEds;
	const authors = parseBibtexProperty(bibtexPropertyArr, "author");
	const editors = parseBibtexProperty(bibtexPropertyArr, "editor");
	if (authors) authEds = authors;
	else if (editors) authEds = editors;
	else authEds = "NoAuthor";

	let authorStr;
	const lastNameArr = [];
	const invalidLastName = authEds.match(/,.*,/) && !authEds.includes("and"); // not complying naming standard with and as delimiter

	if (authEds === "NoAuthor") lastNameArr[0] = "NoAuthor";
	else if (invalidLastName) lastNameArr[0] = "Invalid";
	else {
		authEds
			.split(" and ") // "and" used as delimiter in bibtex for names
			.forEach(name => {
				// doi.org returns "first last", isbn mostly "last, first"
				const isLastFirst = name.includes(",");
				const lastName = isLastFirst ? name.split(",")[0].trim() : name.split(" ").pop();
				lastNameArr.push(lastName);
			});
	}
	if (lastNameArr.length < 3) authorStr = lastNameArr.join("");
	else authorStr = lastNameArr[0] + "EtAl";

	// strip diacritics from authorStr
	authorStr = authorStr
		.replaceAll("ü", "ue")
		.replaceAll("Ü", "Ue")
		.replaceAll("ä", "ae")
		.replaceAll("Ä", "Ae")
		.replaceAll("ö", "oe")
		.replaceAll("Ö", "Oe")
		.replace(/á|â|à|ã/g, "a")
		.replace(/Á|Â|À|Ã/g, "A")
		.replace(/ó|ô|õ|ò|ø/g, "o")
		.replace(/Ó|Ô|Õ|Ò|Ø/g, "O")
		.replace(/ú|û|ù/g, "u")
		.replace(/Ú|Û|Ù/g, "U")
		.replace(/é|ê|è|ë/g, "e")
		.replace(/É|Ê|È|Ë/g, "E")
		.replace(/í|î|ì|ï/g, "i")
		.replace(/Í|Î|Ì|Ï/g, "I")
		.replace(/ç|ć|č/g, "c")
		.replace(/Ç|Ć|Č/g, "C")
		.replace(/ñ/g, "n");

	const citekey = authorStr + year;
	return citekey;
}

//──────────────────────────────────────────────────────────────────────────────

function run(argv) {
	const doiRegex = /\b10.\d{4,9}\/[-._;()/:A-Z0-9]+(?=$|[?/ ])/i; // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
	const isbnRegex = /^[\d-]{9,}$/;

	const input = argv.join("").trim();
	const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
	//───────────────────────────────────────────────────────────────────────────

	let bibtexEntry;
	let newCitekey;

	const isDOI = doiRegex.test(input);
	const isISBN = isbnRegex.test(input);
	const mode = $.getenv("mode");
	if (!isDOI && !isISBN && mode !== "parse") return "input invalid";

	// DOI
	if (isDOI) {
		const doiURL = "https://doi.org/" + input.match(doiRegex)[0];
		bibtexEntry = app.doShellScript(`curl -sLH "Accept: application/x-bibtex" "${doiURL}"`); // https://citation.crosscite.org/docs.html
		if (!bibtexEntry.includes("@")) return "DOI invalid";

		// ISBN
	} else if (isISBN) {
		const isbn = input;
		bibtexEntry = app.doShellScript(`curl -sHL "https://www.ebook.de/de/tools/isbn2bibtex?isbn=${isbn}"`);
		if (bibtexEntry.includes("Not found")) return "ISBN not registered.";
		if (!bibtexEntry.includes("@")) return "ISBN invalid";

		// parse
	} else if (mode === "parse") {
		// INFO anystyle can't read STDIN, so this has to be written to a file
		// https://github.com/inukshuk/anystyle-cli#anystyle-help-parse
		const tempPath = $.getenv("alfred_workflow_cache") + "/temp.txt";
		writeToFile(input, tempPath);
		bibtexEntry = app.doShellScript(`anystyle --stdout --format=bib parse "${tempPath}"`);
	}

	//───────────────────────────────────────────────────────────────────────────

	// INSERT CONTENT TO APPEND
	// cleaning
	const keysToDelete = ["ean", "month", "issn", "language", "copyright", "pagetotal", "address", "abstract", "series"];
	const keysToDeleteRegex = new RegExp("\t(" + keysToDelete.join("|") + ").*[\n\r]", "g");

	bibtexEntry = bibtexEntry
		.replace(/^ {2}/gm, "\t") // indentation
		.replace(/^\s*\w+ =/gm, field => field.toLowerCase()) // lowercase all keys
		.replace(keysToDeleteRegex, "")
		.replace(/^(\tpublisher.*?)\{?(?: ?\{?gmbh|ltd|publications|llc ?)\}?(.*)$/im, "$1$2") // publisher garbage
		.replace("\tdate =", "\tyear =") // consistently "year"
		.replace("%2F", "/") // fix for URL key in some DOIs
		.replace(/\tyear = \{?(\d{4}).*\}?/g, "\tyear = $1,") // clean year key
		.replace(/^\turl.*(ebook|doi).*[\n\r]/m, "") // doi url redundant, ebook url are basically ads
		.replace(/amp\$\\mathsemicolon\$/, ""); // invalid bibtex

	let newEntryProperties = bibtexEntry.split(/[\n\r]/);
	newEntryProperties = [...new Set(newEntryProperties)]; // remove duplicate keys (e.g., occurring through date and year keys)

	// Generate citekey
	newCitekey = generateCitekey(newEntryProperties);
	newCitekey = ensureUniqueCitekey(newCitekey, libraryPath);
	newEntryProperties[0] = newEntryProperties[0].split("{")[0] + "{" + newCitekey + ",";

	// Create keywords field
	newEntryProperties.splice(1, 0, "\tkeywords = {},");

	// Write result
	const newEntry = newEntryProperties.join("\n");
	appendToFile(newEntry, libraryPath);

	// save title for auto-filing
	if (mode === "id+autofile") {
		const title = newEntry.match(/\btitle ? = .*/)[0];
		writeToFile(title, $.getenv("alfred_workflow_cache") + "/title.txt");
	}

	delay(0.1); // delay to ensure the file is written
	return newCitekey; // pass for opening function
}
