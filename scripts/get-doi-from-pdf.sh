#!/usr/bin/env zsh

if ! command -v pdfgrep &>/dev/null; then echo -n "pdfgrep not installed." && exit 1; fi

pdf="$*"
pdfgrep --page-range=1,4 --max-count=1 --fixed-strings "doi" "$pdf" || echo -n "No DOI found in first 4 pages."
