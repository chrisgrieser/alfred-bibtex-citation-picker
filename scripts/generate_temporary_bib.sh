#!/bin/zsh
# shellcheck disable=SC2154
export PATH=/usr/local/bin:/opt/homebrew/bin/:$PATH

CSL=apa-6th-edition.csl
CITEKEY="@$*" # citekey with @ prefix for pandoc
LIBRARY="${bibtex_library_path/#\~/$HOME}"
DUMMYDOC=$(cat <<EOF
---
nocite: |
  $CITEKEY
---
::: {#refs}
:::
EOF
)

if ! command -v pandoc &>/dev/null; then
	echo -n "You need to install pandoc for this feature." | pbcopy
else
	echo "$DUMMYDOC" \
		| pandoc --citeproc --read=markdown --write=plain --csl="$CSL" --bibliography="$LIBRARY" \
		| tr "\n" " " \
		| tr -s " " \
		| sed -E "s/^ //" \
		| sed -E "s/ $//" \
		| pbcopy
fi

# paste
sleep 0.2
osascript -e 'tell application "System Events" to keystroke "v" using {command down}'
