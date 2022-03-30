#!/bin/zsh
# shellcheck disable=SC2154
LIBRARY="${bibtex_library_path/#\~/$HOME}"
grep -c -E "^@.*{" "$LIBRARY"
