#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));

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
		let { title } = entry;
		const { citekey, year, authors, editors } = entry;

		// add Pandoc syntax
		const toInsert = "[" + citekey + "]";

		// match authors/editors, and also their lowercase
		let namesToMatch;
		let toDisplay;
		if (!authors.length && editors.length) {
			namesToMatch = editors;
			toDisplay = entry.editorsEtAlString + " " + year;
		} else {
			namesToMatch = authors;
			toDisplay = entry.authorsEtAlString + " " + year;
		}
		const namesArr = [];
		namesToMatch.forEach (name => {
			namesArr.push(name);
			namesArr.push(name.toLowerCase());
		});

		// shorten title for better display in editor suggester
		if (title.length > maxTitleLength) title = title.slice(0, maxTitleLength);

		// https://tadashi-aikawa.github.io/docs-obsidian-various-complements-plugin/5.%20Terms/%F0%9F%93%9ACustom%20dictionaries/
		const line = [
			toDisplay + insertDisplayDelimiter + toInsert,
			title, // description
			...namesArr, year // matches, using "prefix" as matching strategy
		].join(delimiter);

		return line;
	});

// direct return
entryArray.join("\n");
