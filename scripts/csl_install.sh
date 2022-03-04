#!/bin/zsh
CSL_DIR=~/.pandoc/csl/

URL="$*"

mkdir -p "$CSL_DIR"
cd "$CSL_DIR" || exit 1

curl -sO "$URL"
FILE_NAME=${URL##*/}
FILE_NAME="${FILE_NAME%.*}" # without extension

echo "$FILE_NAME" | pbcopy # to insert into document
echo "$FILE_NAME" # for notification
