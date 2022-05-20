# Supercharged Citation Picker
![](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic) [![](https://img.shields.io/badge/changelog-click%20here-FFE800?style=plastic)](Changelog.md)

A citation picker for academics that write in markdown. Using [Alfred](https://www.alfredapp.com/), this citation picker inserts [Pandoc](https://pandoc.org/MANUAL.html#citation-syntax), [Multi-Markdown](https://fletcher.github.io/MultiMarkdown-6/syntax/citation.html), or [Latex](https://www.overleaf.com/learn/latex/Biblatex_citation_styles) citations from a BibTeX File.

## Feature Overview
- Inserts __Pandoc Citation Syntax__ (`[@citekey]`), supporting page numbers & multiple citations (`[@citekey, p. 23; @citekey, p. 42]`). There are also customization options to support other citation styles, e.g. Multi-Markdown or Latex.
- __App-independent:__ works system-wide, in every text field of every app.
- __Smart Search:__ search for citekeys, authors, title, publication, keywords (tags), include/exclude authors in *et al*, tab-completion, fuzzy-matching, sorting recently used entries to the top, …
- __Feature-rich:__ paste single-entry bibliographies, open URLs, open or create literature notes, search for `.csl` files online, backup the library, …
- __Minimalistic reference manager__: add or remove entries without from the BibTeX library or automatically file PDF.
- __Performant:__ considerably quicker than other citation pickers (~200ms to fully reload a library with ~4000 entries on my machine).
- __Easy Installation:__ no dependencies, no required plugins, no setup. other than entering the path to your `.bib` file.
- __Obsidian integration:__ When located in an [Obsidian](https://obsidian.md/) vault, literature notes will automatically be opened/created in Obsidian, instead of the default markdown app.

<img width=60% alt="promo screenshot" src="assets/promo.png">

## Table of Contents
<!-- MarkdownTOC -->

- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
	- [Search](#search)
	- [Citation Actions](#citation-actions)
	- [URL Actions](#url-actions)
	- [Icon Meanings](#icon-meanings)
- [Changing the Citation Format](#changing-the-citation-format)
	- [Available Formats](#available-formats)
	- [Further Format Customization](#further-format-customization)
- [Advanced Usage](#advanced-usage)
	- [Bibliography Actions](#bibliography-actions)
	- [Advanced Search Features](#advanced-search-features)
	- [Literature Note Actions](#literature-note-actions)
	- [PDFs: Auto-filing & Auto-renaming](#pdfs-auto-filing--auto-renaming)
	- [Auxiliary Features](#auxiliary-features)
- [About the Developer](#about-the-developer)
	- [Profiles](#profiles)
	- [Donate](#donate)
	- [Credits](#credits)

<!-- /MarkdownTOC -->

## Getting Started
1. [Download the latest release](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/releases/latest).
2. In the workflow settings, set `bibtex_library_path` to the absolute path of your BibTeX library file (Tutorial: [How to set environment variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment)).
3. Set a hotkey for the citation picker by double-clicking the respective field in the workflow window.

## Basic Usage
Press the hotkey in any text field to launch the citation picker.

### Search
- Search for the title, author/editor (last name), year, or, collection/journal-title.
- Prepend `@` to a word to search for a citekey, e.g. `@Grieser2020`.
- Prepend `#` to search for keywords (tags), e.g. `#sociology`.
- *Smart Queries*: You can search for any combination of the above. For example, the query `2020 #cognition Grieser` will for entries published in 2020, with the tag "cognition", and with "Grieser" as author/editor.
- *Quick Queries*: The search is fuzzy and case-insensitive. For year dates, it also matches the last two digits. For example, you can search for `fouc 77` to find `Foucault 1977`. In addition, recently selected entries are placed further at the top of the search results.

### Citation Actions
- `↵`: Paste the citekey of the selected citation.
- `⌥ + ↵`:  Add another citation.
- `⌘ + ↵`: Add page numbers before pasting the selected citekey. Confirm the page number with `⌥ + ↵` or `⌘ + ↵` to add another citation afterwards.

### URL Actions
- `⌃ + ↵`: Open the URL in the browser.
- `⌘ + C`: Copy the URL to the clipboard.

### Icon Meanings

| Icon | Entry has...    |
|:-----|:----------------|
| 🌐   | URL or DOI      |
| 📄   | Abstract        |
| 🏷 n | n Keywords      |
| 📓   | Literature Note |
| 📕   | PDF             |

## Changing the Citation Format

### Available Formats
You can use the `scp` and select __Change Citation Format__ to change the format of the citations:
- Pandoc (default)
- Multi-Markdown
- Latex
- Wikilink
- Tag

### Further Format Customization
If you want to use a format that isn't available, you can customize the format yourself by changing the workflow environment variables starting with `_format` (Tutorial: [How to set environment variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment)).

If there is a citation syntax that more people, feel free to make a PR to [this file which generates the formats](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/blob/main/toggle-citation-format.js).

## Advanced Usage

### Bibliography Actions
- `⇧ + ↵`: Reveal the entry in [BibDesk](http://bibdesk.sourceforge.net), [VSCode](https://code.visualstudio.com), or [Sublime](https://www.sublimetext.com/), depending on the setting `open_entries_in`.
- `⌘⌥ + ↵`: Paste the full bibliographic entry in the APA 6th Style (requires [Pandoc](https://pandoc.org/installing.html)).
- `⌘ + L`: Preview the (unabridged) title, abstract, and list of keywords in Large Type.
- `⌘fn + ↵`: Delete the entry from the BibTeX library.
	- ⚠️ This feature is untested with BiBTeX files created with apps other than BibDesk and Bookends (or have been formatted with `bibtex-tidy`). [Create an issue](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues) for problems with other apps.
- __Add entries to the BibTex library__: use the Alfred Keyword `+`, followed by a DOI or ISBN
	- the respective entry will be added to your library, with a properly formatted citekey (avoiding duplicates with existing library, etc.)
	- Leave the input after the `+` empty to create a new, empty BibTeX entry.
	- Opens the entry afterwards in the app specified in `open_entries_in`.
- Note that adding & removing entries does __not__ work with the [BetterBibTeX Zotero Plugin](https://retorque.re/zotero-better-bibtex/) since the plugin only does a one-way-sync (Zotero ➞ BibTeX file), meaning any changes to the `.bib` file will be overridden.

### Advanced Search Features
- The workflow setting `match_authors_in_etal` determines whether authors (or editors) in the *et al.* are still matched when searching for them (default: *true*).
- The workflow setting `match_only_short_years` ensures that searching for "19" only matches publications written in the year 2019 (or 1919), and not all publications written between 1900 and 1999 (default: *false*).
- *Tab-Completion*: Pressing `tab` autocompletes the first author/editor name.

### Literature Note Actions
- Looks in the folder specified in the workflow settings `literature_note_folder` for files that are *exactly* named like the citekey (without `@`, but with `.md` extension).
- Entries that have a literature note like this will be indicated by a `📓`.
- Add `*` to any search query to filter only for entries with literature notes, e.g. `* grieser` will search for entries from "Grieser" with literature notes. Can be combined with other queries (see: [smart queries](#search)).
- `⌘⇧ + ↵`: Open the literature note.
	- If the file is in an [Obsidian Vault](https://obsidian.md/), opens the file in Obsidian.
	- If there is no literature note, a new one will be created.
- `⌘ + Y`: Preview the literature note with QuickLook (requires QLmarkdown or Peek[^1]).

### PDFs: Auto-filing & Auto-renaming
- `fn + ↵`: Auto-file and auto-rename the *currently selected PDF in Finder* to the folder specified in `pdf_folder`.
- Inside `pdf_folder`, uses the template path used is: `{first_letter_of_citekey}/{citekey-author-part}/{citekey}_{shortened_title}.pdf`
- If there is a PDF already present at that location, it will be indicated by a `📕`.
- Add `pdf` to any search query to filter only for entries with PDFs that have been added by the auto-file feature. `pdf grieser` for example will search for entries from the author "Grieser" with PDFs. Can be combined with other queries (see: [smart queries](#search)).

### Auxiliary Features
Triggered via the Alfred Keyword `scp` (for `S`upercharged `C`itation `P`icker).
- __CSL Search__: Search for a citation style, which will be downloaded to the location `csl_folder` specified in your workflow settings (default: `~/.pandoc/csl/`).
- __Bibliography Stats__: Brief statistical summary of the library. (Currently only total number of citations.)
- __Cheatsheet: Pandoc Citation Syntax__: Open a cheat sheet for the Pandoc citation syntax.
- __Cheatsheet: Citation Picker Actions__: Open a cheat sheet of the available actions of the Supercharged Citation Picker.
- __Force Buffer Reload__: Force a reload of the citation picker for debugging purposes.
- __Run BibTeX-Tidy__: Runs [`bibtex-tidy`](https://github.com/FlamingTempura/bibtex-tidy) with the options set in `bibtex_tidy_options` in the terminal.[^4]
- __Autocompletion List__: Create an autocompletion list formatted for use with the [Various Complements Plugin](https://obsidian.md/plugins?id=various-complements) in Obsidian.[^3]
- __Library Backup[^2]__: Create a Backup of your library in the location `backup_destination`, restricting the maximum number of backups to `max_number_of_bkps` (deleting the oldest backup). You can also use the following AppleScript to trigger the backups, e.g. for a cron job:

```applescript
tell application id "com.runningwithcrayons.Alfred" to run trigger "BibTeX Library Backup" in workflow "de.chris-grieser.alfred-bibtex-citation-picker"
```

## About the Developer
In my day job, I am a sociologist studying the social mechanisms underlying the digital economy. For my PhD project, I investigate the governance of the app economy and how software ecosystems manage the tension between innovation and compatibility. If you are interested in this subject, feel free to get in touch!

<!-- markdown-link-check-disable -->

### Profiles
- [Academic Website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [GitHub](https://github.com/chrisgrieser/)
- [Twitter](https://twitter.com/pseudo_meta)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

### Donate
<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

<!-- markdown-link-check-enable -->

### Credits
<a href="https://www.flaticon.com/authors/freepik">Icons created by Freepik - Flaticon</a>

[^1]: [QLmarkdown](https://github.com/sbarex/QLMarkdown) and [Peek](https://apps.apple.com/app/peek-quick-look-extension/id1554235898) both enable previewing of Markdown documents. Peek works with a wide range of other file types than Markdown, but costs around 5€. QLMarkdown is free, but only works for Markdown and requires some minor small setup. To enable the proper display of YAML headers, you need to enable the respective setting in the Advanced Options of QLMarkdown or Peek.

[^2]: As per [MIT License](LICENSE), this app comes without any warranty in case of data loss. That being said, I never had any problems with the backups created.

[^3]: Set the workflow setting `autocomplete_list_location` to the *absolute* path where the file should be created and use a `.txt` extension. In the *Various Complements* settings, use "Prefix" as Matching Strategy, the pipe character (`|`) as delimiter, enable *Custom Dictionaries*, add the previously created file to the custom dictionary list, and set `Delimiter to divide suggestions for display from ones for insertion` to `>>>`. Afterwards, reload custom dictionaries via the command palette. (If the [Advanced URI Plugin](https://obsidian.md/plugins?id=obsidian-advanced-uri) is installed, the reloading of the custom dictionaries will be triggered automatically, if the file is already in the custom dictionary list.)

[^4]: Uses the app [set as default terminal in the Alfred preferences](https://www.alfredapp.com/help/features/terminal/).
