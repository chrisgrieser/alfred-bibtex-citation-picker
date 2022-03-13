ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const urlIcon = "🌐";
const literatureNoteIcon = "📓";
const tagIcon = "🏷";
const matchAuthorsInEtAl = $.getenv("match_authors_in_etal") === "true";
const alfredBarLength = parseInt ($.getenv("alfred_bar_length"));
const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
const literatureNoteFolder = $.getenv("literature_note_folder").replace(/^~/, app.pathTo("home folder"));

// Import Hack, https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts
const toImport = "./scripts/bibtex-parser.js";
eval (app.doShellScript('cat "' + toImport + '"'));

// -------------------------------

const startTime = new Date();
const literatureNoteArray = app.doShellScript('ls "' + literatureNoteFolder + '"')
	.split("\r")
	.map (filename => filename.slice(0, -3)); // remove file extension (assuming .md)

const rawBibTex = app.doShellScript('cat "' + libraryPath + '"');

const entryArray = bibtexParse(rawBibTex) // eslint-disable-line no-undef
	.map(entry => {
		const emojis = [];
		const { title, url, citekey, keywords, type, journal, volume, issue, booktitle, author, editor, year } = entry;

		// Shorten Title
		let shorterTitle = title;
		if (title.length > alfredBarLength) shorterTitle = title.slice(0, alfredBarLength).trim() + "…";

		// URL
		let URLsubtitle = "⛔️ There is no URL or DOI.";
		if (url) {
			emojis.push(urlIcon);
			URLsubtitle = "⌃: Open " + urlIcon + " URL: " + url;
		}

		// Literature Notes
		let quicklookPath = "";
		if (literatureNoteArray.includes(citekey.slice(1))) {
			emojis.push(literatureNoteIcon);
			quicklookPath = literatureNoteFolder + "/" + citekey.slice(1) + ".md";
		}

		// Keywords (tags)
		if (keywords.length) emojis.push(tagIcon + " " + keywords.length.toString());

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
		if (type === "article") {
			collectionSubtitle += "    In: " + journal + " " + volume;
			if (issue) collectionSubtitle += "(" + issue + ")";
		}
		if (type === "incollection") collectionSubtitle += "    In: " + booktitle;

		// display editor when no authors
		let editorAbbrev = "(Ed.)";
		if (entry.hasMultipleEditors) editorAbbrev = "(Eds.)";
		let authoreditor = "";
		if (author) authoreditor = entry.authorsEtAl + " ";
		else if (!author && editor) authoreditor = entry.editorsEtAl + " " + editorAbbrev + " ";

		// Matching for Smart Query
		const keywordMatches = keywords.map(tag => "#" + tag);
		let authorMatches = [author, editor];
		if (!matchAuthorsInEtAl) authorMatches = [entry.authorsEtAl, entry.editorsEtAl];
		const alfredMatcher = [citekey, ...keywordMatches, title, ...authorMatches, year, booktitle, journal, type]
			.join(" ")
			.replaceAll ("-", " ");

		return {
			"title": shorterTitle,
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

const endTime = new Date();
console.log("Buffer Writing Duration: " + (endTime - startTime).toString() + "ms");

// direct return
JSON.stringify({ "items": entryArray });
