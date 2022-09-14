#!/bin/zsh
# shellcheck disable=SC2154,SC2086
export PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

LIBRARY="${bibtex_library_path/#\~/$HOME}"
CITEKEY="$*"
open_entries_in=${open_entries_in:l} # to make the comparison case insensitive
LINE_NO=$(grep -n "{$CITEKEY," "$LIBRARY" | head -n1 | cut -d':' -f1)

if [[ "$open_entries_in" == "bibdesk" ]]; then
	open "x-bdsk://$CITEKEY"
elif [[ "$open_entries_in" == "sublime" ]]; then
	# using full path makes this work even if `subl` hasn't been added to PATH
	"/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in" == "vscode" ]]; then
	code "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in" == "vim" ]]; then
	vim +$LINE_NO "$LIBRARY"
elif [[ "$open_entries_in" == "neovim" ]]; then
	nvim +$LINE_NO "$LIBRARY"
elif [[ "$open_entries_in" == "zotero" ]]; then
	open "zotero://select/items/@$CITEKEY"
fi
