#!/bin/zsh
# shellcheck disable=2154

#───────────────────────────────────────────────────────────────────────────────

BUFFER="$alfred_workflow_data/buffer.json"
last_version_file="$alfred_workflow_data/last_version.txt"

# create folder and last version file, if not existing yet (e.g. first run)
[[ -d "$alfred_workflow_data" ]] || mkdir -p "$alfred_workflow_data"
[[ -e "$last_version_file" ]] || echo "never run" >"$last_version_file"

# reload buffer if buffer is outdated compared to
# - library or 2nd library file
# - literature notes
# - PDFs
# - workflow preferences (potentially changing matching behavior etc)
# - manually requested reload
# - new workflow version (to ensure new features/bug fixes take effect)
if [[ "$bibtex_library_path" -nt "$BUFFER" ]] ||
	[[ "$secondary_library_path" -nt "$BUFFER" ]] ||
	[[ "$literature_note_folder" -nt "$BUFFER" ]] ||
	[[ "$pdf_folder" -nt "$BUFFER" ]] ||
	[[ "./prefs.plist" -nt "$BUFFER" ]] ||
	[[ "$buffer_reload" == "true" ]] ||
	[[ "$(head -n1 "$last_version_file")" != "$alfred_workflow_version" ]] \
	; then
	osascript -l JavaScript "./scripts/buffer_writer.js" >"$BUFFER"
	echo -n "$alfred_workflow_version" >"$last_version_file"
fi

# pass json to Alfred
cat "$BUFFER"
