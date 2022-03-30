#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const input = argv.join("");
	const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));

	function appendToFile(text, absPath) {
		// ⚠️ use single quotes to prevent running of input "$(rm -rf /)"
		app.doShellScript (`echo '${text}' >> '${absPath}'`);
	}

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
			.map(name => name.split(" ").pop() ); // doi.org returns format: "first name - last name"

		let authorStr = "";
		if (lastNameArr.length < 3) authorStr = lastNameArr.join("");
		else authorStr = lastNameArr[0] + "EtAl";

		return authorStr + year;
	}

	// --------------------

	// transform input into doiURL, sicne that's what doi.org requires
	const doiURL = input.replace(/^.*\/?(10\.\S+)\/?$/, "https://doi.org/$1");

	// get bibtex entry & filter it & generate new citekey
	const newEntryProperties = app.doShellScript (`curl -sLH "Accept: application/x-bibtex" "${doiURL}"`) // https://citation.crosscite.org/docs.html
		.split("\r") // can safely be used as delimiter since this is what doi.org returns, but must be /r instead of /n because JXA
		.filter (p => !p.startsWith("issn") && !p.startsWith("month") ); // remove unwanted properties
	const newCitekey = generateCitekey(newEntryProperties);
	newEntryProperties[0] = newEntryProperties[0].split("{")[0] + "{" + newCitekey + ",";

	// result
	const newEntry = newEntryProperties.join("\n") + "\n\n";
	appendToFile(newEntry, libraryPath);
	return newCitekey; // pass for notification
}
