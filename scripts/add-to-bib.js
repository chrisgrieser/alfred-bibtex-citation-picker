#!/usr/bin/env osascript -l JavaScript

function run (argv) {

	const doiRegex = /\b10.\d{4,9}\/[-._;()/:A-Z0-9]+(?=$|[?/ ])/i; // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
	const isbnRegex = /^[\d-]{9,}$/;
	const isEmptyRegex = /^\s*$/;

	const bibtexEntryTemplate = "@misc{NEW_ENTRY,\n\tauthor = {Doe, Jane},\n\ttitle = {NEW_ENTRY},\n\tpages = {1--1},\n\tyear = 0000\n}\n";

	// ----------------------
	// JXA & Alfred specific
	// ----------------------
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const newLineDelimiter = "\r"; // must be /r instead of /n because JXA

	function appendToFile(text, absPath) {
		// ⚠️ use single quotes to prevent running of input such as "$(rm -rf /)"
		app.doShellScript (`echo '${text}' >> '${absPath}'`);
	}

	function readFile (path, encoding) {
		if (!encoding) encoding = $.NSUTF8StringEncoding;
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	}

	const input = argv.join("").trim();
	const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
	// ------------------

	function generateCitekey (bibtexPropertyArr) {
		function parseBibtexProperty (arr, property) {
			arr = arr
				.map(line => line.trim())
				.filter(p => p.startsWith(property + " "));
			if (!arr.length) return "";
			const value = arr[0]
				.split("=")[1]
				.replace(/{|}|,$/g, "")
				.trim();
			return value;
		}

		let year = parseBibtexProperty(bibtexPropertyArr, "year");
		if (!year) year = "ND";

		let authEds;
		const authors = parseBibtexProperty(bibtexPropertyArr, "author");
		const editors = parseBibtexProperty(bibtexPropertyArr, "editor");
		if (authors) authEds = authors;
		else if (editors) authEds = editors;
		else authEds = "NoAuthor";

		let authorStr;
		if (authEds === "NoAuthor") authorStr = authEds;
		else {
			const lastNameArr = authEds
				.split(" and ") // "and" used as delimiter in bibtex for names
				.map(name => {
					if (name.includes(",")) return name.split(",")[0].trim(); // ottobib returns "last name - first name"
					return name.split(" ").pop(); // doi.org returns "first name - last name"
				});

			if (lastNameArr.length < 3) authorStr = lastNameArr.join("");
			else authorStr = lastNameArr[0] + "EtAl";
		}

		// strip diacritics from authorStr
		authorStr = authorStr
			.replace(/ä|á|â|à|ã/g, "a")
			.replace(/Ä|Á|Â|À|Ã/g, "A")
			.replace(/ö|ó|ô|õ|ò|ø/g, "o")
			.replace(/Ö|Ó|Ô|Õ|Ò|Ø/g, "O")
			.replace(/ü|ú|û|ù/g, "u")
			.replace(/Ü|Ú|Û|Ù/g, "U")
			.replace(/é|ê|è|ë/g, "e")
			.replace(/É|Ê|È|Ë/g, "E")
			.replace(/í|î|ì|ï/g, "i")
			.replace(/Í|Î|Ì|Ï/g, "I")
			.replace(/ç|ć|č/g, "c")
			.replace(/Ç|Ć|Č/g, "C")
			.replace(/ñ/g, "n");

		const citekey = authorStr + year;

		// check if citekey already exists
		const citekeyArray = readFile(libraryPath)
			.split("\n")
			.filter(line => line.startsWith("@"))
			.map(line => line.split("{")[1].replaceAll(",", "") );

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

	// --------------------

	let bibtexEntry;

	const isDOI = doiRegex.test(input);
	const isISBN = isbnRegex.test(input);
	const isEmpty = isEmptyRegex.test(input);

	if (!isDOI && !isISBN && !isEmpty) return "ERROR";

	if (isDOI) {
		const doiURL = "https://doi.org/" + input.match(doiRegex)[0];

		// get bibtex entry & filter it
		bibtexEntry = app.doShellScript (`curl -sLH "Accept: application/x-bibtex" "${doiURL}"`); // https://citation.crosscite.org/docs.html
		if (bibtexEntry.includes("<title>Error: DOI Not Found</title>") || !bibtexEntry.includes("@")) return "ERROR";
		bibtexEntry = bibtexEntry.replace(/\t(month|issn) = .*\r/, ""); // clean up
	}

	if (isISBN) {
		const isbn = input;
		bibtexEntry = app.doShellScript (`curl -sHL "https://www.ebook.de/de/tools/isbn2bibtex?isbn=${isbn}"`);
		if (bibtexEntry === "Not found" || !bibtexEntry.includes("@")) return "ERROR";

		// clean up
		bibtexEntry = bibtexEntry
			.replaceAll("  ", "\t") // add proper indention
			.replace(/^\t\w+ =/gm, (field) => field.toLowerCase()) // lwoercase fields
			.replace(/^(\tpagetotal = {\d+) Seiten/m, "$1"); // remove German page word
	}

	// insert to append
	let newEntry;
	let newCitekey;
	if (isEmpty) {
		newEntry = bibtexEntryTemplate;
		newCitekey = "NEW_ENTRY";
	}

	if (isDOI || isISBN) {
		const newEntryProperties = bibtexEntry
			.split(newLineDelimiter)
			.filter(field => !(field.includes("\tean =") || field.includes("\tdate ="))); // remove garbage fields

		// Generate citekey
		newCitekey = generateCitekey(newEntryProperties);
		newEntryProperties[0] = newEntryProperties[0].split("{")[0] + "{" + newCitekey + ",";

		// Create keywords field
		newEntryProperties.splice(newEntryProperties.length-2, 0, "\tkeywords = {},");

		newEntry = newEntryProperties.join("\n") + "\n";
	}

	appendToFile(newEntry, libraryPath);
	return newCitekey; // pass for opening function
}
