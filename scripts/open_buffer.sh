#!/bin/zsh
# shellcheck disable=SC2154
LIBRARY="${bibtex_library_path/#\~/$HOME}"
BUFFER="$alfred_workflow_data/buffer.json"

# create folder, if not existing yet (e.g. first run)
[[ ! -d "$alfred_workflow_data" ]] && mkdir -p "$alfred_workflow_data"

# reload buffer if outdated or manually requested reload
if [[ ! "$BUFFER" -nt "$LIBRARY" ]] || [[ "$buffer_reload" == "true" ]]; then
	osascript -l JavaScript "./scripts/buffer_writer.js" > "$BUFFER"
fi

cat "$BUFFER"
