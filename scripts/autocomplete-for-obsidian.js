#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

// Import Hack, https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts
const toImport = "./scripts/bibtex-parser.js";
eval (app.doShellScript('cat "' + toImport + '"'));

const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
const delimiter = "|"; // https://tadashi-aikawa.github.io/docs-obsidian-various-complements-plugin/4.%20Options/4.6.%20Custom%20dictionary%20complement/%E2%9A%99%EF%B8%8FColumn%20delimiter/
const maxTitleLength = 50;

// ----------

const rawBibtex = app.doShellScript('cat "' + libraryPath + '"');
const entryArray = bibtexParse(rawBibtex) // eslint-disable-line no-undef
	.map (entry => {
		let { citekey, title } = entry;
		const { year, authors, editors } = entry;

		// add for Pandoc syntax
		citekey = "[" + citekey + "]";

		// match authors/editors, and also their lowercase
		let namesToMatch = authors;
		if (!authors.length && editors.length) namesToMatch = editors;
		namesToMatch = namesToMatch.map (name => name + " " + name.toLowerCase());

		// shorten title for better display in editor suggester
		if (title.length > maxTitleLength) title = title.slice(0, maxTitleLength);

		// https://tadashi-aikawa.github.io/docs-obsidian-various-complements-plugin/5.%20Terms/%F0%9F%93%9ACustom%20dictionaries/
		const line = [
			citekey, // text to insert
			title, // description
			[...namesToMatch, year].join(" ") // match, using "partial" as matching strategy
		].join(delimiter);

		return line;
	});

// direct return
entryArray.join("\n");
