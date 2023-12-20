#!/bin/zsh
# shellcheck disable=SC2154

# GUARD
if ! command -v pandoc &>/dev/null; then
	echo -n "You need to install pandoc for this feature."
	return 1
fi

citekey="$*"
csl=$([[ -f "$csl_for_pandoc" ]] && echo "$csl_for_pandoc" || echo "./assets/apa-7th.csl")
library="$bibtex_library_path"

dummydoc="---
nocite: '@$citekey'
---"

reference=$(echo -n "$dummydoc" |
	pandoc --citeproc --read=markdown --write=plain --wrap=none \
	--csl="$csl" --bibliography="$library")

echo -n "$reference"
