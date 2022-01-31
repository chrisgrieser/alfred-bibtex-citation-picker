#!/usr/bin/env osascript -l JavaScript
function run() {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const alfredBarLength = parseInt ($.getenv("alfred_bar_length"));
	const urlIcon = $.getenv("IconURL");
	const doiIcon = $.getenv("IconDOI");
	const library = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
	const library2 = $.getenv("second_library").replace(/^~/, app.pathTo("home folder"));

	// read bib file &  remove unnecessary info to increase speed
	let input = app.doShellScript("cat \"" + library + "\" | grep -vwE \"(abstract|annotate|Bdsk-Url-1|Bdsk-Url-2|date-modified|date-added|keywords|issn|langid|urlyear|isbn|location|pagetotal|series|eprint) =\" | grep -vw \"%%\"");
	if (library2) input += "\r" + app.doShellScript("cat \"" + library2 + "\" | grep -vwE \"(abstract|annotate|Bdsk-Url-1|Bdsk-Url-2|date-modified|date-added|keywords|issn|langid|urlyear|isbn|location|pagetotal|series|eprint) =\" | grep -vw \"%%\"");

	// BibTeX-Decoding
	const germanChars = ["{\\\"u};ü", "{\\\"a};ä", "{\\\"o};ö", "{\\\"U};Ü", "{\\\"A};Ä", "{\\\"O};Ö", "\\\"u;ü", "\\\"a;ä", "\\\"o;ö", "\\\"U;Ü", "\\\"A;Ä", "\\\"O;Ö", "\\ss;ß", "{\\ss};ß"];
	const otherChars = ["{\\~n};ñ", "{\\'a};á", "{\\'e};é", "{\\v c};č", "\\c{c};ç", "\\o{};ø", "\\^{i};î", "\\\"{i};î", "\\\"{i};ï", "{\\'c};ć", "\\\"e;ë"];
	const specialChars = ["\\&;&", "``;\"", "`;'", "\\textendash{};—", "---;—", "--;—"];
	const decodePair = [...germanChars, ...otherChars, ...specialChars];
	decodePair.forEach(pair => {
		const half = pair.split(";");
		input = input.replaceAll (half[0], half[1]);
	});

	const inputArray = input.split("@");
	const entryArray = [];

	// extracts content of a BibTeX-field
	function extract (str) {
		str = str.split(" = ")[1];
		return str.replace (/,$/, "");
	}

	inputArray.forEach(entry => {
		const properties = entry.split ("\r");
		let author = "";
		let title = "";
		let year = "";
		let editor = "";
		let url = "";
		let collection = "";
		let doi = "";
		let volume = "";
		let issue = "";
		let numberOfEditors = 0;
		const citekey = properties[0].replace (/.*{(.*),/, "$1");
		const type = properties[0].replace (/(.*){.*/, "$1");

		properties.forEach (property => {
			property = property.replace (/[{|}]/g, ""); // remove Tex

			if (property.includes ("author =")) {
				author = extract(property)
					.replace (/(, [A-Z]).+?(?= and|$)/gm, "") // remove first names
					.replaceAll (" and ", " & ")
					.replace (/&.*&.*/, "et al."); // insert et al
			}
			else if (property.includes ("editor =")) {
				editor = extract(property)
					.replace (/(, [A-Z]).+?(?= and|$)/gm, "") // remove first names
					.replaceAll (" and ", " & ");
				numberOfEditors = editor.split("&").length;
				editor = editor.replace (/&.*&.*/, "et al."); // insert et al
			}
			else if (/(^|\s)title =/i.test(property)) {
				title = extract(property);
				if (title.length > alfredBarLength) title = title.substring(0, alfredBarLength).trim() + "...";
			}
			else if (property.includes ("year =")) year = property.replace (/.*=\s*{?(\d{4}).*/, "$1");
			else if (property.includes ("date =")) year = property.replace (/.*=\s*{?(\d{4}).*/, "$1");
			else if (property.includes ("doi =")) doi = extract(property);
			else if (property.includes ("url =")) url = extract(property);
			else if (property.includes ("volume =")) volume = extract(property);
			else if (property.includes ("number =")) issue = "(" + extract(property) + ")";
			else if (/(^|\s)(journal|booktitle)\s*=/i.test(property)) collection = "    In: " + extract(property);

		});

		// if the initial reading of the file cut away the closing bracket, add it
		let bibtexEntry = "@" + entry;
		const openingBrackets = (bibtexEntry.match(/\{/g) || []).length;
		const closingBrackets = (bibtexEntry.match(/\}/g) || []).length;
		if (openingBrackets > closingBrackets) bibtexEntry = bibtexEntry + "}";

		// when no URL, try to use DOI
		let urlAppendix = "";
		let URLsubtitle = "⛔️ There is no URL or DOI.";
		if (url) {
			URLsubtitle = "⌃: Open URL " + urlIcon;
			urlAppendix = "    " + urlIcon;
			if (doi) urlAppendix = urlAppendix + " " + doiIcon;
		} else if (doi) {
			URLsubtitle = "⌃: Open DOI " + doiIcon;
			urlAppendix = "    " + doiIcon;
		}

		// icon selection
		let typeIcon = "icons/";
		switch (type) {
			case "article":
				typeIcon += "article.png";
				collection = collection + " " + volume + issue;
				break;
			case "incollection":
			case "inbook":
				typeIcon += "book_chapter.png";
				break;
			case "misc":
			case "unpublished":
				typeIcon += "manuscript.png";
				break;
			case "book":
				typeIcon += "book.png";
				break;
			case "techreport":
				typeIcon += "technical_report.png";
				break;
			case "inproceedings":
				typeIcon += "conference.png";
				break;
			case "online":
			case "webpage":
				typeIcon += "website.png";
				break;
		}

		// determines correct editor-abbreviation
		let editorAbbrev = "(Ed.)";
		if (numberOfEditors > 1) editorAbbrev = "(Eds.)";

		// displays editor when there are no authors
		let authoreditor = author + " ";
		if (!author && editor) authoreditor = editor + " " + editorAbbrev + " ";
		else if (!author && !editor) authoreditor = "";

		const alfredMatcher = [title, author, editor, year, collection, citekey]
			.join(" ")
			.replaceAll ("-", " ");

		entryArray.push ({
			"title": title,
			"autocomplete": authoreditor,
			"subtitle": authoreditor + year + collection + urlAppendix,
			"match": alfredMatcher,
			"arg": "@" + citekey,
			"icon": { "path": typeIcon },
			"uid": citekey,
			"text": { "copy": url },
			"mods": {
				"ctrl": {
					"valid": (url !== ""),
					"arg": url,
					"subtitle": URLsubtitle,
				},
				"fn": { "arg": bibtexEntry }
			}
		});
	});

	return JSON.stringify({ "items": entryArray });
}
