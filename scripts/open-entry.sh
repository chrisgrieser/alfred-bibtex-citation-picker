#!/bin/zsh
# shellcheck disable=SC2154,SC2086
export PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

LIBRARY="${bibtex_library_path/#\~/$HOME}"
CITEKEY="$*"
LINE_NO=$(grep -n "{$CITEKEY," "$LIBRARY" | head -n1 | cut -d':' -f1)

if [[ "$open_entries_in" == "BibDesk" ]]; then
	open "x-bdsk://$CITEKEY"
elif [[ "$open_entries_in" == "Sublime" ]]; then
	# using full path makes this work even if `subl` hasn't been added to PATH
	"/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in" == "VS Code" ]]; then
	code "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in" == "neovim & alacritty" ]]; then
	alacritty --command nvim +$LINE_NO "$LIBRARY"
elif [[ "$open_entries_in" == "Zotero" ]]; then
	open "zotero://select/items/@$CITEKEY"
fi


