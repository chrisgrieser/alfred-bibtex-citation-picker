#!/usr/bin/env osascript -l JavaScript

function run(argv) {

	// =======================
	// Import Alfred Variables
	// =======================

	// Basic
	ObjC.import("stdlib");
	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const homepath = app.pathTo("home folder");

	// csl file
	let csl_file = $.getenv("csl_file");
	if (csl_file.includes("/")) {
		// up to version 4.3: citation style has full path
		csl_file = csl_file.replace(/^~/, homepath);
	} else {
		// beginning with version 4.4: citation style only
		// has filename and is saved in workflow folder
		const alfred_preferences = $.getenv("alfred_preferences");
		const alfred_workflow_uid = $.getenv("alfred_workflow_uid");
		csl_file = alfred_preferences + "/workflows/" +	alfred_workflow_uid +
			"/citation-styles/" + csl_file;
	}

	// other imports
	const bibtex_library_path = ($.getenv("bibtex_library_path")).replace(/^~/, homepath);
	const second_library = ($.getenv("second_library")).replace(/^~/, homepath);
	const reference_docx_path = ($.getenv("reference_docx_path")).replace(/^~/, homepath);
	const reference_odt_path = ($.getenv("reference_odt_path")).replace(/^~/, homepath);
	const reference_pptx_path = ($.getenv("reference_pptx_path")).replace(/^~/, homepath);
	let pdf_engine = $.getenv("pdf_engine");
	const desired_format = $.getenv("desired_format");
	const slide_level = $.getenv("slide_level");
	const doc_path = $.getenv("doc_path");
	const resource_path_subfolder = $.getenv("resource_path_subfolder");
	const date_to_append = $.getenv("date_to_append");
	const further_pandoc_args = $.getenv("further_pandoc_args");
	const reader_extensions = $.getenv("reader_extensions");
	const writer_extensions = $.getenv("writer_extensions");
	const pandoc_template = $.getenv("pandoc_template");
	const pandoc_filter = $.getenv("pandoc_filter");
	const link_citations_biblio = $.getenv("link_citations_biblio");

	// get today's date & set it for the metadata date option
	let today = new Date();
	const dd = String(today.getDate()).padStart(2, "0");
	const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
	const yyyy = today.getFullYear();
	let date_metadata = "";
	switch (date_to_append) {
	case "normal":
		today = dd + "-" + mm + "-" + yyyy;
		date_metadata = "--metadata date=\"$(date \"+%e. %B %Y\")\" ";
		break;
	case "american":
		today = mm + "-" + dd + "-" + yyyy;
		date_metadata = "--metadata date=\"$(date \"+%B %e, %Y\")\" ";
		break;
	case "none":
		today = "";
		break;
	}

	// output file
	const output_file = doc_path.replace(/\.[^\.]*$/, "") + " " + today + "." + desired_format;

	// for later revealing in Finder
	Application("com.runningwithcrayons.Alfred").setConfiguration
	 	("output_file", {
		toValue: output_file,
		inWorkflow: $.getenv("alfred_workflow_bundleid"),
		exportable: false}
	);

	// ===========================
	// construct pandoc parameters
	// ===========================
	let bibliography = "";
	let bibliography2 = "";
	let reference_docx = "";
	let pdf_arg = "";
	let reference_pptx = "";
	let reference_odt = "";
	let reader_ext = "";
	let writer_ext = "";
	let template_arg = "";
	let filter_arg = "";

	// surrounds a string with quotation marks
	function quoted(str) {
		return "'" + str + "'";
	}

	// input & output
	const input = quoted(doc_path) + " ";
	const output = "-o " + quoted(output_file) + " ";

	// bibtex files
	if (bibtex_library_path != "") {
		bibliography = "--bibliography " + quoted(bibtex_library_path) + " ";
	}
	if (second_library != "") {
		bibliography2 = "--bibliography " + quoted(second_library) + " ";
	}

	// PDF engines
	// with pdflatex for M1 workaround
	// see https://groups.google.com/g/pandoc-discuss/c/tWWIEgW94U0/m/yKMfldtYBgAJ
	if (pdf_engine === "pdflatex-arm") {
		pdf_engine = "/Library/TeX/texbin/pdflatex";
	}
	if (pdf_engine !== "") {
		pdf_arg = "--pdf-engine=" + pdf_engine + " ";
	}

	// resource paths
	const parent_folder = doc_path.replace(/[^\/]*$/, "");
	let resource_path = "--resource-path=" + quoted(parent_folder) + " ";
	if (resource_path_subfolder != "") {
		resource_path += "--resource-path=" + quoted(parent_folder + resource_path_subfolder) + " ";
	}

	// Add Vault Paths as Resource Paths
	const vault_list_json = homepath + "/Library/Application Support/obsidian/obsidian.json";
	const vault_json = app.doShellScript("cat \"" + vault_list_json + "\" || echo \"none\" ");
	if (vault_json != "none"){
		vault_list = vault_json.match(/\"path\":\"(.*?)\"/g);
		const vault_paths = vault_list.map(v => v.replace(/\"path\":\"(.*?)\"/, "$1"));
		vault_paths.forEach (vpath =>	resource_path += "--resource-path=" + quoted(vpath) + " ");
	}

	// Extensions
	if (reader_extensions != ""){
		reader_ext = "--from=markdown" + reader_extensions + " ";
	}
	if (writer_extensions != ""){
		writer_ext = "--to=" + desired_format + writer_extensions + " ";
	}

	// Filters
	if (pandoc_filter != ""){
		filters = pandoc_filter.split (",");
		for (let i = 0; i < filters.length; i++) {
			// remove preceding spaces when user accidentally sets a comata
			filters[i] = filters[i].replace(/^ /, "");
			filters[i] = "--filter=" + quoted(filters[i]) + " ";
		}
		filter_arg = filters.join("");
	}

	// Reference Documents & Templates
	if (reference_docx_path != "") {
		reference_docx = "--reference-doc=" + quoted(reference_docx_path) + " ";
	}
	if (reference_odt_path != "") {
		reference_odt = "--reference-doc=" + quoted(reference_odt_path) + " ";
	}
	if (reference_pptx_path != "") {
		reference_pptx = "--reference-doc=" + quoted(reference_pptx_path) + " ";
	}
	if (pandoc_template != "") {
		template_arg = "--template=" + quoted(pandoc_template) + " ";
	}

	// Misc
	const citation_style = "--csl " + quoted(csl_file) + " ";
	const slide_level_arg = "--slide-level=" + slide_level + " ";
	const further_args = further_pandoc_args + " ";

	let automatic_linking = "--metadata link-citations=false --metadata link-bibliography=false ";
	if (link_citations_biblio == "true"){
		automatic_linking = "--metadata link-citations=true --metadata link-bibliography=true ";
	}


	// construct pandoc command
	let pandoc_command =
		"pandoc " +
		input +
		output +
		template_arg +
		filter_arg +
		"--citeproc " + // has to come after most filters
		resource_path +
		bibliography +
		bibliography2 +
		citation_style +
		further_args +
		reader_ext +
		writer_ext +
		automatic_linking +
		date_metadata;

	// additions depending on output format
	switch (desired_format) {
	case "docx":
		pandoc_command += reference_docx;
		break;
	case "odt":
		pandoc_command += reference_odt;
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
