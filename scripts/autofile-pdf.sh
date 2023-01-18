#!/bin/zsh

# get selected file
NO_OF_SELECTIONS=$(osascript -l JavaScript -e 'Application("Finder").selection().length')
SELECTED_FILE=$(osascript -l JavaScript -e 'decodeURI(Application("Finder").selection()[0]?.url()).slice(7)')

# cancellation conditions
if [[ $NO_OF_SELECTIONS -eq 0 ]] ; then
	echo "⛔️ No file selected."
	echo "$NO_OF_SELECTIONS"
	exit 1
fi
if [[ $NO_OF_SELECTIONS -gt 1 ]] || [[ "$SELECTED_FILE" == "multiple files" ]] ; then
	echo "⛔️ More than one file selected."
	exit 1
fi
EXT="${SELECTED_FILE##*.}"
if [[ "$EXT" != "pdf" ]]; then
	echo "⛔️ Selected file not a PDF."
	exit 1
fi

# auto-filing
NEW_NAME="$*.pdf"
AUTHOR=$(echo -n "$*" | cut -d"_" -f1 | sed 's/[[:digit:]]//g') # assumes citekey is author+year
FIRST_CHARACTER=${NEW_NAME:0:1}
# shellcheck disable=SC2154
PDF_FOLDER="${pdf_folder/#\~/$HOME}"

if [[ ! -e "$PDF_FOLDER" ]] || [[ -z "$PDF_FOLDER" ]]; then
	echo "PDF folder not set or folder non-existent."
	exit 1
fi

AUTOFILE_FOLDER="$PDF_FOLDER/$FIRST_CHARACTER/$AUTHOR"
AUTOFILE_PATH="$AUTOFILE_FOLDER/$NEW_NAME"

if [[ -e "$AUTOFILE_FOLDER/$NEW_NAME" ]]; then
	echo "⛔️ There already is a pdf file."
	echo "Delete it and run auto-file again."
	open -R "$AUTOFILE_PATH"
	exit 1
fi

mkdir -p "$AUTOFILE_FOLDER"
mv "$SELECTED_FILE"  "$AUTOFILE_PATH"
open -R "$AUTOFILE_PATH"
