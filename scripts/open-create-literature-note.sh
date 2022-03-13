#!/bin/zsh
# shellcheck disable=SC2154
CITEKEY="$*"
CITEKEY="${CITEKEY/@/}" # remove leading "@"
LITERATURE_NOTE_FOLDER="${literature_note_folder/#\~/$HOME}"
LITERATURE_NOTE_PATH="$LITERATURE_NOTE_FOLDER/$CITEKEY.md"

if [[ ! -f "$LITERATURE_NOTE_PATH" ]] ; then
	# TODO: read BibTeX info and populate YAML with it
	{ echo "---"
	echo "tags: "
	echo "aliases: "
	echo "citekey: $CITEKEY"
	echo "---"
	echo
	echo "# $CITEKEY"
	echo ; } > "$LITERATURE_NOTE_PATH"
fi

# TODO: open in Obsidian, when in vault
open "$LITERATURE_NOTE_PATH"
