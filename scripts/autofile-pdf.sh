#!/bin/zsh

citekey=$(echo "$*" | tr -d "\n")

#───────────────────────────────────────────────────────────────────────────────
# GET FILEPATH & CHECK VALIDITY OF VARIABLES

# shellcheck disable=2154
pdf_folder="${pdf_folder/#\~/$HOME}"
if [[ ! -e "$pdf_folder" ]]; then
	echo "PDF folder does not exist." && return 1
elif [[ -z "$pdf_folder" ]]; then
	echo "PDF folder not set." && return 1
fi

# shellcheck disable=2154
if [[ "$mode" == "id+autofile" ]]; then
	selected_file="$pdf_filepath" # set via Alfred
else
	no_of_selections=$(osascript -l JavaScript -e 'Application("Finder").selection().length')
	selected_file=$(osascript -l JavaScript -e 'decodeURIComponent(Application("Finder").selection()[0]?.url()).slice(7)')
	ext="${selected_file##*.}"

	if [[ $no_of_selections -eq 0 ]]; then
		echo "⛔️ No file selected." && return 1
	elif [[ $no_of_selections -gt 1 ]]; then
		echo "⛔️ More than one file selected." && return 1
	elif [[ "$ext" != "pdf" ]]; then
		echo "⛔️ Selected file is not a PDF." && return 1
	fi
fi

#───────────────────────────────────────────────────────────────────────────────

# auto-filing
author=$(echo -n "$citekey" | sed -E 's/[[:digit:]]+.*//') # assumes citekey is author+year
first_character=${citekey:0:1}

# shellcheck disable=2154
title=$(grep --ignore-case --after-context=20 --max-count=1 "{${citekey}," "${bibtex_library_path}" |
	grep --extended-regexp "\btitle ?=" --max-count=1)
safe_truncated_title=$(
	echo -n "$title" |
		cut -d= -f2 |
		tr ";:/?!" "-" |
		sed -E 's/^ *//;s/[-_ ]$//g' |
		tr -d "{}„\"'´,#" |
		cut -c -50 |
		sed -E 's/ $//'
)

autofile_folder="$pdf_folder/$first_character/$author"
autofile_path="$autofile_folder/${citekey}_${safe_truncated_title}.pdf"

if [[ -e "$autofile_path" ]]; then
	echo "⛔️ There is already a PDF file."
	echo "Delete it and run auto-file again."
	open -R "$autofile_path"
	return 1
fi

mkdir -p "$autofile_folder"
mv "$selected_file" "$autofile_path"
open -R "$autofile_path"
