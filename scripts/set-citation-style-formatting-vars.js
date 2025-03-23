#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

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
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const citationFormat = argv[0];

	setFormat("current_citation_style", citationFormat);

	switch (citationFormat) {
		case "pandoc": {
			// https://pandoc.org/MANUAL.html#citation-syntax
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "[");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "@");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		}
		case "org": {
			// https://orgmode.org/manual/Citations.html
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "[cite:");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "@");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		}
		case "multi-markdown": {
			// https://fletcher.github.io/MultiMarkdown-6/syntax/citation.html
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "[");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", ";");
			setFormat("citekey_prefix", "#");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "true"); // `true` also disallows multi-citations
			setFormat("page_prefix", "[p. ");
			setFormat("page_suffix", "]");
			break;
		}
		case "latex": {
			// https://www.citedrive.com/en/docs/guides/biblatex/
			// https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues/62
			// `citation_super_prefix` is needed, as page numbers need to come after this
			setFormat("citation_super_prefix", "\\autocite");
			setFormat("citation_start", "{");
			setFormat("citation_end", "}");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "true"); // `true` also disallows multi-citations
			setFormat("page_prefix", "[p. ");
			setFormat("page_suffix", "]");
			break;
		}
		case "wikilink": {
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "");
			setFormat("citation_end", "");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "[[");
			setFormat("citekey_suffix", "]]");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", "| ");
			setFormat("page_suffix", "");
			break;
		}
		case "bracketed citekey": {
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "(");
			setFormat("citation_end", ")");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		}
		case "tag": {
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "");
			setFormat("citation_end", "");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "#");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		}
		case "bare citekey": {
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "");
			setFormat("citation_end", "");
			setFormat("citekey_delimiter", ", ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", ");
			setFormat("page_suffix", "");
			break;
		}
		case "eta": {
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "{% cite ");
			setFormat("citation_end", " --prefix %}");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		}
		case "iA Writer": {
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "[");
			setFormat("citation_end", "]");
			setFormat("citekey_delimiter", "; ");
			setFormat("citekey_prefix", "^");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "false");
			setFormat("page_prefix", ", p. ");
			setFormat("page_suffix", "");
			break;
		}
		case "formatted single entry": {
			// Uses separate module for pasting text. Values here set to empty
			// string just for clarity that they aren't used.
			setFormat("citation_super_prefix", "");
			setFormat("citation_start", "");
			setFormat("citation_end", "");
			setFormat("citekey_delimiter", "");
			setFormat("citekey_prefix", "");
			setFormat("citekey_suffix", "");
			setFormat("page_before_citekey", "");
			setFormat("page_prefix", "");
			setFormat("page_suffix", "");
			break;
		}
		default:
	}

	// for Alfred notification
	return citationFormat;
}
