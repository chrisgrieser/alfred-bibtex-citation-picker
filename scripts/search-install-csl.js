#!/usr/bin/env osascript -l JavaScript

// Imports
const app = Application.currentApplication();
app.includeStandardAdditions = true;
ObjC.import("stdlib");

String.prototype.toCapitalCase = function () {
	const capital = this.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
	});
	return capital
		.replace ("Fur ", "für ")
		.replace ("For ", "for ")
		.replace ("A ", "a ")
		.replace ("An ", "an ")
		.replace ("Of ", "of ")
		.replace ("the ", "the ")
		.replace ("And ", "& ")
		.replace ("Und ", "& ")
		.replace ("Ieee ", "IEEE ")
		.replace ("Acm ", "ACM ")
		.replace ("On ", "on ")
		.replace ("Apa ", "APA ")
		.replace ("Doi ", "DOI ")
		.replace ("Koln", "Köln")
		.replace ("Universitat ", "Universität ")
		.replace ("With ", "with ")
		.replace ("No ", "no ");
};

// get currently installed
const localCSLs = app.doShellScript("ls -t $HOME/.pandoc/csl")
	.split("\r");

const onlineCSLs = JSON.parse(app.doShellScript("curl -s \"https://api.github.com/repos/citation-style-language/styles/git/trees/master?recursive=1\""))
	.tree
	.map(item => item.path)
	.filter (item => item.endsWith(".csl"))
	.map(csl => {
		let prefix = "";
		let sub = "";
		let dependentMatch = "";

		let filename = csl;
		if (filename.startsWith("dependent/")) {
			sub += "[dependent] ";
			dependentMatch = " dependent";
			filename = filename.slice(10);
		}
		if (localCSLs.includes (filename)) {
			prefix = "✅ ";
			sub += "↵: Update local .csl file. ";
		}

		const title = filename
			.slice (0, -4)
			.replaceAll ("-", " ")
			.toCapitalCase();
		return {
			"title": prefix + title,
			"subtitle": sub,
			"match": title + dependentMatch,
			"arg": "https://raw.githubusercontent.com/citation-style-language/styles/master/" + csl,
		};
	});

JSON.stringify({ items: onlineCSLs });
