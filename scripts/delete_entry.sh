#!/bin/zsh
# shellcheck disable=SC2154
CITEKEY="${citekey/@/}"
LIBRARY="${bibtex_library_path/#\~/$HOME}"

# deletes from a line matching the citekey to the next "}", https://stackoverflow.com/a/14492880
sed -i '' "/{$CITEKEY,/,/}$/d" "$LIBRARY"

# pass for notication in Alfred
echo -n "$CITEKEY"
