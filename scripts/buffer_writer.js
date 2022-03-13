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
	const startTime = new Date();

	const literatureNoteArray = app.doShellScript('ls "' + literatureNoteFolder + '"')
		.split("\r")
		.map (filename => filename.slice(0, -3)); // remove file extension (assuming .md)

	const entryArray = app.doShellScript('cat "' + libraryPath + '"')
		.BibtexDecode()
		.split("@").slice(1) // first element is only BibTeX metadata
		.map(bibEntry => {

			const properties = bibEntry.split("\r");
			const entry = new BibtexEntry();

			// parse first line (separate since different formatting)
			entry.type = properties[0].split("{")[0];
			entry.citekey = "@" + properties[0].split("{")[1]?.slice(0, -1);
			properties.shift();

			properties.forEach (property => {
				const field = property.split("=")[0].trim();
				const value = property.split("=")[1]?.trim().replace(/{|}|,$/g, ""); // remove TeX formatting

				switch (field) {
					case "author":
						entry.author = value
							.replace (/(, [A-Z]).+?(?= and|$)/gm, "") // remove first names
							.replaceAll (" and ", " & ")
							.replace (/&.*&.*/, "et al."); // insert et al
						break;
					case "editor":
						entry.editor = value
							.replace (/(, [A-Z]).+?(?= and|$)/gm, "") // remove first names
							.replaceAll (" and ", " & ");
						entry.numberOfEditors = entry.editor.split("&").length;
						entry.editor = entry.editor.replace (/&.*&.*/, "et al."); // insert et al
						break;
					case "title":
						entry.title = value;
						if (entry.title.length > alfredBarLength) entry.title = entry.title.slice(0, alfredBarLength).trim() + "…";
						break;
					case "date": // some bibtx formats use date instead of year
					case "year":
						entry.year = value.match(/\d{4}/)[0];
						break;
					case "doi":
						entry.doi = value;
						break;
					case "url":
						entry.url = value;
						break;
					case "number":
						entry.issue = value;
						break;
					case "volume":
						entry.volume = value;
						break;
					case "journal":
						entry.journal = value;
						break;
					case "booktitle":
						entry.booktitle = value;
						break;
					case "keywords":
						entry.keywords = value.split(",").map (t => t.trim());
						break;
				}
			});

			return entry;
		})
		.map(entry => {
			const emojis = [];

			// when no URL, try to use DOI
			let URLsubtitle = "⛔️ There is no URL or DOI.";
			if (entry.url || entry.doi) emojis.push(urlIcon);
			if (entry.url) URLsubtitle = "⌃: Open " + urlIcon + " URL: " + entry.url;
			if (!entry.url && entry.doi) {
				entry.url = "https://doi.org/" + entry.doi;
				URLsubtitle = "⌃: Open " + urlIcon + " DOI: " + entry.doi;
			}

			// Literature Note
			let quicklookPath = "";
			if (literatureNoteArray.includes(entry.citekey.slice(1))) {
				emojis.push(literatureNoteIcon);
				quicklookPath = literatureNoteFolder + "/" + entry.citekey.slice(1) + ".md";
			}

			// Keywords (tags)
			if (entry.keywords.length) emojis.push(tagIcon + " " + entry.keywords.length.toString());

			// Icon selection
			let typeIcon = "icons/";
			switch (entry.type) {
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
			if (entry.type === "article") {
				collectionSubtitle += "    In: " + entry.journal + " " + entry.volume;
				if (entry.issue) collectionSubtitle += "(" + entry.issue + ")";
			}
			if (entry.type === "incollection") collectionSubtitle += "    In: " + entry.booktitle;

			// display editor when no authors
			let editorAbbrev = "(Ed.)";
			if (entry.numberOfEditors > 1) editorAbbrev = "(Eds.)";
			let authoreditor = entry.author + " ";
			if (!entry.author && entry.editor) authoreditor = entry.editor + " " + editorAbbrev + " ";
			else if (!entry.author && !entry.editor) authoreditor = "";

			// Matching for Smart Query
			const keywordMatches = entry.keywords.map(tag => "#" + tag);
			const alfredMatcher = [entry.citekey, ...keywordMatches, entry.title, entry.author, entry.editor, entry.year, entry.booktitle, entry.journal, entry.type]
				.join(" ")
				.replaceAll ("-", " ");

			return {
				"title": entry.title,
				"autocomplete": authoreditor,
				"subtitle": authoreditor + entry.year + collectionSubtitle + "   " + emojis.join(" "),
				"match": alfredMatcher,
				"arg": entry.citekey,
				"icon": { "path": typeIcon },
				"uid": entry.citekey,
				"text": { "copy": entry.url },
				"quicklookurl": quicklookPath,
				"mods": {
					"ctrl": {
						"valid": (entry.url !== ""),
						"arg": entry.url,
						"subtitle": URLsubtitle,
					},
				}
			};
		});

	const endTime = new Date();
	console.log("Buffer Writing Duration: " + (endTime - startTime).toString() + "ms");
	return JSON.stringify({ "items": entryArray });
}
