#!/bin/zsh
# shellcheck disable=SC2154
LIBRARY="${bibtex_library_path/#\~/$HOME}"
BUFFER="$alfred_workflow_data/buffer.json"

# reload buffer if outdated or force reloaded
if [[ ! "$BUFFER" -nt "$LIBRARY" ]] || [[ "$buffer_reload" == "true" ]]; then
	osascript -l JavaScript "./scripts/buffer_writer.js" > "$BUFFER"
fi

cat "$BUFFER"
