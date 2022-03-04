#!/bin/zsh
# shellcheck disable=SC2154
BIBTEX_LIBRARY_PATH="${bibtex_library_path/#\~/$HOME}"
BUFFER="$alfred_workflow_data/buffer.json"

if [[ "$BUFFER" -nt "$BIBTEX_LIBRARY_PATH" ]] ; then
    echo -n "buffer up-to-date"
else
    echo -n "buffer outdated or non-existent"
fi
