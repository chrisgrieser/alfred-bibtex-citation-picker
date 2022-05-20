#!/bin/zsh
# shellcheck disable=SC2154,SC2086
export PATH=/usr/local/bin:/opt/homebrew/bin/:$PATH
CSL=apa-6th-edition.csl

# citekey with @ prefix for pandoc
CITEKEY="@$*"

LIBRARY="${bibtex_library_path/#\~/$HOME}"
DUMMYDOC="---\nnocite: |\n  $CITEKEY\n---\n::: {#refs}\n:::"

echo -n "$DUMMYDOC" \
	| pandoc --citeproc --read=markdown --write=plain --csl="assets/$CSL" --bibliography="$LIBRARY" \
	| tr "\n" " " \
	| tr -s " " \
	| sed -E "s/^ //" \
	| sed -E "s/ $//" \
	| pbcopy

# paste
osascript -e 'tell application "System Events" to keystroke "v" using {command down}'
