ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const urlIcon = "🌐";
const litNoteIcon = "📓";
const tagIcon = "🏷";
const abstractIcon = "📄";

const matchAuthorsInEtAl = $.getenv("match_authors_in_etal") === "true";
const alfredBarLength = parseInt ($.getenv("alfred_bar_length"));
const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, app.pathTo("home folder"));
const litNoteFolder = $.getenv("literature_note_folder").replace(/^~/, app.pathTo("home folder"));
let litNoteFolderCorrect = false;
if (litNoteFolder) litNoteFolderCorrect = Application("Finder").exists(Path(litNoteFolder));

// Import Hack, https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts
const toImport = "./scripts/bibtex-parser.js";
eval (app.doShellScript('cat "' + toImport + '"'));

// -------------------------------

const logStartTime = new Date();
let litNoteArray = [];

if (litNoteFolderCorrect) {
	litNoteArray = app.doShellScript('ls "' + litNoteFolder + '"')
		.split("\r")
		.filter(filename => filename.endsWith(".md"))
		.map (filename => filename.slice(0, -3)); // remove extension
}

const rawBibtex = app.doShellScript('cat "' + libraryPath + '"');

const entryArray = bibtexParse(rawBibtex) // eslint-disable-line no-undef
	.map(entry => {
		const emojis = [];
		const { title, url, citekey, keywords, type, journal, volume, issue, booktitle, authors, editors, year, abstract } = entry;

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
		let litNotePath = "";
		if (litNoteFolderCorrect && litNoteArray.includes(citekey.slice(1))) {
			emojis.push(litNoteIcon);
			litNotePath = litNoteFolder + "/" + citekey.slice(1) + ".md";
		}

		// Emojis for Abstracts and Keywords (tags)
		if (abstract) emojis.push(abstractIcon);
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
		if (type === "article" && journal) {
			collectionSubtitle += "    In: " + journal + " " + volume;
			if (issue) collectionSubtitle += "(" + issue + ")";
		}
		if (type === "incollection" && booktitle) collectionSubtitle += "    In: " + booktitle;

		// display editor when no authors
		let namesToDisplay = "";
		let nameToTabComplete = "";
		if (authors.length) {
			// slight performance increase to assign them in the conditional,
			// instead of always (and then editors on top)
			namesToDisplay = entry.authorsEtAlString + " ";
			nameToTabComplete = authors[0];
		}
		if (!authors.length && editors.length) {
			namesToDisplay = entry.editorsEtAlString + " ";
			if (editors.length > 1) namesToDisplay += "(Eds.)";
			else namesToDisplay += "(Ed.)";
			nameToTabComplete = editors[0];
		}

		// Matching for Smart Query
		let keywordMatches = [];
		if (keywords.length) keywordMatches = keywords.map(tag => "#" + tag);
		let authorMatches = [...authors, ...editors];
		if (!matchAuthorsInEtAl) authorMatches = [...authors.slice(0, 1), ...editors.slice(0, 1)];
		const alfredMatcher = [citekey, ...keywordMatches, title, ...authorMatches, year, booktitle, journal, type]
			.join(" ")
			.replaceAll ("-", " ");

		// Large Type
		let largeTypeInfo = title;
		if (abstract) largeTypeInfo += "\n\n" + abstract;
		if (keywords.length) largeTypeInfo += "\n\nkeywords: " + keywords.join(", ");

		return {
			"title": shorterTitle,
			"autocomplete": nameToTabComplete,
			"subtitle": namesToDisplay + year + collectionSubtitle + "   " + emojis.join(" "),
			"match": alfredMatcher,
			"arg": citekey,
			"icon": { "path": typeIcon },
			"uid": citekey,
			"text": {
				"copy": url,
				"largetype": largeTypeInfo
			},
			"quicklookurl": litNotePath,
			"mods": {
				"ctrl": {
					"valid": url !== "",
					"arg": url,
					"subtitle": URLsubtitle,
				},
			}
		};
	});

const logEndTime = new Date();
console.log("Buffer Writing Duration: " + (logEndTime - logStartTime).toString() + "ms");

// direct return
JSON.stringify({ "items": entryArray });
