#!/bin/zsh
# shellcheck disable=SC2154
export PATH=/usr/local/bin:/opt/homebrew/bin/:$PATH
CSL=apa-6th-edition.csl

CITEKEY="$*"
LIBRARY="${bibtex_library_path/#\~/$HOME}"
DUMMYDOC="---\nnocite: |\n  $CITEKEY\n---\n::: {#refs}\n:::"

echo -n "$DUMMYDOC" \
	| pandoc --citeproc \
	--read=markdown --write=plain \
	--csl="$CSL" --bibliography="$LIBRARY" \
	| tr -d "\n"
