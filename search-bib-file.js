#!/usr/bin/env osascript -l JavaScript

// Basic
ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

// Import
var current_bibfile = $.getenv("bibtex_library_path");
current_bibfile = current_bibfile.replace(/^~/, homepath);

//search for bibfiles
var input = app.doShellScript('find ~ -name "*.bib" -not -path ~"/.Trash/*" -not -name "temp_bibtex.bib" ');
var work_array = input.split("\r");

let jsonArray = [];
if (input != ""){
	work_array.forEach(bibfile_path => {
		let title = bibfile_path.replace (/.*\//g,"");
		let current = "";
		if (bibfile_path == current_bibfile) {
			current = "⭐️ ";
		}
		let subtitle = bibfile_path.replace (/^\/Users\/[^\/]*(\/.*)$/gi,"~$1");

		jsonArray.push({
			'title': current + title,
			'subtitle': subtitle,
			'arg': bibfile_path,
			'type': 'file:skipcheck',
			'uid': csl,
		});
	});
} else {
	jsonArray.push({
		'title': "😕 Still no library file found.",
		'subtitle': "Press [return] to read in the documentation how fix this issue.",
		'arg': "url",
	});
}

JSON.stringify({ items: jsonArray });
