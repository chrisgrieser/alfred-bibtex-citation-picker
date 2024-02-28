#!/usr/bin/env osascript -l JavaScript
const app = Application.currentApplication();
app.includeStandardAdditions = true;
ObjC.import("stdlib");
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} url @return {string} */
function httpRequest(url) {
	const queryURL = $.NSURL.URLWithString(url);
	const data = $.NSData.dataWithContentsOfURL(queryURL);
	const requestStr = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js;
	return requestStr;
}

/** @param {string} str */
function fixCasing(str) {
	return str
		.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.replace("Fur ", "für ")
		.replace("For ", "for ")
		.replace("A ", "a ")
		.replace("An ", "an ")
		.replace("Of ", "of ")
		.replace("the ", "the ")
		.replace("And ", "& ")
		.replace("Und ", "& ")
		.replace("Ieee ", "IEEE ")
		.replace("Acm ", "ACM ")
		.replace("On ", "on ")
		.replace("Apa ", "APA ")
		.replace("Doi ", "DOI ")
		.replace("Koln", "Köln")
		.replace("Universitat ", "Universität ")
		.replace("With ", "with ")
		.replace("No ", "no ");
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	// $csl_folder set as Alfred environment variable
	const localCSLs = app.doShellScript('ls -t "$csl_folder"').split("\r");

	const apiUrl =
		"https://api.github.com/repos/citation-style-language/styles/git/trees/master?recursive=1";
	const baseUrl = "https://raw.githubusercontent.com/citation-style-language/styles/master/";

	const onlineCSLs = JSON.parse(httpRequest(apiUrl))
		.tree.map((/** @type {{ path: string; }} */ item) => item.path)
		.filter((/** @type {string} */ item) => item.endsWith(".csl"))
		.map((/** @type {string} */ csl) => {
			let prefix = "";
			let sub = "";
			let dependentMatch = "";

			let filename = csl;
			if (filename.startsWith("dependent/")) {
				sub += "[dependent] ";
				dependentMatch = " dependent";
				filename = filename.slice(10);
			}
			if (localCSLs.includes(filename)) {
				prefix = "✅ ";
				sub += "↵: Update local .csl file. ";
			}

			const title = filename.slice(0, -4).replaceAll("-", " ");
			return {
				title: prefix + fixCasing(title),
				subtitle: sub,
				match: title + dependentMatch,
				arg: baseUrl + csl,
			};
		});

	return JSON.stringify({
		items: onlineCSLs,
		cache: {
			seconds: 3600 * 24,
			loosereload: true,
		},
	});
}
