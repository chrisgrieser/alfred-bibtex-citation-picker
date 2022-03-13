ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const urlIcon = "🌐";
const literatureNoteIcon = "📓";
const tagIcon = "🏷";
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

		// Shorten Title
		if (entry.title.length > alfredBarLength) entry.title = entry.title.slice(0, alfredBarLength).trim() + "…";

		// URL
		let URLsubtitle = "⛔️ There is no URL or DOI.";
		if (entry.url) {
			emojis.push(urlIcon);
			URLsubtitle = "⌃: Open " + urlIcon + " URL: " + entry.url;
		}

		// Literature Notes
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
		if (entry.hasMultipleEditors) editorAbbrev = "(Eds.)";
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

// direct return
JSON.stringify({ "items": entryArray });
