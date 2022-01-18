#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib');
var setting_type = $.getenv('setting_type');
var url = "";
switch (setting_type) {
	case "pdf_engine":
		url = "https://www.notion.so/chrisgrieser/Pandoc-Suite-for-Academic-Citation-and-Bibliography-Creation-in-Markdown-4de4bd634ceb4533a1add8b105a487b1#f1fc8aca886a4b17afbbd67cda664194";
		break;
	case "workflow_documentation":
		url = "https://chris-grieser.de/pandoc_alfred";
		break;
	case "slide_level":
		url = "https://pandoc.org/MANUAL.html#structuring-the-slide-show";
		break;
	case "hard_bib_search":
		url = "https://www.notion.so/chrisgrieser/Pandoc-Suite-and-BibTeX-Zotero-Citation-Picker-for-Academic-Writing-in-Markdown-4de4bd634ceb4533a1add8b105a487b1#fee2253fe00c4e62a6f2a818dd4397c3";
		break;
}

app = Application.currentApplication();
app.includeStandardAdditions = true;
app.openLocation(url);


