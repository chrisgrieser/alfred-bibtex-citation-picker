#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const input = argv.join("");
	const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));

	function appendToFile(text, absPath) {
		// use single quotes to prevent running of input "$(rm -rf /)"
		app.doShellScript (`echo '${text}' >> '${absPath}'`);
	}

	// --------------------

	const doiURL = input.replace(/^.*\/?(10\.\S+)\/?$/, "https://doi.org/$1");
	const newEntryProperties = app.doShellScript (`curl -sLH "Accept: application/x-bibtex" "${doiURL}"`) // https://citation.crosscite.org/docs.html
		.split("\n") // can safely be used as delimiter since this is what doi.org returns
		.filter (p => !p.startsWith("issn") && !p.startsWith("month") ); // unwanted properties

	// result
	const newEntry = "\n" + newEntryProperties.join("\n") + "\n";
	appendToFile(newEntry, libraryPath);
	// return citekey; // for next function
}
