#!/bin/zsh
PDF_FOLDER="${pdf_folder/#\~/$HOME}"
CITEKEY="$*"
# shellcheck disable=SC2001
CITEKEY_ALT=$(echo "$CITEKEY" | sed 's/\([[:digit:]]...\)/_\1/') # try old naming pattern of PDFs

cd "$PDF_FOLDER" || return 1

PDF_LIST=$(find . -maxdepth 3 -type f -name "*.pdf")
FILE_PATH=$(echo "$PDF_LIST" | grep -i "$CITEKEY" | head -n1 || echo "$PDF_LIST" | grep -i "$CITEKEY_ALT" | head -n1)
open "$FILE_PATH"
