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

const alfredBarLength = parseInt($.getenv("alfred_bar_length"));

const matchAuthorsInEtAl = $.getenv("match_authors_in_etal") === "1";
const matchOnlyShortYears = $.getenv("match_only_short_years") === "1";

const libraryPath = $.getenv("bibtex_library_path").replace(/^~/, homePath);
const litNoteFolder = $.getenv("literature_note_folder").replace(/^~/, homePath);
const pdfFolder = $.getenv("pdf_folder").replace(/^~/, homePath);
let litNoteFolderCorrect = false;
if (litNoteFolder) litNoteFolderCorrect = Application("Finder").exists(Path(litNoteFolder));
let pdfFolderCorrect = false;
if (pdfFolder) pdfFolderCorrect = Application("Finder").exists(Path(pdfFolder));

// Import Hack, https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts
const toImport = "./scripts/bibtex-parser.js";
console.log("Starting Buffer Writing");
eval(app.doShellScript(`cat "${toImport}"`));
console.log("Parser Import successful.");

//──────────────────────────────────────────────────────────────────────────────

const logStartTime = new Date();
let litNoteArray = [];
let pdfArray = [];

if (litNoteFolderCorrect) {
	litNoteArray = app
		.doShellScript(`find "${litNoteFolder}" -type f -name "*.md"`)
		.split("\r")
		.map(filepath => {
			return filepath
				.replace(/.*\/(.*)\.md/, "$1") // only basename w/o ext
				.replace(/(_[^_]*$)/, ""); // INFO part before underscore, this method does not work for citkeys which contain an underscore though...
		});
	console.log("Literature Note Reading successful.");
}

if (pdfFolderCorrect) {
	pdfArray = app
		.doShellScript(`find "${pdfFolder}" -type f -name "*.pdf"`)
		.split("\r")
		.map(filepath => {
			return filepath
				.replace(/.*\/(.*)\.pdf/, "$1") // only basename w/o ext
				.replace(/(_[^_]*$)/, ""); // INFO part before underscore, this method does not work for citkeys which contain an underscore though...
		});
	console.log("PDF Folder reading successful.");
}

//──────────────────────────────────────────────────────────────────────────────

const rawBibtex = app.doShellScript(`cat "${libraryPath}"`);
console.log("Bibtex Library Reading successful.");

const entryArray = bibtexParse(rawBibtex) // eslint-disable-line no-undef
	/* eslint-disable-next-line complexity */
	.map(entry => {
		const emojis = [];
		const {
			title,
			url,
			citekey,
			keywords,
			type,
			journal,
			volume,
			issue,
			booktitle,
			authors,
			editors,
			year,
			abstract,
			primaryNamesEtAlString,
			primaryNames,
		} = entry;

		// Shorten Title (for display in Alfred)
		let shorterTitle = title;
		if (title.length > alfredBarLength) shorterTitle = title.slice(0, alfredBarLength).trim() + "…";

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
		const yearMatches = [];
		if (matchOnlyShortYears) yearMatches.push(year.slice(-2));
		else yearMatches.push(year);

		const alfredMatcher = [
			"@" + citekey,
			...keywordMatches,
			title,
			...authorMatches,
			...yearMatches,
			booktitle,
			journal,
			type,
			...litNoteMatcher,
			...pdfMatcher,
		]
			.map(item => {
				// match item with and without dash
				if (item.includes("-")) item = item.replaceAll("-", " ") + " " + item;
				return item;
			})
			.join(" ");

		// Large Type
		let largeTypeInfo = `${title} \n(citekey: ${citekey})`;
		if (abstract) largeTypeInfo += "\n\n" + abstract;
		if (keywords.length) largeTypeInfo += "\n\nkeywords: " + keywords.join(", ");

		return {
			title: shorterTitle,
			autocomplete: primaryNames[0],
			subtitle: namesToDisplay + year + collectionSubtitle + "   " + emojis.join(" "),
			match: alfredMatcher,
			arg: citekey,
			icon: { path: typeIcon },
			uid: citekey,
			text: {
				copy: url,
				largetype: largeTypeInfo,
			},
			quicklookurl: litNotePath,
			mods: {
				ctrl: {
					valid: url !== "",
					arg: url,
					subtitle: urlSubtitle,
				},
			},
		};
	});

//──────────────────────────────────────────────────────────────────────────────

const logEndTime = new Date();
console.log("Buffer Writing Duration: " + (logEndTime - logStartTime).toString() + "ms");

JSON.stringify({ items: entryArray }); // JXA direct return
