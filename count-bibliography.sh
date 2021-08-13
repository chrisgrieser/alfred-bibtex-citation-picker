#!/bin/zsh
export PATH=/usr/local/bin:$PATH

input="$*"
csl="$alfred_preferences""/workflows/""$alfred_workflow_uid""/citation-styles/""$csl_file"
bib=~`echo -n $bibtex_library_path | sed -e "s/~//"`

grep -Eo "[[^]]*@[^]]*]" $input > citationsOnly.txt
echo "💟" >> citationsOnly.txt

pandoc --citeproc --read=markdown --write=plain --csl $csl --bibliography $bib citationsOnly.txt | tr -d "\n" | cut -d "💟" -f 2 > referencesOnly.txt
words=`wc -w referencesOnly.txt | grep -Eo "[[:digit:]]+"`
chars=`wc -m referencesOnly.txt | grep -Eo "[[:digit:]]+"`
chars_without_spaces=`cat referencesOnly.txt | tr -d " " | wc -m | tr -d " "`
rm citationsOnly.txt referencesOnly.txt

echo ""$words" words\n"$chars" characters\n("$chars_without_spaces" without spaces)"