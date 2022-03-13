#!/bin/zsh
# shellcheck disable=SC2154
LIBRARY="${bibtex_library_path/#\~/$HOME}"
BUFFER="$alfred_workflow_data/buffer.json"

if [[ ! "$BUFFER" -nt "$LIBRARY" ]] || [[ "$*" == "buffer_reload" ]]; then
	osascript -l JavaScript "scripts/buffer_writer.js" > "$BUFFER"
fi
