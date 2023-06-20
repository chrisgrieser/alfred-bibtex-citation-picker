#!/bin/zsh

bibtex_library_path="${bibtex_library_path/#\~/$HOME}"
citekey=$(echo "$*" | tr -d "\n")

#───────────────────────────────────────────────────────────────────────────────

# shellcheck disable=2154
if [[ "$mode" == "if+autofile" ]]; then
	SELECTED_FILE="$pdf_filepath" # set via Alfred
else
	# guard clauses conditions
	PDF_FOLDER="${pdf_folder/#\~/$HOME}"
	NO_OF_SELECTIONS=$(osascript -l JavaScript -e 'Application("Finder").selection().length')
	SELECTED_FILE=$(osascript -l JavaScript -e 'decodeURI(Application("Finder").selection()[0]?.url()).slice(7)')
	EXT="${SELECTED_FILE##*.}"

	if [[ ! -e "$PDF_FOLDER" ]]; then echo "PDF folder does not exist." && exit 1; fi
	if [[ -z "$PDF_FOLDER" ]]; then echo "PDF folder not set." && exit 1; fi
	if [[ $NO_OF_SELECTIONS -eq 0 ]]; then echo "⛔️ No file selected." && exit 1; fi
	if [[ $NO_OF_SELECTIONS -gt 1 ]]; then echo "⛔️ More than one file selected." && exit 1; fi
	if [[ "$EXT" != "pdf" ]]; then echo "⛔️ Selected file is not a PDF." && exit 1; fi
fi

#───────────────────────────────────────────────────────────────────────────────

# auto-filing
AUTHOR=$(echo -n "$citekey" | sed -E 's/[[:digit:]]+.*//') # assumes citekey is author+year
FIRST_CHARACTER=${citekey:0:1}

# shellcheck disable=2154
if [[ "$mode" == "id+autofile" ]]; then
	title=$(cat "$alfred_workflow_cache/title.txt")
else
	title=$(grep --ignore-case --after-context=20 --max-count=1 "{${citekey}," "${bibtex_library_path}" | grep -E "\btitle ?=")
fi
safe_truncated_title=$(
	echo -n "$title" |
		cut -d= -f2 |
		tr ";:/?!" "-" |
		sed -E 's/^ *//;s/[-_ ]$//g' |
		tr -d "{}„\"'´,#" |
		cut -c -50 |
		sed -E 's/ $//'
)

AUTOFILE_FOLDER="$PDF_FOLDER/$FIRST_CHARACTER/$AUTHOR"
AUTOFILE_PATH="$AUTOFILE_FOLDER/${citekey}_${safe_truncated_title}.pdf"

if [[ -e "$AUTOFILE_PATH" ]]; then
	echo "⛔️ There already is a pdf file."
	echo "Delete it and run auto-file again."
	open -R "$AUTOFILE_PATH"
	exit 1
fi

mkdir -p "$AUTOFILE_FOLDER"
mv "$SELECTED_FILE" "$AUTOFILE_PATH"
open -R "$AUTOFILE_PATH"
