#!/bin/zsh
# shellcheck disable=SC2154
export PATH=/usr/local/bin:/opt/homebrew/bin/:$PATH
CSL=apa-6th-edition.csl

BIBTEXENTRY="$*"
CITEKEY="@$(echo -n "$BIBTEXENTRY" | cut -d "," -f 1 | cut -d "{" -f 2)"
TEMPBIB="$alfred_workflow_cache""/temp_bibtex.bib"
mkdir -p "$alfred_workflow_cache"
echo -n "$BIBTEXENTRY" > "$TEMPBIB"
DUMMYDOC="---\nnocite: |\n  $CITEKEY\n---\n::: {#refs}\n:::"

echo -n "$DUMMYDOC" | pandoc --citeproc --read=markdown --write=plain --csl="$CSL" --bibliography "$TEMPBIB" | tr "\n" " "
