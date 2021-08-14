#!/usr/bin/env osascript -l JavaScript

// Imports
app = Application.currentApplication();
app.includeStandardAdditions = true;
ObjC.import('stdlib');

//get currently installed
var current_csl = $.getenv('csl_file');
var local_csl_folder = $.getenv('alfred_preferences') + "/workflows/" + $.getenv('alfred_workflow_uid') + "/citation-styles/";
var local_csls = app.doShellScript('ls -1t "' + local_csl_folder + '"');
var local_csl_array = local_csls.split("\r");

// save local csl-folder for easier access in upcoming utility
Application('com.runningwithcrayons.Alfred').setConfiguration
   ('local_csl_folder', {
      toValue: local_csl_folder,
      inWorkflow: $.getenv('alfred_workflow_bundleid'),
      exportable: false}
   );

//get CSLs online
var csl_list = app.doShellScript('curl -s "https://api.github.com/repos/citation-style-language/styles/git/trees/master?recursive=1" | grep ".csl" | cut -d ' + "'" + '"' + "'" + ' -f 4');
var online_csl_array = csl_list.split("\r");

// Capitalize Function
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
   capital = capital.replace ("And ", "& ");
   capital = capital.replace ("Und ", "& ");
   capital = capital.replace ("Ieee ", "IEEE ");
   capital = capital.replace ("Acm ", "ACM ");
   capital = capital.replace ("On ", "on ");
   capital = capital.replace ("Apa ", "APA ");
   capital = capital.replace ("Doi ", "DOI ");
   capital = capital.replace ("Koln", "Köln");
   capital = capital.replace ("Universitat ", "Universität ");
   capital = capital.replace ("With ", "with ");
   capital = capital.replace ("No ", "no ");
   return capital;
};

// Build JSON
let jsonArray = [];

// local CSLs
local_csl_array.forEach(csl => {
	let title = csl.replace (/-|\.csl/g," ");
	title = title.toCapitalCase();
	let prefix = "❇️ ";
	let sub = "locally available";
	if (csl == current_csl){
		prefix = "✅ ";
		sub = "currently in use"
	}
	jsonArray.push({
		'title': prefix + title,
		'subtitle': sub,
		'arg': local_csl_folder + csl,
		'type': "file:skipcheck",
	});
});

// online CSLs
online_csl_array.forEach(csl => {
	let filename = csl.replace("dependent/","");
	let title = filename.replace (/-|\.csl/g," ");
	title = title.toCapitalCase();
	let url = "https://raw.githubusercontent.com/citation-style-language/styles/master/" + csl;
	let prefix = "";
	let sub = "";
	if (local_csl_array.includes (filename)){
		prefix = "🔄 ";
		sub = "Update local .csl with online version ";
	}
	jsonArray.push({
		'title': prefix + title,
		'subtitle': sub,
		'arg': url,
	});
});

JSON.stringify({ items: jsonArray });
