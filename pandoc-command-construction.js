#!/usr/bin/env osascript -l JavaScript

function run() {

	// =======================
	// Import Alfred Variables
	// =======================

	// Basics
	ObjC.import("stdlib");
	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const homepath = app.pathTo("home folder");

	// csl file
	var csl_file = $.getenv("csl_file");
	if (csl_file.includes("/")) {
		// up to version 4.3: citation style has full path
		csl_file = csl_file.replace(/^~/, homepath);
	} else {
		// beginning with version 4.4: citation style only
		// has filename and is saved in workflow folder
		var alfred_preferences = $.getenv("alfred_preferences");
		var alfred_workflow_uid = $.getenv("alfred_workflow_uid");
		csl_file = alfred_preferences + "/workflows/" +	alfred_workflow_uid +
			"/citation-styles/" + csl_file;
	}

	// other imports
	var bibtex_library_path = $.getenv("bibtex_library_path");
	bibtex_library_path = bibtex_library_path.replace(/^~/, homepath);
	var second_library = $.getenv("second_library");
	second_library = second_library.replace(/^~/, homepath);
	var reference_docx_path = $.getenv("reference_docx_path");
	reference_docx_path = reference_docx_path.replace(/^~/, homepath);
	var reference_pptx_path = $.getenv("reference_pptx_path");
	reference_pptx_path = reference_pptx_path.replace(/^~/, homepath);
	var pdf_engine = $.getenv("pdf_engine");
	var desired_format = $.getenv("desired_format");
	var slide_level = $.getenv("slide_level");
	var doc_path = $.getenv("doc_path");
	var resource_path_subfolder = $.getenv("resource_path_subfolder");
	var date_to_append = $.getenv("date_to_append");
	var further_pandoc_args = $.getenv("further_pandoc_args");

	// get today's date
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	switch (date_to_append) {
		case "normal":
			today = dd + "-" + mm + "-" + yyyy;
			break;
		case "american":
			today = mm + "-" + dd + "-" + yyyy;
			break;
		case "none":
			today = "";
			break;
	}

	// ===========================
	// construct pandoc parameters
	// ===========================
	var bibliography = "";
	var bibliography2 = "";
	var reference_docx = "";
	var pdf_arg = "";
	var reference_pptx = "";
	var second_ressource_path = "";

	//surrounds a string with quotation marks
	function quoted(str) {
		return "'" + str + "'";
	}

	//input & output
	var input = quoted(doc_path) + " ";
	var doc_without_ext = doc_path.replace(/\.[^\.]*$/, "");
	var output = "-o " + quoted(doc_without_ext + " " + today + "." + desired_format) + " ";

	//bibtex files
	if (bibtex_library_path != "") {
		bibliography = "--bibliography " + quoted(bibtex_library_path) + " ";
	}
	if (second_library != "") {
		bibliography2 = "--bibliography " + quoted(second_library) + " ";
	}

	//Misc
	var citation_style = "--csl " + quoted(csl_file) + " ";
	var slide_level_arg = "--slide-level=" + slide_level + " ";
	var further_args = further_pandoc_args + " ";
	if (reference_docx_path != "") {
		reference_docx = "--reference-doc " + quoted(reference_docx_path) + " ";
	}
	if (reference_pptx_path != "") {
		reference_pptx = "--reference-doc " + quoted(reference_pptx_path) + " ";
	}

	// PDF engines
	// with pdflatex for M1 workaround
	// see https://groups.google.com/g/pandoc-discuss/c/tWWIEgW94U0/m/yKMfldtYBgAJ
	if (pdf_engine == "pdflatex-arm") {
		pdf_engine = "/Library/TeX/texbin/pdflatex";
	}
	if (pdf_engine != "") {
		pdf_arg = "--pdf-engine=" + pdf_engine + " ";
	}

	//resource paths
	var resource_path = "--resource-path=" + quoted(parent_folder) + " ";
	var parent_folder = doc_path.replace(/[^\/]*$/, "");
	if (resource_path_subfolder != "") {
		second_ressource_path =	"--resource-path=" +
			quoted(parent_folder + resource_path_subfolder + "/") + " ";
	}

	// construct pandoc command
	var pandoc_command =
		"pandoc " +
		input +
		output +
		"--citeproc " +
		resource_path +
		second_ressource_path +
		bibliography +
		bibliography2 +
		citation_style +
		further_args +
		"--metadata link-citations=true ";

	//additions depending on output format
	switch (desired_format) {
		case "docx":
			pandoc_command += reference_docx;
			break;
		case "pdf":
			pandoc_command += pdf_arg;
			break;
		case "html":
			pandoc_command += "--standalone ";
			break;
		case "pptx":
			pandoc_command += reference_pptx + slide_level_arg;
			break;
	}

	return pandoc_command + "2>&1";
}
