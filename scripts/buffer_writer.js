#!/usr/bin/env osascript -l JavaScript
function run() {

	// -------------------------------
	// IMPORTS & FUNCTIONS
	// -------------------------------

	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const urlIcon = "🌐";
	const literatureNoteIcon = "📓";
	const tagIcon = "🏷";
	const alfredBarLength = parseInt ($.getenv("alfred_bar_length"));
	const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
	const literatureNoteFolder = $.getenv("literature_note_folder").replace(/^~/, app.pathTo("home folder"));

	String.prototype.BibtexDecode = function () {
		const germanChars = ["{\\\"u};ü", "{\\\"a};ä", "{\\\"o};ö", "{\\\"U};Ü", "{\\\"A};Ä", "{\\\"O};Ö", "\\\"u;ü", "\\\"a;ä", "\\\"o;ö", "\\\"U;Ü", "\\\"A;Ä", "\\\"O;Ö", "\\ss;ß", "{\\ss};ß"];
		const otherChars = ["{\\~n};ñ", "{\\'a};á", "{\\'e};é", "{\\v c};č", "\\c{c};ç", "\\o{};ø", "\\^{i};î", "\\\"{i};î", "\\\"{i};ï", "{\\'c};ć", "\\\"e;ë", "\\'E;É"];
		const specialChars = ["\\&;&", "``;\"", "`;'", "\\textendash{};—", "---;—", "--;—"];
		const decodePair = [...germanChars, ...otherChars, ...specialChars];
		let str = this;
		decodePair.forEach(pair => {
			const half = pair.split(";");
			str = str.replaceAll (half[0], half[1]);
		});
		return str;
	};

	// extracts content of a BibTeX-field & removes TeX formatting
	const extract = str => str.split(" = ")[1].replace (/{|}|,$/g, "");

	// -------------------------------
	// MAIN
	// -------------------------------

	const literatureNoteArray = app.doShellScript('ls "' + literatureNoteFolder + '"')
		.split("\r")
		.map (filename => filename.slice(0, -3)); // remove file extension (assuming .md)

	console.log("before");
	const entryArray = app.doShellScript('grep -vwE "(abstract|annotate|annotation|eprint|Bdsk-Url-1|Bdsk-Url-2|date-modified|date-added|issn|langid|urlyear|entrysubtype|isbn|location|pagetotal|series|eprint) =" "' + libraryPath + '"') // remove unnecessary info to increase speed
		.BibtexDecode()
		.split("@")
		.slice(1) // first element is only BibTeX metadata
		.map(entry => {
			let author = "";
			let title = "";
			let year = "";
			let editor = "";
			let url = "";
			let booktitle = "";
			let journal = "";
			let doi = "";
			let volume = "";
			let issue = "";
			let keywords = "";
			const emojis = [];
			let numberOfEditors = 0;

			// extract properties
			const properties = entry.split ("\r");
			const citekey = "@" + properties[0].replace (/.*{(.*),/, "$1");
			const type = properties[0].replace (/(.*){.*/, "$1");

			properties.forEach (property => {
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
					if (title.length > alfredBarLength) title = title.substring(0, alfredBarLength).trim() + "…";
				}
				else if (property.includes ("year =")) year = property.replace (/.*=\s*{?(\d{4}).*/, "$1");
				else if (property.includes ("date =")) year = property.replace (/.*=\s*{?(\d{4}).*/, "$1"); // some bibtx formats use date instead of year
				else if (property.includes ("doi =")) doi = extract(property);
				else if (property.includes ("url =")) url = extract(property);
				else if (property.includes ("volume =")) volume = extract(property);
				else if (property.includes ("number =")) issue = extract(property);
				else if (property.includes ("journal =")) journal = extract(property);
				else if (property.includes ("booktitle =")) booktitle = extract(property);
				else if (property.includes ("keywords =")) keywords = extract(property);
			});

			// when no URL, try to use DOI
			let URLsubtitle = "⛔️ There is no URL or DOI.";
			if (url || doi) emojis.push(urlIcon);
			if (url) URLsubtitle = "⌃: Open " + urlIcon + " URL: " + url;
			if (!url && doi) {
				url = "https://doi.org/" + doi;
				URLsubtitle = "⌃: Open " + urlIcon + " DOI: " + doi;
			}

			// Literature Note
			let quicklookPath = "";
			if (literatureNoteArray.includes(citekey.slice(1))) {
				emojis.push(literatureNoteIcon);
				quicklookPath = literatureNoteFolder + "/" + citekey.slice(1) + ".md";
			}

			// Keywords (tags)
			let keywordArr = [];
			if (keywords) {
				keywordArr = keywords.split(",").map(tag => "#" + tag.trim());
				emojis.push(tagIcon + keywordArr.length.toString());
			}

			// Icon selection
			let typeIcon = "icons/";
			switch (type) {
				case "article":
					typeIcon += "article.png";
					break;
				case "incollection":
				case "inbook":
					typeIcon += "book_chapter.png";
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
				case "misc":
				case "unpublished":
				default:
					typeIcon += "manuscript.png";
			}

			// Journal/Book Title
			let collectionSubtitle = "";
			if (type === "article") collectionSubtitle += "    In: " + journal + " " + volume + "(" + issue + ")";
			if (type === "incollection") collectionSubtitle += "    In: " + booktitle;

			// display editor when no authors
			let editorAbbrev = "(Ed.)";
			if (numberOfEditors > 1) editorAbbrev = "(Eds.)";
			let authoreditor = author + " ";
			if (!author && editor) authoreditor = editor + " " + editorAbbrev + " ";
			else if (!author && !editor) authoreditor = "";

			// Matching for Smart Query
			const alfredMatcher = [citekey, ...keywordArr, title, author, editor, year, booktitle, journal, type]
				.join(" ")
				.replaceAll ("-", " ");

			return {
				"title": title,
				"autocomplete": authoreditor,
				"subtitle": authoreditor + year + collectionSubtitle + "   " + emojis.join(" "),
				"match": alfredMatcher,
				"arg": citekey,
				"icon": { "path": typeIcon },
				"uid": citekey,
				"text": { "copy": url },
				"quicklookurl": quicklookPath,
				"mods": {
					"ctrl": {
						"valid": (url !== ""),
						"arg": url,
						"subtitle": URLsubtitle,
					},
				}
			};
		});

	console.log("after");
	return JSON.stringify({ "items": entryArray });
}
