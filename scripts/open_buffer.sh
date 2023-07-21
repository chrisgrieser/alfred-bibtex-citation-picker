#!/bin/zsh
# shellcheck disable=2154

# Workflow Config Vars
LIBRARY="$bibtex_library_path"
LIT_NOTES_FOLDER="$literature_note_folder"
PDF_FOLDER="$pdf_folder"
#───────────────────────────────────────────────────────────────────────────────

BUFFER="$alfred_workflow_data/buffer.json"
PREFS="./prefs.plist"
LAST_VERSION_FILE="$alfred_workflow_data/last_version.txt"

# create folder and last version file, if not existing yet (e.g. first run)
[[ -d "$alfred_workflow_data" ]] || mkdir -p "$alfred_workflow_data"
[[ -e "$LAST_VERSION_FILE" ]] || echo "never run" >"$LAST_VERSION_FILE"

LAST_RUN_VERSION=$(head -n1 "$LAST_VERSION_FILE")
THIS_VERSION="$alfred_workflow_version"

# reload buffer if buffer is outdated compared to
# - library file
# - literature notes
# - PDFs
# - workflow preferences (potentially changing matching behavior etc)
# - manually requested reload
# - new workflow version (to ensure new features/bug fixes take effect)
if [[ "$LIBRARY" -nt "$BUFFER" ]] ||
	[[ "$LIT_NOTES_FOLDER" -nt "$BUFFER" ]] ||
	[[ "$PDF_FOLDER" -nt "$BUFFER" ]] ||
	[[ "$PREFS" -nt "$BUFFER" ]] ||
	[[ "$buffer_reload" == "true" ]] ||
	[[ "$LAST_RUN_VERSION" != "$THIS_VERSION" ]] \
	; then
	osascript -l JavaScript "./scripts/buffer_writer.js" >"$BUFFER"
	echo -n "$THIS_VERSION" >"$LAST_VERSION_FILE"
fi

# pass json to Alfred
cat "$BUFFER"
