ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
const homePath = app.pathTo("home folder");

const urlIcon = "🌐";
const litNoteIcon = "📓";
const tagIcon = "🏷";
const abstractIcon = "📄";
const pdfIcon = "📕";
const litNoteFilterStr = "*";
const pdfFilterStr = "pdf";

const maxTitleFileNameLength = 50;
const alfredBarLength = parseInt ($.getenv("alfred_bar_length"));

const matchAuthorsInEtAl = $.getenv("match_authors_in_etal") === "true";
const matchOnlyShortYears = $.getenv("match_only_short_years") === "true";
const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, homePath);
const litNoteFolder = $.getenv("literature_note_folder").replace(/^~/, homePath);
const pdfFolder = $.getenv("pdf_folder").replace(/^~/, homePath);
let litNoteFolderCorrect = false;
if (litNoteFolder) litNoteFolderCorrect = Application("Finder").exists(Path(litNoteFolder));
let pdfFolderCorrect = false;
if (pdfFolder) pdfFolderCorrect = Application("Finder").exists(Path(pdfFolder));

// Import Hack, https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts
const toImport = "./scripts/bibtex-parser.js";
console.log ("Starting Buffer Writing");
eval (app.doShellScript(`cat "${toImport}"`));
console.log ("Parser Import successfull.");

// -------------------------------

const logStartTime = new Date();
let litNoteArray = [];
let pdfArray = [];

if (litNoteFolderCorrect) {
	litNoteArray = app.doShellScript(`ls "${litNoteFolder}"`)
		.split("\r")
		.filter(filename => filename.endsWith(".md"))
		.map (filename => filename.slice(0, -3)); // remove extension
	console.log ("Literature Note Reading successfull.");
}

if (pdfFolderCorrect) {
	pdfArray = app.doShellScript(`find "${pdfFolder}" -maxdepth 3 -type f -name "*.pdf"`)
		.split("\r")
		.map (filename => {
			return filename
				.slice(0, -4) // remove extension
				.replace (/.*\/(.*)_.*/, "$1") // only citekey part
				.replaceAll ("_", ""); // remove underscores from citekey additional stuff (personal naming convention from older library)
		});
	console.log ("PDF Folder reading successfull.");
}

// -------------------------------


const rawBibtex = app.doShellScript(`cat "${libraryPath}"`);
console.log ("Bibtex Library Reading successfull.");

const entryArray = bibtexParse(rawBibtex) // eslint-disable-line no-undef
	.map(entry => {
		const emojis = [];
		const { title, url, citekey, keywords, type, journal, volume, issue, booktitle, authors, editors, year, abstract, primaryNamesEtAlString, primaryNames } = entry;

		// Shorten Title (for display in Alfred)
		let shorterTitle = title;
		if (title.length > alfredBarLength) shorterTitle = title.slice(0, alfredBarLength).trim() + "…";

		// autofile
		const safeTitle = title
			.slice(0, maxTitleFileNameLength)
			.replace(/[;:/\\]/g, "-")
			.replace(/[„"'´,#]/g, "");
		const autoFileName = `${citekey}_${safeTitle}`;

		// URL
		let urlSubtitle = "⛔️ There is no URL or DOI.";
		if (url) {
			emojis.push(urlIcon);
			urlSubtitle = "⌃: Open URL – " + url;
		}

		// Literature Notes
		let litNotePath = "";
		const litNoteMatcher = [];
		const hasLitNote = litNoteFolderCorrect && litNoteArray.includes(citekey);
		if (hasLitNote) {
			emojis.push(litNoteIcon);
			litNotePath = litNoteFolder + "/" + citekey + ".md";
			litNoteMatcher.push(litNoteFilterStr);
		}
		// PDFs
		const hasPdf = pdfFolderCorrect && pdfArray.includes(citekey);
		const pdfMatcher = [];
		if (hasPdf) {
			emojis.push(pdfIcon);
			pdfMatcher.push(pdfFilterStr);
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
			collectionSubtitle += "    In: " + journal;
			if (volume) collectionSubtitle += " " + volume;
			if (issue) collectionSubtitle += "(" + issue + ")";
		}
		if (type === "incollection" && booktitle) collectionSubtitle += "    In: " + booktitle;

		// display editor and add "Ed." when no authors
		let namesToDisplay = primaryNamesEtAlString + " ";
		if (!authors.length && editors.length) {
			if (editors.length > 1) namesToDisplay += "(Eds.) ";
			else namesToDisplay += "(Ed.) ";
		}

		// Matching for Smart Query
		let keywordMatches = [];
		if (keywords.length) keywordMatches = keywords.map(tag => "#" + tag);
		let authorMatches = [...authors, ...editors];
		if (!matchAuthorsInEtAl) authorMatches = [...authors.slice(0, 1), ...editors.slice(0, 1)]; // only match first two names
		const yearMatches = [year.slice(-2)]; // last two digits
		if (!matchOnlyShortYears) yearMatches.push(year);
		const alfredMatcher = ["@" + citekey,
			...keywordMatches,
			title,
			...authorMatches,
			...yearMatches,
			booktitle,
			journal,
			type,
			...litNoteMatcher,
			...pdfMatcher
		].join(" ").replaceAll ("-", " ");

		// Large Type
		let largeTypeInfo = `${title} \n(citekey: ${citekey})`;
		if (abstract) largeTypeInfo += "\n\n" + abstract;
		if (keywords.length) largeTypeInfo += "\n\nkeywords: " + keywords.join(", ");

		return {
			"title": shorterTitle,
			"autocomplete": primaryNames[0],
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
				"fn": { "arg": autoFileName },
				"ctrl": {
					"valid": url !== "",
					"arg": url,
					"subtitle": urlSubtitle,
				},
			}
		};
	});

// -------------------------------
console.log ("Buffer Creation successfull.");

const logEndTime = new Date();
console.log("Buffer Writing Duration: " + (logEndTime - logStartTime).toString() + "ms");

JSON.stringify({ "items": entryArray }); // JXA direct return
