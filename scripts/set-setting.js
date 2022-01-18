#!/usr/bin/env osascript -l JavaScript

function run (argv){

	// Basic
	ObjC.import('stdlib');
	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	let homepath = app.pathTo('home folder');

	//import variables
	var new_setting = argv.join("");
	new_setting = new_setting.replace (/^\/users\/[^\/]*(\/.*)$/g,"~$1");
	var setting_type = $.getenv('setting_type');
	var export_setting = false
	switch (setting_type) {
		case "date_to_append":
		case "slide_level":
		case "open_after":
			export_setting = true;
			break;
		default:
			break;
	}

	if (setting_type == "further_pandoc_args"){ export_setting = true; };

	// Set Setting
	Application('com.runningwithcrayons.Alfred').setConfiguration
   (setting_type, {
      toValue: new_setting,
      inWorkflow: $.getenv('alfred_workflow_bundleid'),
      exportable: export_setting}
   );

	//Alfred Splitter will work with ";;"
   function subt(){
   	return ";;" + new_setting;
   }

	// Notification
	switch (setting_type) {
		case "further_pandoc_args":
			return "✅ Further Pandoc Arguments set" + subt();
		case "reader_extensions":
			return "✅ Reader Extensions set" + subt();
		case "writer_extensions":
			return "✅ Writer Extensions set" + subt();
		case "pandoc_filter":
			return "✅ Pandoc Filters set" + subt();
		case "pandoc_template":
			return "✅ Pandoc Template set" + subt();
		case "hard_bib_search":
		case "bibtex_library_path":
			return "✅ BibTeX-Library set" + subt();
		case "second_library":
			return "✅ Second Library set" + subt();
		case "slide_level":
			return "✅ Slide Level set" + ";;" + "slide-level " + new_setting;
		case "citation_picker":
			return "✅ Now using: " + ";;" + new_setting + " Citation Picker";
		case "resource_path_subfolder":
			return "✅ Regular subfolder for resources set" + subt();
		case "date_to_append":
			return "✅ Date to Add: " + subt();
		case "pdf_engine":
			return "✅ PDF Engine set" + subt();
		case "reference_docx_path":
			return "✅ Reference Word Document set" + subt();
		case "reference_odt_path":
			return "✅ Reference OpenOffice Document set" + subt();
		case "reference_pptx_path":
			return "✅ Reference Powerpoint Presentation set" + subt();
		case "csl_file":
			return "✅ Citation Style selected" + subt();
		case "hotkey_output_format":
			return "✅ Hotkey Output Format set" + subt();
		case "open_after":
			return "✅ Open Output File after Conversion" + subt();
		case "link_citations_biblio":
			return "✅ Automatic Linking" + subt();
		default:
			return "error";
	}

}
