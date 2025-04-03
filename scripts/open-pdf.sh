#!/bin/zsh

# shellcheck disable=2154
PDF_FOLDER="$pdf_folder"
CITEKEY=$(echo -n "$*")

if [[ -d "$PDF_FOLDER" ]]; then
	cd "$PDF_FOLDER" || return 1
	# opening only requires pdf named with citekey, so PDFs with a method other
	# than this workflow can also be opened.
	FILE_PATH=$(find . -type f -iname "$CITEKEY*.pdf" | head -n1)
fi

if [[ -f "$FILE_PATH" ]]; then 
	open "$FILE_PATH"
else
	echo "No PDF for \"$CITEKEY\" found."
	echo
	echo "Make sure you have entered the correct pdf folder in the settings and named the PDF file correctly."
fi
