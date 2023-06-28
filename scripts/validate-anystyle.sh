#!/usr/bin/env zsh
export PATH=/usr/local/lib:/usr/local/bin:/opt/homebrew/bin/:$PATH

if ! command -v anystyle &>/dev/null; then
	echo "You need to install anystyle for this feature."
fi
