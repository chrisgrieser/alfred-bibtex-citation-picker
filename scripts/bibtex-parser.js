// Due to use with the JXA import hack, no "export" keyword is necessary.
// https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts

// for Mac using JXA: \r, otherwise use \n
const lineDelimiter = "\r";

class BibtexEntry {
	constructor() {
		this.author = "";
		this.editor = "";
		this.type = "";
		this.citekey = "";
		this.title = "";
		this.year = "";
		this.url = "";
		this.booktitle = "";
		this.journal = "";
		this.doi = "";
		this.volume = "";
		this.issue = "";
		this.abstract = "";
		this.keywords = [];
	}
	get hasMultipleEditors() {
		return /&| and /.test(this.editor);
	}
	get authorsEtAl() {
		return this.author.replace (/&.*&.*/, "et al.");
	}
	get editorsEtAl() {
		return this.editor.replace (/&.*&.*/, "et al.");
	}
	get hasURL() {
		return this.url !== "";
	}
}

const germanChars = [
	"{\\\"u};ü",
	"{\\\"a};ä",
	"{\\\"o};ö",
	"{\\\"U};Ü",
	"{\\\"A};Ä",
	"{\\\"O};Ö",
	"\\\"u;ü",
	"\\\"a;ä",
	"\\\"o;ö",
	"\\\"U;Ü",
	"\\\"A;Ä",
	"\\\"O;Ö",
	"\\ss;ß",
	"{\\ss};ß",

	// Bookends
	"\\''A;Ä",
	"\\''O;Ö",
	"\\''U;Ü",
	"\\''a;ä",
	"\\''o;ö",
	"\\''u;ü"
];
const otherChars = [
	"{\\~n};ñ",
	"{\\'a};á",
	"{\\'e};é",
	"{\\v c};č",
	"\\c{c};ç",
	"\\o{};ø",
	"\\^{i};î",
	"\\\"{i};î",
	"\\\"{i};ï",
	"{\\'c};ć",
	"\\\"e;ë",
	"\\'E;É"
];
const specialChars = [
	"\\&;&",
	"``;\"",
	"`;'",
	"\\textendash{};—",
	"---;—",
	"--;—"
];
const decodePair = [...germanChars, ...otherChars, ...specialChars];

function bibtexDecode (encodedStr) {
	let decodedStr = encodedStr;
	decodePair.forEach(pair => {
		const half = pair.split(";");
		decodedStr = decodedStr.replaceAll (half[0], half[1]);
	});
	return decodedStr;
}

function bibtexNameParse(nameString) {
	return nameString
		.replace (/(, [A-Z]).+?(?= and|$)/gm, "") // remove first names
		.replaceAll (" and ", " & ");
}

// input: string
// output: BibtexEntry object
function bibtexParse (str) { // eslint-disable-line no-unused-vars
	const bibtexEntryArray = bibtexDecode(str)
		.split("@")
		.slice(1) // first element is only BibTeX metadata
		.map(bibEntry => {
			let lines = bibEntry.split(lineDelimiter);
			const entry = new BibtexEntry();

			// parse first line (separate since different formatting)
			entry.type = lines[0].split("{")[0].toLowerCase();
			entry.citekey = "@" + lines[0].split("{")[1]?.replace(/,$/, "");
			lines.shift();

			// catch erroneous BibTeX formatting
			lines = lines.filter(line => line.includes("="));

			// parse remaining lines
			lines.forEach (line => {
				const field = line.split("=")[0].trim().toLowerCase();
				const value = line.split("=")[1].trim().replace(/{|}|,$/g, ""); // remove TeX escaping

				switch (field) {
					case "author":
						entry.author = bibtexNameParse(value);
						break;
					case "editor":
						entry.editor = bibtexNameParse(value);
						break;
					case "title":
						entry.title = value;
						break;
					case "date": // some BibTeX formats use 'date' instead of 'year'
					case "year": {
						const yearDigits = value.match(/\d{4}/);
						if (yearDigits) entry.year = yearDigits[0]; // edge case of BibTeX files with wrong years
						break;
					}
					case "doi":
						entry.doi = value;
						break;
					case "abstract":
						entry.abstract = value;
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

			if (!entry.url && entry.doi) entry.url = "https://doi.org/" + entry.doi;

			return entry;
		});

	return bibtexEntryArray;
}
