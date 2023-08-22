#!/bin/zsh

# shellcheck disable=2154
PDF_FOLDER="$pdf_folder"
CITEKEY=$(echo -n "$*")

if [[ -d "$PDF_FOLDER" ]]; then
	cd "$PDF_FOLDER" || return 1
	# opening only requires pdf named with citekey, so PDFs with a method other
	# than this workflow can also be opened.
	FILE_PATH=$(find . -maxdepth 3 -type f -name "*.pdf" | grep -i "$CITEKEY" | head -n1)
else
	# no pdf folder, but try to get the pdf filepath from the `file` entry in the library
	LIBRARY="$bibtex_library_path"
	if [[ ! -f "$LIBRARY" ]]; then
		echo "PDF_FOLDER $PDF_FOLDER and LIBRARY $LIBRARY do not exist"
		return 1
	fi
	FILE_PATH=$(awk -v key="$CITEKEY" '
		/^@/ {
			entry = $0;
			getline;
			while ($0 != "}") {
				entry = entry "\n" $0;
				getline;
			}
			if (entry ~ key) {
				if (entry ~ /file\s*=\s*{[^}]+}/) {
					gsub(/.*file\s*=\s*{/, "", entry);
					gsub(/}.*/, "", entry);

					# Split multiple file paths into an array
					split(entry, file_paths, ";");

					# Loop through the file paths and find the one ending with .pdf
					for (i in file_paths) {
						if (file_paths[i] ~ /\.pdf$/) {
							print file_paths[i];
							found = 1;
							break;
						}
					}
				}
			}
		}
		END {
			if (!found) {
				print "CITEKEY not found.";
			}
		}
	' "$LIBRARY")
fi

if [[ -f "$FILE_PATH" ]]; then 
	open "$FILE_PATH"
else
	echo "No PDF for \"$CITEKEY\" found."
	echo
	echo "Make sure you have entered the correct pdf folder in the settings and named the PDF file correctly."
fi
