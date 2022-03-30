#!/usr/bin/env osascript -l JavaScript

function run (argv) {

	// ----------------------
	// JXA & Alfred specific
	// ----------------------
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function appendToFile(text, absPath) {
		// ⚠️ use single quotes to prevent running of input "$(rm -rf /)"
		app.doShellScript (`echo '${text}' >> '${absPath}'`);
	}

	function readFile (path, encoding) {
		if (!encoding) encoding = $.NSUTF8StringEncoding;
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	}

	const input = argv.join("");
	const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
	// ------------------

	const doiRegex = /^.*\/?(10\.\S+)\/?$/;
	const isbnRegex = /^[\d-]{9,}$/;

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
		const year = parseBibtexProperty(bibtexPropertyArr, "year");
		const authors = parseBibtexProperty(bibtexPropertyArr, "author");

		const lastNameArr = authors
			.split(" and ") // "and" used as delimiter in bibtex for names
			.map(name => {
				if (name.includes(",")) return name.split(",")[0].trim(); // ottobib returns "last name - first name"
				return name.split(" ").pop(); // doi.org returns "first name - last name"
			});

		let authorStr = "";
		if (lastNameArr.length < 3) authorStr = lastNameArr.join("");
		else authorStr = lastNameArr[0] + "EtAl";

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
	if (!isDOI && !isISBN) return "ERROR";

	if (isDOI) {
		// transform input into doiURL, since that's what doi.org requires
		const doiURL = input.replace(doiRegex, "https://doi.org/$1");
		// get bibtex entry & filter it & generate new citekey
		bibtexEntry = app.doShellScript (`curl -sLH "Accept: application/x-bibtex" "${doiURL}"`); // https://citation.crosscite.org/docs.html
		if (bibtexEntry.includes("<title>Error: DOI Not Found</title>")) return "ERROR";
	}

	if (isISBN) {
		const isbn = input;
		// INFO: implement alternative fetching via amazon.lead or ebooks.de API? https://github.com/jkitchin/org-ref/blob/master/org-ref-isbn.el#L131
		bibtexEntry = app.doShellScript (`curl -sHL "https://www.ottobib.com/isbn/${isbn}/bibtex"`);
		if (bibtexEntry.includes('id="flash-notice">No Results for')) return "ERROR";
		bibtexEntry = bibtexEntry
			.split(/<textarea.*?>/)[1].split("</textarea>")[0] // slice out only bibtex entry
			.replace(/^ /gm, "\t") // add proper indention
			.replace(/^\s}$/m, "}"); // don't indent closing brace
	}

	const newEntryProperties = bibtexEntry
		.split("\r") // must be /r instead of /n because JXA
		.filter (p => !p.startsWith("issn") && !p.startsWith("month") ); // remove unwanted properties
	const newCitekey = generateCitekey(newEntryProperties);
	newEntryProperties[0] = newEntryProperties[0].split("{")[0] + "{" + newCitekey + ",";

	// result
	const newEntry = newEntryProperties.join("\n") + "\n";
	appendToFile(newEntry, libraryPath);
	return newCitekey; // pass for opening
}
