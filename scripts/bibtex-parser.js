// Due to use with the JXA import hack, no "export" keyword is necessary.
// https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts

class BibtexEntry {
	constructor() {
		this.authors = []; // last names only
		this.editors = [];
		this.type = "";
		this.citekey = "";
		this.title = "";
		this.year = ""; // no need for integer, since no calculations made
		this.url = "";
		this.booktitle = "";
		this.journal = "";
		this.doi = "";
		this.volume = "";
		this.issue = "";
		this.abstract = "";
		this.keywords = [];
	}
	get authorsEtAlString() {
		switch (this.authors.length) {
			case 0: return "";
			case 1: return this.authors[0];
			case 2: return this.authors.join(" & ");
			default: return this.authors[0] + " et al. ";
		}
	}
	get editorsEtAlString() {
		switch (this.editors.length) {
			case 0: return "";
			case 1: return this.editors[0];
			case 2: return this.editors.join(" & ");
			default: return this.editors[0] + " et al. ";
		}
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


// input: string
// output: BibtexEntry object
function bibtexParse (str) { // eslint-disable-line no-unused-vars

	const bibtexEntryDelimiter = "@";
	const bibtexPropertyDelimiter = /,(?=\s*[\w-]+\s*=)/g; // last comma of a field, see: https://regex101.com/r/1dvpfC/1

	function toLastNameArray(nameString) {
		return nameString
			.split(" and ") // array-fy
			.map(name => name.split(",")[0]); // only last name
	}

	// -----------------------------

	const bibtexEntryArray = bibtexDecode(str)
		.split(bibtexEntryDelimiter)
		.slice(1) // first element is BibTeX metadata
		.map(bibEntry => {
			let lines = bibEntry.split(bibtexPropertyDelimiter);
			const entry = new BibtexEntry();

			// parse first line (separate since different formatting)
			entry.type = lines[0].split("{")[0].toLowerCase().trim();
			entry.citekey = "@" + lines[0].split("{")[1]?.trim();
			lines.shift();

			// parse remaining lines
			lines = lines.filter(line => line.includes("=")); // catch erroneous BibTeX formatting
			lines.forEach (line => {
				const field = line.split("=")[0].trim().toLowerCase();
				const value = line.split("=")[1].trim().replace(/{|}|,$/g, ""); // remove TeX escaping

				switch (field) {
					case "author":
						entry.authors = toLastNameArray(value);
						break;
					case "editor":
						entry.editors = toLastNameArray(value);
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
						entry.keywords = value
							.split(",")
							.map (t => t.trim());
						break;
				}
			});

			if (!entry.url && entry.doi) entry.url = "https://doi.org/" + entry.doi;

			return entry;
		});

	return bibtexEntryArray;
}
