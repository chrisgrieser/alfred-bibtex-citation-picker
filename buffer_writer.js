#!/usr/bin/env osascript -l JavaScript
function run(){

   ObjC.import('stdlib');
   const alfred_bar_length = parseInt ($.getenv('alfred_bar_length'));
   const urlIcon = $.getenv('IconURL');
   const doiIcon = $.getenv('IconDOI');

   // resolve ~
   app = Application.currentApplication();
   app.includeStandardAdditions = true;
   const homepath = app.pathTo('home folder');
   const library = $.getenv('bibtex_library_path').replace(/^~/, homepath);
   const library_2 = $.getenv('second_library').replace(/^~/, homepath);

   //read bib file &  remove unecessary info to increase speed
   var input = app.doShellScript('cat "' + library + '" | grep -vwE "(abstract|annotate|Bdsk-Url-1|Bdsk-Url-2|date-modified|date-added|keywords|issn|langid|urlyear|isbn|location|pagetotal|series|eprint) =" | grep -vw "%%"');
   if (library_2 != ""){
      input = input + "\r" + app.doShellScript('cat "' + library_2 + '" | grep -vwE "(abstract|annotate|Bdsk-Url-1|Bdsk-Url-2|date-modified|date-added|keywords|issn|langid|urlyear|isbn|location|pagetotal|series|eprint) =" | grep -vw "%%"');
   }


   // BibTeX-Decoding
   const german_chars = ['{\\"u};ü','{\\"a};ä','{\\"o};ö','{\\"U};Ü','{\\"A};Ä','{\\"O};Ö','\\"u;ü','\\"a;ä','\\"o;ö','\\"U;Ü','\\"A;Ä','\\"O;Ö','\\ss;ß','{\\ss};ß'];
   const other_chars = ["{\\~n};ñ","{\\'a};á","{\\'e};é","{\\v c};č","\\c{c};ç","\\o{};ø","\\^{\i};î",'\\"{\i};î','\\"{\i};ï',"{\\'c};ć",'\\"e;ë',];
   const special_chars = ["\\&;&",'``;"',"`;'","\\textendash{};—","---;—","--;—"];
   const decode_pair = [...german_chars, ...other_chars, ...special_chars];
   decode_pair.forEach(pair => {
      let half = pair.split(";");
      input = input.replaceAll (half[0],half[1]);
   });

   const input_array = input.split("@");
   var entry_array = [];

   //extracts content of a BibTeX-field
   function extract (str){
      str = str.split(" = ")[1];
      return str.replace (/,$/,"");
   }

   input_array.forEach(entry => {
      let properties = entry.split ("\r");
      let citekey = "";
      let author = "";
      let title = "";
      let year = "";
      let authormatches = "";
      let titlematch = "";
      let type = "";
      let editor = "";
      let url = "";
      let collection = "";
      let doi = "";
      let volume = "";
      let issue = "";
      let numberOfEditors = 0;

      citekey = properties[0].replace (/.*{(.*),/,"$1");
      type = properties[0].replace (/(.*){.*/,"$1");

      properties.forEach (property => {

         property = property.replace (/[\{|\}]/g,""); //remove Tex

         if (property.includes ("author =")){
            author = extract (property);
            author = author.replace (/(, [A-Z]).+?(?= and|$)/gm,""); //remove first names
            author = author.replaceAll (" and "," & ");
            author = author.replace (/\&.*\&.*/,"et al."); // insert et al

         } else if (property.includes ("editor =")){
            editor = extract (property);
            editor = editor.replace (/(, [A-Z]).+?(?= and|$)/gm,""); //remove first names
            editor = editor.replaceAll (" and "," & ");
            numberOfEditors = editor.split("&").length;
            editor = editor.replace (/\&.*\&.*/,"et al."); // insert et al

      	} else if (property.match(/\stitle \=/i) != null){
         	title = extract (property);
       		//shorten, if title too long
       		if (title.length > alfred_bar_length){
       			title = title.substring(0, alfred_bar_length);
       			title = title + "...";
       		}

         } else if (property.includes ("year =")){
         		year = property.replace (/.*=\s*{?(\d{4}).*/,"$1");
         } else if (property.includes ("date =")){
               year = property.replace (/.*=\s*{?(\d{4}).*/,"$1");

         } else if  (property.includes ("doi =")){
         		doi = extract (property);

         } else if  (property.includes ("url =")){
         		url = extract (property);

         } else if  (property.includes ("volume =")){
         		volume = extract (property);

         } else if  (property.includes ("number =")){
         		issue = "(" + extract (property) + ")";

         } else if  (property.match(/\s(journal|booktitle)\s*\=/i) != null){
       		collection = "    In: " + extract (property);
         }
      });

      //if the initial reading of the filecut away the closing bracket, add it
      let bibtex_entry = "@" + entry;
      let opening_brackets = (bibtex_entry.match(/\{/g) || []).length;
      let closing_brackets = (bibtex_entry.match(/\}/g) || []).length;
      if (opening_brackets > closing_brackets) bibtex_entry = bibtex_entry + "}";

      //when no URL, try to use DOI
      let urlAppendix = "";
      let URLsubtitle = "⛔️ There is no URL or DOI.";
      if (url != "") {
      	URLsubtitle = "⌃: Open URL " + urlIcon;
      	urlAppendix = "    " + urlIcon;
      	if (doi != "") urlAppendix = urlAppendix + " " + doiIcon;
      } else if (doi != "") {
        URLsubtitle = "⌃: Open DOI " + doiIcon;
        urlAppendix = "    " + doiIcon;
      }

      //icon selection
      let type_icon = "";
      if (type == "article") {
        type_icon = "article.png";
        collection = collection + " " + volume + issue;
      }
      else if (type == "book") type_icon = "book.png";
      else if (type == "inbook") type_icon = "book_chapter.png";
      else if (type == "incollection") type_icon = "book_chapter.png";
      else if (type == "misc") type_icon = "manuscript.png";
      else if (type == "unpublished") type_icon = "manuscript.png";
      else if (type == "techreport") type_icon = "technical_report.png";
      else if (type == "inproceedings") type_icon = "conference.png";

      // determines correct editor-abbreviation
      var editorAbbrev = "";
      if (numberOfEditors > 1) editorAbbrev = "(Eds.)";
      else editorAbbrev = "(Ed.)";

      // displays editor when there are no authors
      var authoreditor = author + " ";
      if ((author == "") && (editor != "")) {
      	authoreditor = editor + " " + editorAbbrev  + " ";
      } else if ((author == "") && (editor == "")) {
      	authoreditor = "";
      }

      let alfredMatcher = 
      	[title, author, editor, year, collection, citekey]
      	.join(" ")
      	.replaceAll (" ", "");

      entry_array.push ({
         'title': title,
         'autocomplete': authoreditor,
         'subtitle': authoreditor + year + collection + urlAppendix,
         'match': alfredMatcher,
         'arg': "@" + citekey,
         'icon': {'path': type_icon },
         'uid': citekey,
         "text": { "copy": url },
         "mods": {
            "ctrl": {
               "valid": (url != ""),
               "arg": url,
               "subtitle": URLsubtitle,
            },
            "fn": {"arg": bibtex_entry }
         }
      });
   });

   return JSON.stringify({ 'items': entry_array });
}
