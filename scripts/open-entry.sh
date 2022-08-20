#!/bin/zsh
# shellcheck disable=SC2154
export PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

LIBRARY="${bibtex_library_path/#\~/$HOME}"
CITEKEY="$*"
open_entries_in=${open_entries_in:l} # to make the comparison case insensitive
LINE_NO=$(grep -n "{$CITEKEY," "$LIBRARY" | head -n1 | cut -d':' -f1)

if [[ "$open_entries_in" =~ "bibdesk" ]]; then
	open "x-bdsk://$CITEKEY"
elif [[ "$open_entries_in" =~ "sublime" ]]; then
	# using full path makes this work even if `subl` hasn't been added to PATH
	"/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in" =~ "vscode" ]] || [[ "$open_entries_in" =~ "vs code" ]]; then
	code "$LIBRARY:$LINE_NO"
else
	echo "$open_entries_in not a valid value for 'open_entries_in'."
fi
