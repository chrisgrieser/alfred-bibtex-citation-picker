#!/bin/zsh

# shellcheck disable=2154
PDF_FOLDER="$pdf_folder"
CITEKEY="$*"

if [[ -d "$PDF_FOLDER" ]]; then
	cd "$PDF_FOLDER" || return 1
else
	echo "$PDF_FOLDER does not exist"
	return 1
fi

# opening only requires pdf named with citekey, soPDFs field with a method other
# than this workflow can also be opened.
FILE_PATH=$(find . -maxdepth 3 -type f -name "*.pdf" | grep -i "$CITEKEY" | head -n1)

if [[ -f "$FILE_PATH" ]]; then 
	open "$FILE_PATH"
else
	echo "No PDF for \"$CITEKEY\" found."
	echo
	echo "Make sure you have entered the correct pdf folder in the settings and named the PDF file correctly."
fi
