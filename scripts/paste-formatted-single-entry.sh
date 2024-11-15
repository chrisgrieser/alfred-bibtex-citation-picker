#!/bin/zsh
# shellcheck disable=SC2154
export PATH=/usr/local/lib:/usr/local/bin:/opt/homebrew/bin/:$PATH

# GUARD
if ! command -v pandoc &>/dev/null; then
	echo -n "You need to install \`pandoc\` for this feature."
	return 1
fi
#───────────────────────────────────────────────────────────────────────────────

citekey="$*"
csl=$([[ -f "$csl_for_pandoc" ]] && echo "$csl_for_pandoc" || echo "./support/apa-7th.csl")
library="$bibtex_library_path"

dummydoc="---
suppress-bibliography: true
---
@$citekey"

reference=$(echo -n "$dummydoc" |
	command pandoc --citeproc --read=markdown --write=plain --wrap=none \
	--csl="$csl" --bibliography="$library" 2>&1)

#───────────────────────────────────────────────────────────────────────────────
# paste via Alfred
echo -n "$reference"
