#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/**
 * @param {string} envVar
 * @param {string} newValue
 */
function setFormat(envVar, newValue) {
	Application("com.runningwithcrayons.Alfred").setConfiguration("_format_" + envVar, {
		toValue: newValue,
		inWorkflow: $.getenv("alfred_workflow_bundleid"),
		exportable: true,
	});
}

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const citationFormat = argv[0];
	switch (citationFormat) {
		case "pandoc":
			// https://pandoc.org/MANUAL.html#citation-syntax
			setFormat("citation_start", "[");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "@");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		case "org":
			// https://orgmode.org/manual/Citations.html
			setFormat("citation_start", "[cite:");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "@");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		case "multi-markdown":
			setFormat("citation_start", "[");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", ";");
			setFormat("citekey_prefix", "#");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "true");
			setFormat("page_prefix", "");
			setFormat("page_suffix", "");
			break;
		case "latex":
			setFormat("citation_start", "\\cite{");
			setFormat("citation_end", "}");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "true");
			setFormat("page_prefix", "[");
			setFormat("page_suffix", "]");
			break;
		case "wikilink":
			setFormat("citation_start", "");
			setFormat("citation_end", "");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "[[");
			setFormat("citekey_suffix", "]]");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", "| ");
			setFormat("page_suffix", "");
			break;
		case "bracketed citekey":
			setFormat("citation_start", "(");
			setFormat("citation_end", ")");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		case "tag":
			setFormat("citation_start", "");
			setFormat("citation_end", "");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "#");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		case "bare citekey":
			setFormat("citation_start", "");
			setFormat("citation_end", "");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", ");
			setFormat("page_suffix", "");
			break;
		case "eta":
			setFormat("citation_start", "{% cite ");
			setFormat("citation_end", " --prefix %}");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		case "iA Writer":
			setFormat("citation_start", "[");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "^");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		default:
			app.openLocation(
				"https://github.com/chrisgrieser/alfred-bibtex-citation-picker/blob/main/README.md#further-format-customization",
			);
			break;
	}
}
