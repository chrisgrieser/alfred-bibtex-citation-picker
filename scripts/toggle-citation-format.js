#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function setEnvVar (envVar, newValue) {
		Application("com.runningwithcrayons.Alfred")
			.setConfiguration(envVar, {
				toValue: newValue,
				inWorkflow: $.getenv("alfred_workflow_bundleid"),
				exportable: true
			});
	}

	const citationFormat = argv.join("");
	switch (citationFormat) {
		case "pandoc":
			setEnvVar("_format_citation_start", "[");
			setEnvVar("_format_citation_end", "]");
			setEnvVar("_format_citekey_delimiter", "; ");
			setEnvVar("_format_citekey_prefix", "@");
			setEnvVar("_format_citekey_suffix", "");
			setEnvVar("_format_page_before_citekey", "false");
			setEnvVar("_format_page_prefix", ", p. ");
			setEnvVar("_format_page_suffix", "");
			break;
		case "multi-markdown":
			setEnvVar("_format_citation_start", "[");
			setEnvVar("_format_citation_end", "]");
			setEnvVar("_format_citekey_delimiter", ";");
			setEnvVar("_format_citekey_prefix", "#");
			setEnvVar("_format_citekey_suffix", "");
			setEnvVar("_format_page_before_citekey", "true");
			setEnvVar("_format_page_prefix", "");
			setEnvVar("_format_page_suffix", "");
			break;
		case "latex":
			setEnvVar("_format_citation_start", "\\cite{");
			setEnvVar("_format_citation_end", "}");
			setEnvVar("_format_citekey_delimiter", ", ");
			setEnvVar("_format_citekey_prefix", "");
			setEnvVar("_format_citekey_suffix", "");
			setEnvVar("_format_page_before_citekey", "true");
			setEnvVar("_format_page_prefix", "[");
			setEnvVar("_format_page_suffix", "]");
			break;
		case "wikilink":
			setEnvVar("_format_citation_start", "");
			setEnvVar("_format_citation_end", "");
			setEnvVar("_format_citekey_delimiter", ", ");
			setEnvVar("_format_citekey_prefix", "[[");
			setEnvVar("_format_citekey_suffix", "]]");
			setEnvVar("_format_page_before_citekey", "false");
			setEnvVar("_format_page_prefix", "| ");
			setEnvVar("_format_page_suffix", "");
			break;
		case "tag":
			setEnvVar("_format_citation_start", "");
			setEnvVar("_format_citation_end", "");
			setEnvVar("_format_citekey_delimiter", ", ");
			setEnvVar("_format_citekey_prefix", "#");
			setEnvVar("_format_citekey_suffix", "");
			setEnvVar("_format_page_before_citekey", "false");
			setEnvVar("_format_page_prefix", ", p. ");
			setEnvVar("_format_page_suffix", "");
			break;
		case "bare citekey":
			setEnvVar("_format_citation_start", "");
			setEnvVar("_format_citation_end", "");
			setEnvVar("_format_citekey_delimiter", ", ");
			setEnvVar("_format_citekey_prefix", "");
			setEnvVar("_format_citekey_suffix", "");
			setEnvVar("_format_page_before_citekey", "false");
			setEnvVar("_format_page_prefix", ", ");
			setEnvVar("_format_page_suffix", "");
			break;
		case "eta":
			setEnvVar("_format_citation_start", "{% cite ");
			setEnvVar("_format_citation_end", " --prefix %}");
			setEnvVar("_format_citekey_delimiter", "; ");
			setEnvVar("_format_citekey_prefix", "");
			setEnvVar("_format_citekey_suffix", "");
			setEnvVar("_format_page_before_citekey", "false");
			setEnvVar("_format_page_prefix", ", p. ");
			setEnvVar("_format_page_suffix", "");
			break;
		case "iA Writer":
			setEnvVar("_format_citation_start", "[");
			setEnvVar("_format_citation_end", "]");
			setEnvVar("_format_citekey_delimiter", "; ");
			setEnvVar("_format_citekey_prefix", "^");
			setEnvVar("_format_citekey_suffix", "");
			setEnvVar("_format_page_before_citekey", "false");
			setEnvVar("_format_page_prefix", ", p. ");
			setEnvVar("_format_page_suffix", "");
			break;
		case "custom":
			app.openLocation("https://github.com/chrisgrieser/alfred-bibtex-citation-picker/blob/main/README.md#further-format-customization");
			break;
	}

}


