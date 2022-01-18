#!/bin/zsh
# further path additions as pandoc is installed a different location for ARM Macs
export PATH=/usr/local/bin:/opt/homebrew/bin/:$PATH

input="$*"
csl="$alfred_preferences""/workflows/""$alfred_workflow_uid""/citation-styles/""$csl_file"
bib=~`echo -n $bibtex_library_path | sed -e "s/~//"`

# Bibliography only
grep -Eo "[[^]]*@[^]]*]" $input | tr -d "§" > citationsOnly.txt
echo "§" >> citationsOnly.txt
pandoc --citeproc --read=markdown --write=plain --csl $csl --bibliography $bib citationsOnly.txt | tr -d "\n" | cut -d "§" -f 2 > referencesOnly.txt
bib_words=`wc -w referencesOnly.txt | grep -Eo "[[:digit:]]+"`
bib_chars=`wc -m referencesOnly.txt | grep -Eo "[[:digit:]]+"`
bib_chars_without_spaces=`cat referencesOnly.txt | tr -d " " | wc -m | tr -d " "`

# Total Draft
pandoc --citeproc --read=markdown --write=plain --csl $csl --bibliography $bib $input -o total.txt
total_words=`wc -w total.txt | grep -Eo "[[:digit:]]+"`
total_chars=`wc -m total.txt | grep -Eo "[[:digit:]]+"`
total_chars_without_spaces=`cat total.txt | tr -d " " | wc -m | tr -d " "`
rm citationsOnly.txt referencesOnly.txt total.txt

# Output
echo "✍️ Bibliography only"
echo "————————————"
echo $bib_words "words"
echo $bib_chars "characters"
echo "("$bib_chars_without_spaces" without spaces)"
echo ""
echo "📓 Draft Total"
echo "————————————"
echo $total_words "words"
echo $total_chars "characters"
echo "("$total_chars_without_spaces" without spaces)"

