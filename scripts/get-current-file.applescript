#!/usr/bin/env osascript
if (system attribute "focusedapp") is "md.obsidian" then
	tell application "Obsidian"
		open location "obsidian://advanced-uri?commandid=open-with%253Ashow-file-in-explorer"
		open location "obsidian://advanced-uri?commandid=open-with-default-app%253Ashow"
	end tell
	delay 0.8
else if (system attribute "focusedapp") is "com.sublimetext.4" then
	do shell script ("'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl' --command \"open_dir {\\\"dir\\\": \\\"\\$file_path\\\", \\\"file\\\": \\\"\\$file_name\\\"}\"")
	delay 0.8
end if

tell application "Finder" to set sel to selection
if ((count sel) > 1) then
	set firstItem to item 1 of sel
	return POSIX path of (firstItem as text)
else
	return POSIX path of (sel as text)
end if
