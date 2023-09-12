#!/usr/bin/env osascript -l JavaScript

//──────────────────────────────────────────────────────────────────────────────

// JXA & Alfred specific
ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/**
 * @param {string} text
 * @param {string} absPath
 */
function appendToFile(text, absPath) {
	const clean = text.replaceAll("'", "`"); // ' in text string breaks echo writing method
	app.doShellScript(`echo '${clean}' >> '${absPath}'`); // use single quotes to prevent running of input such as "$(rm -rf /)"
}

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

/**
 * @param {string} filepath
 * @param {string} text
 */
function writeToFile(filepath, text) {
	app.doShellScript(`mkdir -p "$(dirname "${filepath}")"`);
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(filepath, true, $.NSUTF8StringEncoding, null);
}

//──────────────────────────────────────────────────────────────────────────────

/**
 * @param {string} citekey
 * @param {string} libraryPath
 */
function ensureUniqueCitekey(citekey, libraryPath) {
	// check if citekey already exists
	const citekeyArray = readFile(libraryPath)
		.split("\n")
		.filter((line) => line.startsWith("@"))
		.map((line) => line.split("{")[1].slice(0, -1));

	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	let i = -1;
	let nextCitekey = citekey;
	while (citekeyArray.includes(nextCitekey)) {
		const firstLoop = i === -1;
		const nextLetter = firstLoop ? "" : alphabet[i];
		nextCitekey = citekey + nextLetter;
		i++;
		if (i > alphabet.length - 1) break; // in case the citekey is already used 27 times (lol)
	}
	return nextCitekey;
}

/**
 * @param {string} authors all authors in one string joined with " and "
 * @param {number} year
 */
function generateCitekey(authors, year) {
	const yearStr = year ? year.toString() : "NY";

	const lastNameArr = [];
	if (!authors) lastNameArr.push("NoAuthor");
	else {
		const author = authors.split(" and "); // "and" used as delimiter in bibtex for names
		for (const name of author) {
			const isLastFirst = name.includes(","); // doi.org returns "first last", isbn mostly "last, first"
			const lastName = isLastFirst ? name.split(",")[0].trim() : name.split(" ").pop();
			lastNameArr.push(lastName);
		}
	}
	const authorStr = (lastNameArr.length < 3 ? lastNameArr.join("") : lastNameArr[0] + "EtAl")
		// strip diacritics https://stackoverflow.com/a/37511463
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		// no hyphens
		.replaceAll("-", "");

	const citekey = authorStr + yearStr;
	return citekey;
}

//──────────────────────────────────────────────────────────────────────────────

/** @param {string} input */
function inputToEntryData(input) {
	const entry = {};

	const doiRegex = /\b10.\d{4,9}\/[-._;()/:A-Z0-9]+(?=$|[?/ ])/i; // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
	const isbnRegex = /^[\d-]{9,}$/;
	const isDOI = doiRegex.test(input);
	const isISBN = isbnRegex.test(input);
	const mode = $.getenv("mode");

	if (!(isDOI || isISBN || mode === "parse")) return { error: "input invalid" };

	// DOI
	// https://citation.crosscite.org/docs.html
	if (isDOI) {
		const doi = input.match(doiRegex);
		if (!doi) return { error: "DOI invalid" };
		const doiURL = "https://doi.org/" + doi[0];

		const response = app.doShellScript(
			`curl -sL -H "Accept: application/vnd.citationstyles.csl+json" "${doiURL}"`,
		);
		if (!response) return { error: "No response by doi.org" };
		if (response.startsWith("<!DOCTYPE html>") || response.toLowerCase().includes("doi not found"))
			return { error: "DOI not found" };

		const data = JSON.parse(response);

		entry.publisher = data.publisher;
		entry.author = (data.authors || data.author || [])
			.map((/** @type {{ given: any; family: any; }} */ author) => `${author.given} ${author.family}`)
			.join(" and ");
		const published = data["published-print"] || data["published-online"] || data.published || null;
		entry.year = published ? published["date-parts"][0][0] : "NY";
		entry.doi = doi[0];
		entry.url = data.URL || doiURL;
		entry.type = data.type.replace(/-?journal-?/, ""); // "journal-article" -> "article"
		entry.title = data.title;
		if (entry.type === "article") {
			entry.journal = data["container-title"];
			entry.number = data.issue;
			entry.volume = data.volume;
			entry.pages = data.page;
		}
	}

	// ISBN: Google Books & OpenLibrary
	// https://www.vinzius.com/post/free-and-paid-api-isbn/
	else if (isISBN) {
		const isbn = input;
		// first tries OpenLibrary API, then Google Books API

		// OPENLIBRARY -- https://openlibrary.org/developers/api
		console.log("Attempting Open Library API…");
		const response = app.doShellScript(
			`curl -sL "https://openlibrary.org/api/books?bibkeys=isbn:${isbn}&jscmd=details&format=json"`,
		);
		if (!response) console.log("No response by OpenLibrary API");
		const fullData = response ? JSON.parse(response)["isbn:" + isbn] : {};
		const openLibraryHasData = response && fullData && Object.keys(fullData).length > 0;

		if (openLibraryHasData) {
			console.log("Open Library Data found.");
			const data = fullData.details;

			entry.type = "book";
			entry.publisher = data.publishers.join(" and ");
			entry.title = data.title;
			entry.year = parseInt(data.publish_date.split(",")[1].trim());
			entry.author = (data.authors || data.author || [])
				.map((/** @type {{ name: string; }} */ author) => author.name)
				.join(" and ");
			entry.isbn = isbn;
			if (data.subtitle) entry.title += ". " + data.subtitle;
			const bookAccessible = fullData.preview !== "noview";
			if (bookAccessible) entry.url = data.preview_url;
		}

		// GOOGLE BOOKS -- https://developers.google.com/books/docs/v1/using
		else {
			console.log("Attempting Google Books API…");
			const response = app.doShellScript(
				`curl -sL "https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}"`,
			);
			if (!response) {
				console.log("No response by Google Books API");
				return { error: "No response by Google Books API" };
			}
			const fullData = JSON.parse(response);
			if (fullData.totalItems === 0) return { error: "ISBN not found" };
			console.log("Google Books Data found.");

			const data = fullData.items[0].volumeInfo;
			entry.type = "book";
			entry.year = parseInt(data.publishedDate.split("-")[0]);
			entry.author = (data.authors || data.author || []).join(" and ");
			entry.isbn = isbn;
			entry.publisher = data.publisher;
			entry.title = data.title;
			if (data.subtitle) entry.title += ". " + data.subtitle;
			const bookAccessible = fullData.items[0].accessInfo.viewability !== "NO_PAGES";
			if (bookAccessible) entry.url = data.previewLink;
		}
	}

	// anystyle
	else if (mode === "parse") {
		// validate installation
		const anystyleInstalled = app.doShellScript("command -v anystyle || true") !== "";
		if (!anystyleInstalled) return { error: "anystyle not found" };

		// INFO anystyle can't read STDIN, so this has to be written to a file
		// https://github.com/inukshuk/anystyle-cli#anystyle-help-parse
		const tempPath = $.getenv("alfred_workflow_cache") + "/temp.txt";
		writeToFile($.getenv("raw_entry"), tempPath);
		const response = app.doShellScript(`anystyle --stdout --format=csl parse "${tempPath}"`);

		const data = JSON.parse(response)[0];
		entry.title = data.title;
		entry.type = data.type.replace(/-?journal-?/, ""); // "journal-article" -> "article"
		entry.author = (data.authors || data.author || [])
			.map((/** @type {{ given: any; family: any; }} */ author) => `${author.given} ${author.family}`)
			.join(" and ");
		entry.year = parseInt(data.issued);
		if (entry.type === "article") {
			entry.journal = data["container-title"];
			entry.number = data.issue;
			entry.volume = data.volume;
			entry.pages = data.page;
		} else if (entry.type === "incollection") {
			entry.booktitle = data["container-title"];
		}
	}

	return entry;
}

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const libraryPath = $.getenv("bibtex_library_path");
	const input = argv[0].trim();
	if (!input) return "No input provided";

	// Get entry data
	const entry = inputToEntryData(input);
	if (entry.error) return entry.error;

	// cleanup
	if (entry.publisher) entry.publisher = entry.publisher.replace(/gmbh|ltd|publications?|llc/i, "").trim();
	if (entry.pages) entry.pages = entry.pages.replace(/(\d+)[^\d]+?(\d+)/, "$1--$2"); // double-dash

	// citekey
	let citekey = generateCitekey(entry.author, entry.year);
	citekey = ensureUniqueCitekey(citekey, libraryPath);

	// JSON -> bibtex
	const firstLine = `@${entry.type}{${citekey},`;
	const keywordsLine = "\tkeywords = {},";
	const lastLine = "}";
	const propertyLines = [];
	for (const key in entry) {
		if (key === "type") continue; // already inserted in first line
		let value = entry[key];
		if (typeof value === "string") { // escape bibtex values
			value = "{" + value + "}";
			if (value.match(/[A-Z]/)) value = "{" + value + "}";
		}
		propertyLines.push(`\t${key} = ${value},`);
	}
	propertyLines.sort(); // sorts alphabetically by key
	// remove comma from last entry
	propertyLines[propertyLines.length - 1] = propertyLines[propertyLines.length - 1].slice(0, -1);

	// Write result
	const newEntryAsBibTex = [firstLine, keywordsLine, ...propertyLines, lastLine].join("\n");
	appendToFile(newEntryAsBibTex, libraryPath);

	// Copy Citation
	const copyCitation = $.getenv("copy_citation_on_adding_entry") === "1";
	if (copyCitation) {
		const pandocCitation = `[@${citekey}]`;
		app.setTheClipboardTo(pandocCitation);
	}

	delay(0.1); // delay to ensure the file is written
	return citekey; // pass for opening function
}
