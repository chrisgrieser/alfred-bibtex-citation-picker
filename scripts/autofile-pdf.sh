#!/bin/zsh

citekey=$(echo "$*" | tr -d "\n")

#───────────────────────────────────────────────────────────────────────────────
# GET FILEPATH & CHECK VALIDITY OF VARIABLES

# shellcheck disable=2154
PDF_FOLDER="${pdf_folder/#\~/$HOME}"
if [[ ! -e "$PDF_FOLDER" ]]; then
	echo "PDF folder does not exist." && return 1
elif [[ -z "$PDF_FOLDER" ]]; then
	echo "PDF folder not set." && return 1
fi

# shellcheck disable=2154
if [[ "$mode" == "id+autofile" ]]; then
	SELECTED_FILE="$pdf_filepath" # set via Alfred
else
	NO_OF_SELECTIONS=$(osascript -l JavaScript -e 'Application("Finder").selection().length')
	SELECTED_FILE=$(osascript -l JavaScript -e 'decodeURI(Application("Finder").selection()[0]?.url()).slice(7)')
	EXT="${SELECTED_FILE##*.}"

	if [[ $NO_OF_SELECTIONS -eq 0 ]]; then
		echo "⛔️ No file selected." && return 1
	elif [[ $NO_OF_SELECTIONS -gt 1 ]]; then
		echo "⛔️ More than one file selected." && return 1
	elif [[ "$EXT" != "pdf" ]]; then
		echo "⛔️ Selected file is not a PDF." && return 1
	fi
fi

#───────────────────────────────────────────────────────────────────────────────

# auto-filing
AUTHOR=$(echo -n "$citekey" | sed -E 's/[[:digit:]]+.*//') # assumes citekey is author+year
FIRST_CHARACTER=${citekey:0:1}

# shellcheck disable=2154
title=$(grep --ignore-case --after-context=20 --max-count=1 "{${citekey}," "${bibtex_library_path}" | grep -E "\btitle ?=")
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
	return 1
fi

mkdir -p "$AUTOFILE_FOLDER"
mv "$SELECTED_FILE" "$AUTOFILE_PATH"
open -R "$AUTOFILE_PATH"
