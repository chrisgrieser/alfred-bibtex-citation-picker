#!/bin/zsh

URL="$*"

# shellcheck disable=SC2154
if [[ -z "$csl_folder" ]]; then
	echo "No folder for citation styles set. Please set one in the workflow configuration."
	exit
fi

csl_folder="${csl_folder/#\~/$HOME}"
mkdir -p "$csl_folder" && cd "$csl_folder" || exit 1

curl -sO "$URL"

FILE_NAME=${URL##*/}
FILE_NAME="${FILE_NAME%.*}" # without extension
open -R "$csl_folder/$FILE_NAME.csl"

echo "$FILE_NAME" # for notification
