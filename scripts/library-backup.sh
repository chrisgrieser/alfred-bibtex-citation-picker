#!/bin/zsh
# shellcheck disable=SC2154

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M')
LIBRARY="${bibtex_library_path/#\~/$HOME}"
LIBRARY_NAME="$(basename "$LIBRARY")"
BACKUP_DESTINATION="${backup_destination/#\~/$HOME}"
BACKUP_NAME="${TIMESTAMP}_$LIBRARY_NAME"

# default to Desktop, if no location set
[[ -z "$BACKUP_DESTINATION" ]] && BACKUP_DESTINATION=~/Desktop

# copy
cd "$BACKUP_DESTINATION" || exit 1
cp "$LIBRARY" ./"$BACKUP_NAME"

# restrict number of backups
ACTUAL_NUMBER=$((max_number_of_bkps + 1))
# shellcheck disable=SC2012,SC2248
ls -t | tail -n +$ACTUAL_NUMBER | tr '\n' '\0' | xargs -0 rm

echo "$BACKUP_NAME"
