#!/bin/zsh
library=~`echo -n $bibtex_library_path | sed -e "s/~//"`
library_2=~`echo -n $second_library | sed -e "s/~//"`
buffer="$alfred_workflow_data""/buffer.json"

# for whatever reason, [ -e $buffer] does not work, but when buffer is missing, the statement also becomes true, so this works
if [ "$buffer" -nt "$library" ] && [ "$buffer" -nt "$library_2" ] ; then
    echo -n "buffer up-to-date"
else
    echo -n "buffer outdated or non-existent"
fi
