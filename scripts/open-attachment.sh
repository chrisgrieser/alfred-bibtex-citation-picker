#!/usr/bin/env zsh

attachment_path="$1"
echo "attachment_path: $attachment_path" >&2
if [[ -f "$attachment_path" ]]; then
	open "$attachment_path"
else
	echo "⚠️ No file file found at\"$attachment_path\"."
fi
