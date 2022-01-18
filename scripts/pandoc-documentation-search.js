#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;

var work_array = app.doShellScript(
   'curl -sL https://pandoc.org/MANUAL.html'
   + ' | grep -Eo "a href=\\"#[^\\"]*\\""'
   + ' | grep -vE "fnref|cb21|cb18|fn[[:digit:]]"'
   + ' | cut -d\\" -f2'
   + ' | sort | uniq'
).split("\r");

let jsonArray = [];
work_array.forEach(urlComponent => {
	let url = "https://pandoc.org/MANUAL.html" + urlComponent;
	let title = urlComponent.replace(/#option(?!s)/i, "Option:")
									.replace("#extension-", "Extension: ")
									.replace("#","")
									.replace("--", " ");
	title = title.charAt(0).toUpperCase() + title.slice(1);
	let alfredMatcher = title.replaceAll("-"," ") + " " + title;
	let subtitle = "";
	if (urlComponent.includes("--")) {
		subtitle = urlComponent.slice(1)
									  .replace(/options?|extension/i,"");
	} else {
		title = title.replaceAll ("-", " ");
	}

	jsonArray.push({
		'title': title,
		'subtitle': subtitle,
		'match': alfredMatcher,
		'arg': url,
	});
});

JSON.stringify({ items: jsonArray });
