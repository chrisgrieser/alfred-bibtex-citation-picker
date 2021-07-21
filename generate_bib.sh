#!/bin/zsh
export PATH=/usr/local/bin:$PATH

bibtexentry="$*"
citekey="@"`echo -n $bibtexentry | cut -d "," -f 1 | cut -d "{" -f 2`
tempbib="$alfred_workflow_cache""/temp_entry.bib"
mkdir -p "$alfred_workflow_cache"
echo -n $bibtexentry > $tempbib

csl=~`echo -n $csl_file | sed -e "s/^~//"`
dummyDoc="---\nnocite: |\n  "$citekey"\n---\n::: {#refs}\n:::"

echo -n $dummyDoc | pandoc --citeproc --read=markdown --write=plain --csl $csl --bibliography $tempbib | tr "\n" " "