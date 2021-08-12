#!/usr/bin/env osascript -l JavaScript

app = Application.currentApplication();
app.includeStandardAdditions = true;
var csl_list = app.doShellScript('curl -s "https://api.github.com/repos/citation-style-language/styles/git/trees/master?recursive=1" | grep ".csl" | cut -d ' + "'" + '"' + "'" + ' -f 4');
work_array = csl_list.split("\r");

String.prototype.toCapitalCase = function () {
   let capital = this.replace(/\w\S*/g, function(txt){
   	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
   });
   // replaceAll not needed, as there is no case where one of them appears more than once
   capital = capital.replace ("Fur ", "für ");
   capital = capital.replace ("For ", "for ");
   capital = capital.replace ("A ", "a ");
   capital = capital.replace ("An ", "an ");
   capital = capital.replace ("Of ", "of ");
   capital = capital.replace ("the ", "the ");
   capital = capital.replace (" And ", " & ");
   capital = capital.replace (" Und ", " & ");
   capital = capital.replace ("Ieee ", "IEEE ");
   capital = capital.replace ("Acm ", "ACM ");
   capital = capital.replace ("On ", "on ");
   capital = capital.replace ("Apa ", "APA ");
   capital = capital.replace ("Doi ", "DOI ");
   capital = capital.replace ("Koln ", "Köln ");
   capital = capital.replace ("Universitat ", "Universität ");
   return capital;
};

let jsonArray = [];
work_array.forEach(csl => {
	let title = csl.replace (/-|\.csl/g," ");
	title = title.replace("dependent/","");
	title = title.toCapitalCase();
	let url = "https://raw.githubusercontent.com/citation-style-language/styles/master/" + csl;
	jsonArray.push({
		'title': title,
		'subtitle': "",
		'arg': url,
	});
});

JSON.stringify({ items: jsonArray });
