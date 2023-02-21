// Due to use with the JXA import hack, no "export" keyword is necessary.
// https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts

class BibtexEntry {
	constructor() {
		this.authors = []; // last names only
		this.editors = [];
		this.type = "";
		this.citekey = ""; // without "@"
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

	primaryNamesArr () {
		if (this.authors.length) return this.authors;
		return this.editors; // if both are empty, will also return empty array
	}
	etAlStringify (nameType) {
		const names = nameType;
		switch (names.length) {
			case 0: return "";
			case 1: return names[0];
			case 2: return names.join(" & ");
			default: return names[0] + " et al.";
		}
	}

	get primaryNames () { return this.primaryNamesArr() }
	get primaryNamesEtAlString () { return this.etAlStringify (this.primaryNamesArr()) }
	get authorsEtAlString() { return this.etAlStringify (this.authors) }
	get editorsEtAlString() { return this.etAlStringify (this.editors) }
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
	"\\''u;ü",

	// bibtex-tidy
	"\\\"{O};Ö",
	"\\\"{o};ö",
	"\\\"{A};Ä",
	"\\\"{a};ä",
	"\\\"{u};ü",
	"\\\"{U};Ü"
];

const frenchChars = [
	"{\\'a};á",
	"{\\'o};ó",
	"{\\'e};é",
	"{\\`{e}};é",
	"{\\`e};é",
	"\\'E;É",
	"\\c{c};ç",
	"\\\"{i};ï"
];
const otherChars = [
	"{\\~n};ñ",
	"\\~a;ã",
	"{\\v c};č",
	"\\o{};ø",
	"{\\o};ø",
	"{\\O};Ø",
	"\\^{i};î",
	"\\'\\i;í",
	"{\\'c};ć",
	"\\\"e;ë"
];
const specialChars = [
	"\\&;&",
	"``;\"",
	",,;\"",
	"`;'",
	"\\textendash{};—",
	"---;—",
	"--;—"
];
const decodePair = [...germanChars, ...frenchChars, ...otherChars, ...specialChars];

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

	const bibtexEntryDelimiter = /^@/m; // regex to avoid an "@" in a property value to break parsing
	const bibtexPropertyDelimiter = /,(?=\s*[\w-]+\s*=)/; // last comma of a field, see: https://regex101.com/r/1dvpfC/1
	const bibtexNameValueDelimiter = " and ";
	const bibtexKeywordValueDelimiter = ",";
	const bibtexCommentRegex = /^%.*$/gm;

	function toLastNameArray(nameString) {
		return nameString
			.split(bibtexNameValueDelimiter) // array-fy
			.map(name => { // only last name
				if (name.includes(",")) return name.split(",")[0]; // when last name — first name
				return name.split(" ").pop(); // when first name — last name
			});
	}

	//───────────────────────────────────────────────────────────────────────────

	const bibtexEntryArray = bibtexDecode(str)
		.replace(bibtexCommentRegex, "") // remove comments
		.split(bibtexEntryDelimiter)
		.slice(1) // first element is BibTeX metadata
		.map(bibEntry => {
			let lines = bibEntry.split(bibtexPropertyDelimiter);
			const entry = new BibtexEntry();

			// parse first line (separate since different formatting)
			entry.type = lines[0].split("{")[0].toLowerCase().trim();
			entry.citekey = lines[0].split("{")[1]?.trim();
			lines.shift();

			// parse remaining lines
			lines = lines.filter(line => line.includes("=")); // catch erroneous BibTeX formatting
			lines.forEach (line => {
				const field = line
					.split("=")[0]
					.trim()
					.toLowerCase();
				const value = line.split("=")[1]
					.trim()
					.replace(/{|}|,$/g, "") // remove TeX escaping
					.trim(); // needs second trim to account for removed TeX

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
							.split(bibtexKeywordValueDelimiter)
							.map (t => t.trim());
						break;
				}
			});

			if (!entry.url && entry.doi) entry.url = "https://doi.org/" + entry.doi;

			return entry;
		});

	return bibtexEntryArray;
}
