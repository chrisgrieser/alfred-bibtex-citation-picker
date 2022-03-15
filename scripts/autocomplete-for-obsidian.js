#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

// Import Hack, https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts
const toImport = "./scripts/bibtex-parser.js";
eval (app.doShellScript('cat "' + toImport + '"'));

const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));

const variousComplementsDelimiter = "|";

// ----------

const rawBibtex = app.doShellScript('cat "' + libraryPath + '"');
const entryArray = bibtexParse(rawBibtex) // eslint-disable-line no-undef
	.map (entry => {
		const { citekey, title } = entry;
		const line = [citekey, title].join(variousComplementsDelimiter);
		return line;
	});

// direct return
entryArray.join("\n");
