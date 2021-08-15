#!/usr/bin/env osascript -l JavaScript

function run (){
	ObjC.import('stdlib');

	var subject = "[Pandoc-Suite] Issue Report";
	var msg ="Please report your issue here. Be sure to attach some screenshots and ideally also a debugging log as those help me to identify your problem more quickly. \n You can get a debugging log by opening the workflow in Alfred preferences and pressing cmd + D. A small window will open up which will log everything happening during the execution of the Pandoc-Suite. Use the Pandoc-Suite once more, copypaste the content of the log window, and attach it as a text file in your mail.\n\n---\n" +
	"Alfred Version: " + $.getenv('alfred_version') + "\n" +
	"Pandoc-Suite Version: " + $.getenv('alfred_workflow_version');

	var mailto =
		"mailto:grieser.chris+pandoc@gmail.com" +
		"?subject=" + encodeURIComponent(subject) +
		"&body=" + encodeURIComponent(msg);

	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.openLocation(mailto);

}


