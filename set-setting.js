#!/usr/bin/env osascript -l JavaScript

function run (argv){

	// Basic
	ObjC.import('stdlib');
	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	let homepath = app.pathTo('home folder');

	//import variables
	var new_setting = argv.join("");
	var setting_type = $.getenv('setting_type');
	var export_setting = false
	if (setting_type == "further_pandoc_args"){ export_setting = true; };

	// Set Setting
	Application('com.runningwithcrayons.Alfred').setConfiguration
   (setting_type, {
      toValue: new_setting,
      inWorkflow: $.getenv('alfred_workflow_bundleid'),
      exportable: export_setting}
   );

	// Notification
	switch (setting_type) {
		case "further_pandoc_args":
			return "✅ Further Pandoc Arguments set" + ";;" + new_setting;
		case "reader_extensions":
			return "✅ Reader Extensions set" + ";;" + new_setting;
		case "writer_extensions":
			return "✅ Writer Extensions set" + ";;" + new_setting;
		case "pandoc_filters":
			return "✅ Pandoc Filters set" + ";;" + new_setting;
		case "pandoc_template":
			return "✅ Pandoc Template set" + ";;" + new_setting;
		default:
			return "error";
	}

}
