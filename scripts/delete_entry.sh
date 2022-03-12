#!/bin/zsh
# shellcheck disable=SC2154
CITEKEY="${citekey/@/}"
LIBRARY="${bibtex_library_path/#\~/$HOME}"

# deletes from a line matching the citekey to the next "}}"
# (This is tailored for the BibTeX format used by BibDesk)
# TODO: check how other apps format this.
sed -i '' "/{$CITEKEY,/,/}}$/d" "$LIBRARY"

# pass for notication in Alfred
echo -n "$CITEKEY"
