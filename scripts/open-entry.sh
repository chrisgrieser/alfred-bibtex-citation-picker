#!/bin/zsh
# shellcheck disable=SC2154
export PATH=/usr/local/bin/:/opt/homebrew/bin/:$PATH

LIBRARY="${bibtex_library_path/#\~/$HOME}"
CITEKEY="$*"
CITEKEY="${CITEKEY/@/}"
LINE_NO=$(grep -n "{$CITEKEY," "$LIBRARY" | cut -d' ' -f1)

if [[ "$open_entries_in:l" =~ "bibdesk" ]]; then
	open "x-bdsk://$CITEKEY"
elif [[ "$open_entries_in:l" =~ "sublime" ]]; then
	subl "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in:l" =~ "vscode" ]]; then
	code "$LIBRARY:$LINE_NO"
elif [[ "$open_entries_in:l" =~ "vs code" ]]; then
	code "$LIBRARY:$LINE_NO"
else
	echo "$open_entries_in not a valid value for 'open_entries_in'."
fi


