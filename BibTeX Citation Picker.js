ObjC.import('stdlib');
const alfred_bar_length_string = $.getenv('alfred_bar_length');
const alfred_bar_length = parseInt(alfred_bar_length_string);
var bibtex_library_path = $.getenv('bibtex_library_path');
const urlIcon = $.getenv('urlIcon');

// resolve ~
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo('home folder');
bibtex_library_path = bibtex_library_path.replace(/^~/, homepath);

//read bib file
//remove unecessary info to increase speed
var input = app.doShellScript('cat "' + bibtex_library_path + '" | grep -vwE "(abstract|annotate|publisher|Bdsk-Url-1|Bdsk-Url-2|date-modified|date-added|volume|keywords|issn|langid|doi|urlyear|isbn|location|pagetotal|series|eprint) ="');

// BibTeX-Decoding
input = input.replace (/{?\\"u}?/g,'ü');
input = input.replace (/{?\\"o}?/g,'ö');
input = input.replace (/{?\\"a}?/g,'ä');
input = input.replace (/{?\\"U}?/g,'Ü');
input = input.replace (/{?\\"O}?/g,'Ö');
input = input.replace (/{?\\"A}?/g,'Ä');
input = input.replace (/(---?|\\textendash{})/g,'—');
input = input.replaceAll ('\\"e','ë');
input = input.replaceAll ('\\ss','ß');
input = input.replaceAll ('\\&','&');
input = input.replaceAll ('``','"');
input = input.replaceAll ('`',"'");
input = input.replaceAll ('{\\~n}','ñ');
input = input.replaceAll ("{\\'a}",'á');
input = input.replaceAll ("{\\'e}",'é');
input = input.replaceAll ("{\\v c}",'č');
input = input.replaceAll ("\\c{c}",'ç');
input = input.replaceAll ("\\o{}",'ø');
input = input.replaceAll ("\\^{\i}",'î');
input = input.replaceAll ('\\"{\i}','ï');
input = input.replaceAll ("{\\'c}",'ć');


var entry = input.split("@");
let entry_array = [];

entry.forEach(element => {
  let temp = "@" + element;
  let properties = temp.split ("\r");
  let citekey = "";
  let author = "";
  let title = "";
  let year = "";
  let authormatches = "";
  let type = "";
  let editor = "";
  let url = "";
  let collection = "";
  let urlAppendix = "";
  let numberOfEditors = 0;
  let urlExists = false;

  properties.forEach (elem => {
    if (elem.includes ("@")){
  		citekey = elem.replace (/@.*{(.*),/,"$1");
		type = elem.replace (/@(.*)\{.*/,"$1");
  	};
	if (elem.includes ("author =")){
  		author = elem.replace (/.*{(.*)},?/,"$1");
		author = author.replace (/(, [A-Z]).+?(?= and|$)/gm,""); //remove first names
		author = author.replaceAll (" and "," & ");
		author = author.replace (/[{|}]/g,"");
		authormatches = author;
		author = author.replace (/\&.*\&.*/,"et al."); // insert et al
  	};

	if (elem.includes ("editor =")){
  		editor = elem.replace (/.*{(.*)},?/,"$1");
		editor = editor.replace (/(, [A-Z]).+?(?= and|$)/gm,""); //remove first names
		editor = editor.replaceAll (" and "," & ");
		editor = editor.replace (/[{|}]/g,"");
		authormatches = editor + " " + authormatches;
		numberOfEditors = editor.split("&").length;
		editor = editor.replace (/\&.*\&.*/,"et al."); // insert et al
  	};

	let titlematch = elem.match(/\stitle \=/i);
	if (titlematch != null){
  		title = elem.replace (/.*?{(.*)},?/,"$1");
		title = title.replace (/[{|}]/g,"");
		//shorten, if title too long
		if (title.length > alfred_bar_length){
			title = title.substring(0, alfred_bar_length);
			title = title + "...";
		}

  	};
	if (elem.includes ("year =")){
  		year = elem.replace (/.*= {?(\d{4}).*/,"$1");
  	};

	if (elem.includes ("url =")){
  		url = elem.replace (/.*{(.*)},?/,"$1");
		urlAppendix = "    " + urlIcon;
		urlExists = true;
  	};

  	let collectionmatch = elem.match(/\s(journal|booktitle) \=/i);
	if (collectionmatch != null){
  		collection = elem.replace (/.*{{?(.*?)}.*/,"$1");
		collection = "    In: " + collection;
  	};
  });

  //icon selection
  let type_icon = "";
  if (type == "article") {
	type_icon = "article.png";
  } else if (type == "book") {
    type_icon = "book.png";
  } else if (type == "book_chapter.png") {
    type_icon = "book_chapter.png";
  } else if (type == "inbook") {
    type_icon = "book_chapter.png";
  } else if (type == "incollection") {
    type_icon = "book_chapter.png";
  } else if (type == "misc") {
    type_icon = "manuscript.png";
  } else if (type == "unpublished") {
    type_icon = "manuscript.png";
  } else if (type == "techreport") {
    type_icon = "technical_report.png";
  } else if (type == "inproceedings") {
    type_icon = "conference.png";
  }

  // determines correct editor-abbreviation
  if (numberOfEditors > 1){
    var editorAbbrev = "(Eds.)";
  } else {
    var editorAbbrev = "(Ed.)";
  }

  // displays editor when there are no authors
  var authoreditor = author + " ";
  if ((author == "") && (editor != "")) {
	authoreditor = editor + " " + editorAbbrev  + " ";
  } else if ((author == "") && (editor == "")) {
	authoreditor = "";
  }

  entry_array.push ({
    'title': title,
    'autocomplete': authoreditor,
    'subtitle': authoreditor + year + collection + urlAppendix,
	'match': title + " " + authormatches + " " + year + " " + collection,
    'arg': "@" + citekey,
	'icon': {'path': type_icon },
	'uid': citekey,
	"mods": { "ctrl": { "valid": urlExists, "arg": url }},
  })
});

JSON.stringify({ 'items': entry_array });
