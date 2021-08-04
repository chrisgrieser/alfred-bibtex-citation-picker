#!/usr/bin/env osascript -l JavaScript

function run() {

	// Import Alfred Variables
	ObjC.import("stdlib");
	var csl_file = $.getenv("csl_file");
	var bibtex_library_path = $.getenv("bibtex_library_path");
	var reference_docx_path = $.getenv("reference_docx_path");
	var reference_pptx_path = $.getenv("reference_pptx_path");
	var further_pandoc_args = $.getenv("further_pandoc_args");
	var second_library = $.getenv("second_library");
	var pdf_engine = $.getenv("pdf_engine");
	var desired_format = $.getenv("desired_format");
	var slide_level = $.getenv("slide_level");
	var doc_path = $.getenv("doc_path");
	var resource_path_subfolder = $.getenv("resource_path_subfolder");
	var date_to_append = $.getenv("date_to_append");

	// get today's date
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	switch (date_to_append) {
		case "normal":
			today = dd + '-' + mm + '-' + yyyy;
			break;
		case "american":
			today = mm + '-' + dd + '-' + yyyy;
			break;
		case "none":
			today = "";
	}

	//surrounds a string with quotation marks
	function quoted(str) {
		return "'" + str + "'";
	}

	// construct pandoc parameters
	var bibliography = "";
	var bibliography2 = "";
	var reference_docx = "";
	var pdf_arg = "";
	var reference_pptx = "";
	var second_ressource_path = "";

	//input & output
	var input = quoted (doc_path) + " ";
	var doc_without_ext = doc_path.replace (/\.[^\.]*$/, "");
	var output = "-o " + quoted (doc_without_ext + " " + today + "." + desired_format) + " ";

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
	// pdflatex for M1 workaround, see https://groups.google.com/g/pandoc-discuss/c/tWWIEgW94U0/m/yKMfldtYBgAJ
	if (pdf_engine == "pdflatex-arm") {
		pdf_engine = "/Library/TeX/texbin/pdflatex";
	}
	if (pdf_engine != "") {
		pdf_arg = "--pdf-engine=" + pdf_engine + " ";
	}

	//resource paths
	var resource_path = "--resource-path=" + quoted (parent_folder) + " ";
	var parent_folder = doc_path.replace (/[^\/]*$/,"");
	if (resource_path_subfolder != "") {
		second_ressource_path = "--resource-path=" + quoted (parent_folder + resource_path_subfolder + "/") + " ";
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
