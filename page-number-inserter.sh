#!/bin/zsh
# shellcheck disable=SC2154

PAGE_NO="$*"
PAGE_PART="$_format_page_no_prefix$PAGE_NO$_format_page_no_suffix"

if [[ "$_format_page_before_citekey" == "true" ]]; then
	echo -n "$pageless_citation$PAGE_PART"
else
	echo -n "$PAGE_PART$pageless_citation"
fi
