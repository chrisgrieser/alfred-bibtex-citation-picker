#!/bin/zsh

URL="$*"

# shellcheck disable=SC2154
csl_folder="${csl_folder/#\~/$HOME}"
mkdir -p "$csl_folder" && cd "$csl_folder"

curl -sO "$URL"

FILE_NAME=${URL##*/}
FILE_NAME="${FILE_NAME%.*}" # without extension
open -R "$csl_folder/$FILE_NAME.csl"

echo "$FILE_NAME" # for notification
