#!/bin/zsh

# get selected file
if [[ "$file_manager" == "Finder" ]] || [[ -z "$file_manager" ]] ; then
	NO_OF_SELECTIONS=$(osascript -l JavaScript -e 'Application("Finder").selection().length')
	SELECTED_FILE=$(osascript -l JavaScript -e 'decodeURI(Application("Finder").selection()[0]?.url()).slice(7)')
elif [[ "$file_manager" == "Marta" ]] ; then
	NO_OF_SELECTIONS=1 # number of selection checked via "SELECTED FILES"
	SELECTED_FILE=$(osascript -e '
		tell application "Marta" to activate
		delay 0.1
		tell application "System Events"
			keystroke "c" using {command down}
			delay 0.1
			set file_name to (the clipboard)
			if (file_name contains "\r") then return "multiple files"
			tell process "Marta" to set window_name to name of front window
		end tell
		set window_name to (characters 12 thru -2 of window_name as string)
		return window_name & "/" & file_name
	')
	if [[ ! -e "$SELECTED_FILE" ]]; then
		echo "⛔️ Wrong folder is in the the window title. Reload Marta Window and try again."
		exit 1
	fi
else
	echo "⛔️ Invalid File Manager set."
	exit 1
fi

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
