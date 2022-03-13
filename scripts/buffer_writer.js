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

	class BibtexEntry {
		constructor() {
			this.author = "";
			this.title = "";
			this.year = "";
			this.editor = "";
			this.url = "";
			this.booktitle = "";
			this.journal = "";
			this.doi = "";
			this.volume = "";
			this.issue = "";
			this.keywords = [];
			this.numberOfEditors = 0;
			this.type = "misc";
			this.citekey = "";
		}
	}

	// -------------------------------
	// MAIN
	// -------------------------------

	const literatureNoteArray = app.doShellScript('ls "' + literatureNoteFolder + '"')
		.split("\r")
		.map (filename => filename.slice(0, -3)); // remove file extension (assuming .md)

	const startTime = new Date();
	const entryArray = app.doShellScript('cat "' + libraryPath + '"')
		.BibtexDecode()
		.split("@")
		.slice(1) // first element is only BibTeX metadata
		.map(entry => {

			const bEntry = new BibtexEntry();
			const emojis = [];

			const properties = entry.split("\r");
			bEntry.type = properties[0].split("{")[0];
			bEntry.citekey = "@" + properties[0].split("{")[1]?.slice(0, -1);
			properties.shift();

			properties.forEach (property => {
				const field = property.split("=")[0].trim();
				const value = property.split("=")[1]?.trim().replace(/{|}|,$/g, ""); // remove TeX formatting

				switch (field) {
					case "author":
						bEntry.author = value
							.replace (/(, [A-Z]).+?(?= and|$)/gm, "") // remove first names
							.replaceAll (" and ", " & ")
							.replace (/&.*&.*/, "et al."); // insert et al
						break;
					case "editor":
						bEntry.editor = value
							.replace (/(, [A-Z]).+?(?= and|$)/gm, "") // remove first names
							.replaceAll (" and ", " & ");
						bEntry.numberOfEditors = bEntry.editor.split("&").length;
						bEntry.editor = bEntry.editor.replace (/&.*&.*/, "et al."); // insert et al
						break;
					case "title":
						bEntry.title = value;
						if (bEntry.title.length > alfredBarLength) bEntry.title = bEntry.title.slice(0, alfredBarLength).trim() + "…";
						break;
					case "date": // some bibtx formats use date instead of year
					case "year":
						bEntry.year = value.match(/\d{4}/)[0];
						break;
					case "doi":
						bEntry.doi = value;
						break;
					case "url":
						bEntry.url = value;
						break;
					case "number":
						bEntry.issue = value;
						break;
					case "volume":
						bEntry.volume = value;
						break;
					case "journal":
						bEntry.journal = value;
						break;
					case "booktitle":
						bEntry.booktitle = value;
						break;
					case "keywords":
						bEntry.keywords = value.split(",").map (t => t.trim());
						break;
				}
			});

			// when no URL, try to use DOI
			let URLsubtitle = "⛔️ There is no URL or DOI.";
			if (bEntry.url || bEntry.doi) emojis.push(urlIcon);
			if (bEntry.url) URLsubtitle = "⌃: Open " + urlIcon + " URL: " + bEntry.url;
			if (!bEntry.url && bEntry.doi) {
				bEntry.url = "https://doi.org/" + bEntry.doi;
				URLsubtitle = "⌃: Open " + urlIcon + " DOI: " + bEntry.doi;
			}

			// Literature Note
			let quicklookPath = "";
			if (literatureNoteArray.includes(bEntry.citekey.slice(1))) {
				emojis.push(literatureNoteIcon);
				quicklookPath = literatureNoteFolder + "/" + bEntry.citekey.slice(1) + ".md";
			}

			// Keywords (tags)
			if (bEntry.keywords.length) emojis.push(tagIcon + " " + bEntry.keywords.length.toString());

			// Icon selection
			let typeIcon = "icons/";
			switch (bEntry.type) {
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
			if (bEntry.type === "article") {
				collectionSubtitle += "    In: " + bEntry.journal + " " + bEntry.volume;
				if (bEntry.issue) collectionSubtitle += "(" + bEntry.issue + ")";
			}
			if (bEntry.type === "incollection") collectionSubtitle += "    In: " + bEntry.booktitle;

			// display editor when no authors
			let editorAbbrev = "(Ed.)";
			if (bEntry.numberOfEditors > 1) editorAbbrev = "(Eds.)";
			let authoreditor = bEntry.author + " ";
			if (!bEntry.author && bEntry.editor) authoreditor = bEntry.editor + " " + editorAbbrev + " ";
			else if (!bEntry.author && !bEntry.editor) authoreditor = "";

			// Matching for Smart Query
			const keywordMatches = bEntry.keywords.map(tag => "#" + tag);
			const alfredMatcher = [bEntry.citekey, ...keywordMatches, bEntry.title, bEntry.author, bEntry.editor, bEntry.year, bEntry.booktitle, bEntry.journal, bEntry.type]
				.join(" ")
				.replaceAll ("-", " ");

			return {
				"title": bEntry.title,
				"autocomplete": authoreditor,
				"subtitle": authoreditor + bEntry.year + collectionSubtitle + "   " + emojis.join(" "),
				"match": alfredMatcher,
				"arg": bEntry.citekey,
				"icon": { "path": typeIcon },
				"uid": bEntry.citekey,
				"text": { "copy": bEntry.url },
				"quicklookurl": quicklookPath,
				"mods": {
					"ctrl": {
						"valid": (bEntry.url !== ""),
						"arg": bEntry.url,
						"subtitle": URLsubtitle,
					},
				}
			};
		});

	const endTime = new Date();
	console.log("Buffer Writing Duration: " + (endTime - startTime).toString() + "ms");
	return JSON.stringify({ "items": entryArray });
}
