#!/bin/zsh
# Create (or open) a citar note for the selected citekey via Emacs `citar-create-note`.
# Requires a running Emacs server (`M-x server-start`, or `(server-start)` in init.el).
# shellcheck disable=2154

export PATH="/opt/homebrew/bin:/usr/local/bin:/Applications/Emacs.app/Contents/MacOS/bin:$PATH"
citekey="$*"
emacsclient="${emacsclient_path:-emacsclient}"
emacsclient="${emacsclient/#\~/$HOME}"

if ! command -v "$emacsclient" &>/dev/null; then
	echo "⚠️ emacsclient not found. Set its path in the workflow configuration."
	return 1
fi

# escape backslashes & quotes for the elisp string
key_escaped=${citekey//\\/\\\\}
key_escaped=${key_escaped//\"/\\\"}

if ! output=$("$emacsclient" --no-wait --eval "(progn (require 'citar) (citar-create-note \"$key_escaped\") (select-frame-set-input-focus (selected-frame)) t)" 2>&1); then
	echo "⚠️ Emacs: ${output:0:120}"
	return 1
fi
open -a Emacs 2>/dev/null
