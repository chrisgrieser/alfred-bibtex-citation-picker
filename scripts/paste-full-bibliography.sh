#!/bin/zsh

if ! command -v pandoc &>/dev/null; then
	echo -n "You need to install pandoc for this feature."
	return 0
fi

CSL="./apa-6th-edition.csl"
CITEKEY="$*"
# shellcheck disable=SC2154
LIBRARY="$bibtex_library_path"
DUMMYDOC="---
nocite: '@$CITEKEY'
---"

reference=$(echo -n "$DUMMYDOC" |
	pandoc --citeproc --read=markdown --write=plain --wrap=none \
	--csl="$CSL" --bibliography="$LIBRARY")

echo -n "$reference"
