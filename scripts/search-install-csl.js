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
const CSLfolder= $.getenv("csl_folder").replace(/^~/, app.pathTo("home folder"));
const localCSLs = app.doShellScript("ls -t \"" + CSLfolder + "\"")
	.split("\r");

const onlineCSLs = JSON.parse(app.doShellScript("curl -s \"https://api.github.com/repos/citation-style-language/styles/git/trees/master?recursive=1\""))
	.tree
	.map(item => item.path)
	.filter (item => item.endsWith(".csl"))
	.map(csl => {
		const filename = csl.replace("dependent/", "");
		const title = filename.replace (/-|\.csl/g, " ")
			.toCapitalCase();
		const url = "https://raw.githubusercontent.com/citation-style-language/styles/master/" + csl;
		let prefix = "";
		let sub = "";
		if (localCSLs.includes (filename)) {
			prefix = "🔄 ";
			sub = "Update local .csl with online version ";
		}
		return {
			"title": prefix + title,
			"subtitle": sub,
			"arg": url,
		};
	});

JSON.stringify({ items: onlineCSLs });
