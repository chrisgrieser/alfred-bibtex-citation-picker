#!/bin/zsh
# shellcheck disable=SC2154
LIBRARY="${bibtex_library_path/#\~/$HOME}"
ENTRIES_BEFORE=$(grep -c -E "^@.*{" "$LIBRARY")

# deletes from a line matching the citekey to the next "}", https://stackoverflow.com/a/14492880
# works with formatting from BibDesk, Bookends, and bibtex-tidy
sed -i '.bak' "/{$CITEKEY,/,/}$/d" "$LIBRARY"

ENTRIES_AFTER=$(grep -c -E "@.*{" "$LIBRARY")
DIFFERENCE=$((ENTRIES_BEFORE - ENTRIES_AFTER))

# pass for notication in Alfred
if [[ $DIFFERENCE == 1 ]]; then
	mv -f "$LIBRARY.bak" ~/.Trash
	echo "✅ $CITEKEY "
	echo "deleted."
else
	echo "⚠️ Error"
	echo "Deleted $DIFFERENCE citations. Check Backup file (ending with .bak) in library location."
fi
