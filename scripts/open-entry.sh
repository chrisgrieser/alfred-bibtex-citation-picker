#!/bin/zsh
# shellcheck disable=SC2154,SC2086

LIBRARY="$bibtex_library_path"
CITEKEY=$(echo "$*" | tr -d "\n")
LINE_NO=$(grep -n "{$CITEKEY," "$LIBRARY" | head -n1 | cut -d':' -f1)

if [[ "$open_entries_in" == "BibDesk" ]]; then
	open "x-bdsk://$CITEKEY"
elif [[ "$open_entries_in" == "Sublime" ]]; then
	# using full path ensures this work even if `subl` hasn't been added to PATH
	"/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in" == "VS Code" ]]; then
	code -g "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in" == "Zotero" ]]; then
	# INFO "bbt:" ensures that the item is opened in the personal library https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues/20#issuecomment-1406495450
	open "zotero://select/items/bbt:$CITEKEY"
elif [[ "$open_entries_in" == "default app for .bib files" ]]; then
	# passing line arguments for the few apps that could parse it
	open "$LIBRARY" --env=LINE=$LINE_NO || open "$LIBRARY"
fi


