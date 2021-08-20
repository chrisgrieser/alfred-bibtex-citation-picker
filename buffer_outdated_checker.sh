#!/bin/zsh
library=~`echo -n $bibtex_library_path | sed -e "s/~//"`
buffer="$alfred_workflow_data""/buffer.json"
l2_modified=false

# this improves performance as otherwise, library_2 will become the home folder and trigger a slower check whether the buffer is newer than the home folder
if [[ "$second_library" != "" ]] ; then
	library_2=~`echo -n $second_library | sed -e "s/~//"`
	l2_modified=[[ "$buffer" -nt "$library_2" ]]
fi

# for whatever reason, [ -e $buffer ] does not work, but when buffer is missing, the statement also becomes true, so this works
if [[ "$buffer" -nt "$library" ]] && [[ "$l2_modified" = false ]] ; then
    echo -n "buffer up-to-date"
else
    echo -n "buffer outdated or non-existent"
fi
