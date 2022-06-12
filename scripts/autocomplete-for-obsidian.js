#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function writeToFile(text, file) {
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
}

const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
const autocompleteListLocation = $.getenv("autocomplete_list_location").replace(/^~/, app.pathTo("home folder"));
app.doShellScript(`mkdir -p $(dirname '${autocompleteListLocation}')`);


// Import Hack, https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts
const toImport = "./scripts/bibtex-parser.js";
eval (app.doShellScript('cat "' + toImport + '"'));

const maxTitleLength = 50;
const delimiter = "|"; // https://tadashi-aikawa.github.io/docs-obsidian-various-complements-plugin/4.%20Options/4.6.%20Custom%20dictionary%20complement/%E2%9A%99%EF%B8%8FColumn%20delimiter/
const insertDisplayDelimiter = ">>>";


// ----------

const rawBibtex = app.doShellScript('cat "' + libraryPath + '"');
const entryArray = bibtexParse(rawBibtex) // eslint-disable-line no-undef
	.map (entry => {
		const { title, citekey, year, primaryNamesEtAlString, primaryNames } = entry;

		const toInsert = "[@" + citekey + "]"; // add Pandoc syntax
		const toDisplay = primaryNamesEtAlString + " " + year;

		let desc = title; // shorten title for better display in editor suggester
		if (title.length > maxTitleLength) desc = title.slice(0, maxTitleLength);

		// match authors/editors & citekey
		const toMatch = [citekey];
		primaryNames.forEach (name => toMatch.push(name));

		// https://tadashi-aikawa.github.io/docs-obsidian-various-complements-plugin/5.%20Terms/%F0%9F%93%9ACustom%20dictionaries/
		const line = [
			toDisplay + insertDisplayDelimiter + toInsert,
			desc,
			toMatch.join(delimiter)
		].join(delimiter);

		return line;
	});

const output = entryArray.join("\n");

writeToFile (output, autocompleteListLocation);
app.openLocation ("obsidian://advanced-uri?commandid=various-complements%253Areload-custom-dictionaries");
