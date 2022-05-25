#!/bin/zsh
# shellcheck disable=SC2154

PAGE_NUMBER="$*"
PAGE_PART="$_format_page_prefix$PAGE_NUMBER$_format_page_suffix"

if [[ "$_format_page_before_citekey" == "true" ]]; then
	echo -n "$PAGE_PART$pageless_citation"
else
	echo -n "$pageless_citation$PAGE_PART"
fi
