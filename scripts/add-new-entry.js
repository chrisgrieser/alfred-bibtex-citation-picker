#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} text @param {string} absPath */
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

//──────────────────────────────────────────────────────────────────────────────

/**
 * @param {string} citekey
 * @param {string} libraryPath
 */
function ensureUniqueCitekey(citekey, libraryPath) {
	// check if citekey already exists
	const existingCitekeys = readFile(libraryPath)
		.split("\n")
		.filter((line) => line.startsWith("@"))
		.map((line) => line.split("{")[1].slice(0, -1));

	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	let i = -1;
	let nextCitekey = citekey;
	while (existingCitekeys.includes(nextCitekey)) {
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
 * @param {number} origyear
 */
function generateCitekey(authors, year, origyear) {
	const yearStr = (origyear || year || "NY").toString();

	const lastNameArr = [];
	if (authors) {
		const author = authors.split(" and "); // "and" used as delimiter in bibtex for names
		for (const name of author) {
			// doi.org returns "firstName lastName", isbn mostly "lastName, firstName"
			const isLastFirst = name.includes(",");
			const lastName = isLastFirst ? name.split(",")[0].trim() : name.split(" ").pop();
			lastNameArr.push(lastName);
		}
	} else {
		lastNameArr.push("NoAuthor");
	}
	const authorStr = (lastNameArr.length < 3 ? lastNameArr.join("") : lastNameArr[0] + "EtAl")
		// strip diacritics https://stackoverflow.com/a/37511463
		.normalize("NFD")
		// biome-ignore lint/suspicious/noMisleadingCharacterClass: unclear
		.replace(/[\u0300-\u036f]/g, "")
		.replaceAll("-", ""); // no hyphens

	const citekey = authorStr + yearStr;
	return citekey;
}

//──────────────────────────────────────────────────────────────────────────────

/**
 * @param {string} input
 * @return {Record<string, any>|string} entryJson or error message
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: okay here
function inputToEntryJson(input) {
	const entry = {};

	const doiRegex = /\b10.\d{4,9}\/[-._;()/:A-Z0-9]+(?=$|[?/ ])/i; // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
	const isbnRegex = /^[\d-]{9,40}$/;
	const isDOI = doiRegex.test(input);
	const isISBN = isbnRegex.test(input);

	if (!isDOI && !isISBN) return "input invalid";

	// DOI
	// https://citation.crosscite.org/docs.html
	if (isDOI) {
		const doi = input.match(doiRegex);
		if (!doi) return "DOI invalid";
		const doiURL = "https://doi.org/" + doi[0];

		const response = app.doShellScript(
			`curl -sL -H "Accept: application/vnd.citationstyles.csl+json" "${doiURL}"`,
		);
		if (!response) return "No response by doi.org";
		const invalid =
			response.startsWith("<!DOCTYPE html>") || response.toLowerCase().includes("doi not found");
		if (invalid) return "DOI not found";

		const data = JSON.parse(response);

		entry.publisher = data.publisher;
		entry.author = (data.authors || data.author || [])
			.map(
				(/** @type {{ given: string; family: string; }} */ author) =>
					`${author.given} ${author.family}`,
			)
			.join(" and ");
		const published =
			data["published-print"] || data["published-online"] || data.published || null;
		entry.year = published ? published["date-parts"][0][0] : "NY";
		entry.doi = doi[0];
		entry.url = data.URL || doiURL;
		entry.type = data.type.replace(/-?journal-?/, ""); // "journal-article" -> "article"
		if (entry.type === "book-chapter") entry.type = "incollection";
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
		const response = app.doShellScript(
			`curl -sL "https://openlibrary.org/api/books?bibkeys=isbn:${isbn}&jscmd=details&format=json"`,
		);
		const fullData = response ? JSON.parse(response)["isbn:" + isbn] : {};
		const openLibraryHasData = response && fullData && Object.keys(fullData).length > 0;

		if (openLibraryHasData) {
			const data = fullData.details;

			entry.type = "book";
			entry.publisher = data.publishers.join(" and ");
			entry.title = data.title;
			entry.year = data.publish_date
				? Number.parseInt(data.publish_date.match(/\d{4}/)[0])
				: "NY";
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
			const response = app.doShellScript(
				`curl -sL "https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}"`,
			);
			if (!response) return "No response by Google Books API";
			const fullData = JSON.parse(response);
			if (fullData.totalItems === 0) return "ISBN not found";

			const data = fullData.items[0].volumeInfo;
			entry.type = "book";
			entry.year = Number.parseInt(data.publishedDate.split("-")[0]);
			entry.author = (data.authors || data.author || []).join(" and ");
			entry.isbn = isbn;
			entry.publisher = data.publisher;
			entry.title = data.title;
			if (data.subtitle) entry.title += ". " + data.subtitle;
			const bookAccessible = fullData.items[0].accessInfo.viewability !== "NO_PAGES";
			if (bookAccessible) entry.url = data.previewLink;
		}
	}

	return entry;
}

/**
 * @param {Record<string, any>} entryJson
 * @param {string} citekey
 * @return {string} newEntryAsBibTex
 */
function json2bibtex(entryJson, citekey) {
	const firstLine = `@${entryJson.type}{${citekey},`;
	const keywordsLine = "\tkeywords = {},";
	const lastLine = "}";
	const propertyLines = [];
	for (const key in entryJson) {
		if (key === "type") continue; // already inserted in first line
		let value = entryJson[key];
		if (!value) continue; // missing value
		if (typeof value === "string" && !value.match(/^\d+$/)) {
			// double-escape bibtex values to preserve capitalization, but not
			// author key, since it results in the author key being interpreted as
			// literal author name
			const hasCapitalLetter = value.match(/[A-Z]/);
			value = hasCapitalLetter && key !== "author" ? `{{${value}}}` : `{${value}}`;
		}
		propertyLines.push(`\t${key} = ${value},`);
	}
	propertyLines.sort(); // sorts alphabetically by key
	const newEntryAsBibTex = [firstLine, keywordsLine, ...propertyLines, lastLine].join("\n");
	return newEntryAsBibTex;
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const libraryPath = $.getenv("bibtex_library_path");
	const input = argv[0].trim();
	if (!input) return "No input provided";

	// Get entry data
	const entry = inputToEntryJson(input);
	if (typeof entry === "string") return entry; // error message
	if (!entry) return "Invalid input";

	// cleanup
	if (entry.publisher)
		entry.publisher = entry.publisher.replace(/gmbh|ltd|publications?|llc/i, "").trim();
	if (entry.pages) entry.pages = entry.pages.replace(/(\d+)[^\d]+?(\d+)/, "$1--$2"); // double-dash

	// citekey
	let citekey = generateCitekey(entry.author, entry.year, entry.origyear);
	citekey = ensureUniqueCitekey(citekey, libraryPath);

	// JSON -> bibtex & write
	const entryAsBibTex = json2bibtex(entry, citekey);
	appendToFile(entryAsBibTex, libraryPath);

	delay(0.1); // delay to ensure the file is written
	return citekey; // pass to opening function in Alfred
}
