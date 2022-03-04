#!/bin/zsh
# further path additions as pandoc is installed a different location for ARM Macs
export PATH=/usr/local/bin:/opt/homebrew/bin/:$PATH

bibtexentry="$*"
citekey="@"`echo -n $bibtexentry | cut -d "," -f 1 | cut -d "{" -f 2`
tempbib="$alfred_workflow_cache""/temp_bibtex.bib"
mkdir -p "$alfred_workflow_cache"
echo -n $bibtexentry > $tempbib

csl="$alfred_preferences""/workflows/""$alfred_workflow_uid""/citation-styles/""$csl_file"
dummyDoc="---\nnocite: |\n  "$citekey"\n---\n::: {#refs}\n:::"

echo -n $dummyDoc | pandoc --citeproc --read=markdown --write=plain --csl $csl --bibliography $tempbib | tr "\n" " "