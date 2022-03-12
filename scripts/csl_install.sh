#!/bin/zsh

URL="$*"

# shellcheck disable=SC2154
mkdir -p "$csl_folder"
cd "$csl_folder" || exit 1

curl -sO "$URL"
FILE_NAME=${URL##*/}
FILE_NAME="${FILE_NAME%.*}" # without extension

echo "$FILE_NAME" | pbcopy # to insert into document
echo "$FILE_NAME" # for notification
