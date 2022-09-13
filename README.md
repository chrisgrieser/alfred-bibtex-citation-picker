# Supercharged Citation Picker

![](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic) [![](https://img.shields.io/badge/changelog-click%20here-FFE800?style=plastic)](Changelog.md)

A citation picker for academics that write in markdown. Using [Alfred](https://www.alfredapp.com/), it inserts citations from a BibTeX File in various formats, e.g. [Pandoc](https://pandoc.org/MANUAL.html#citation-syntax), [Multi-Markdown](https://fletcher.github.io/MultiMarkdown-6/syntax/citation.html) or [Latex](https://www.overleaf.com/learn/latex/Biblatex_citation_styles).

> **Note**  
> Version 9.7.1 is the last version compatible with Alfred 4. All future versions of this workflow will require [Alfred 5](https://www.alfredapp.com/). 

## Feature Overview
- Inserts __Pandoc Citation Syntax__ (`[@citekey]`), supporting page numbers & multiple citations (`[@citekey, p. 23; @citekey, p. 42]`). There are also customization options to support other citation styles, e.g. Multi-Markdown or Latex.
- __app-independent:__ works system-wide, in every text field of every app.
- __Smart Search:__ search for citekeys, authors, title, publication, keywords (tags), include/exclude authors in *et al*, tab-completion, fuzzy-matching, sorting recently used entries to the top, …
- __Feature-rich:__ paste single-entry bibliographies, open URLs, open or create literature notes, attach PDFs, search for `.csl` files online, backup the library, …
- __Minimalistic reference manager__: add or remove entries the BibTeX library, automatically rename and file PDFs, parse single entries, …
- __Performant:__ considerably quicker than any other citation pickers I know of (~200ms to fully reload a library with ~4000 entries on my machine).
- __Easy Installation:__ no dependencies, no required plugins, no setup. Just need to enter the path to your `.bib` file.
- __Obsidian integration:__ When located in an [Obsidian](https://obsidian.md/) vault, literature notes will automatically be opened/created in Obsidian instead of the default markdown app.

<img width=60% alt="promo screenshot" src="assets/promo.png">

## Table of Contents
<!--toc:start-->
- [Supercharged Citation Picker](#supercharged-citation-picker)
  - [Feature Overview](#feature-overview)
  - [Table of Contents](#table-of-contents)
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
    - [Adding entries to the BibTeX library](#adding-entries-to-the-bibtex-library)
    - [Literature Note Actions](#literature-note-actions)
    - [PDFs Management Actions](#pdfs-management-actions)
    - [Auxiliary Features](#auxiliary-features)
  - [About the Developer](#about-the-developer)
    - [Profiles](#profiles)
    - [Donate](#donate)
    - [Credits](#credits)
<!--toc:end-->

## Getting Started
1. [Download the latest release](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/releases/latest).
2. In the workflow settings, set `bibtex_library_path` to the absolute path of your BibTeX library file (Tutorial: [How to set environment variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment)).
3. Set a hotkey for the citation picker by double-clicking the respective field in the workflow window.

## Basic Usage
Press the hotkey in any text field to launch the citation picker.

### Search
- Search for the title, author/editor (last name), year, or collection/journal-title.
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
| 🏷   | n Keywords      |
| 📓   | Literature Note |
| 📕   | PDF             |

## Changing the Citation Format

### Available Formats
You can use the `scp` and select __Change Citation Format__ to change the format of the citations:
- Pandoc (default)
- Multi-Markdown
- Latex[^5]
- Wikilink
- Tag
- Eta template

### Further Format Customization
If you want to use a format that isn't available, you can customize the format yourself by changing the workflow environment variables starting with `_format` (Tutorial: [How to set environment variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment)).

If there is a citation syntax that is commonly used, feel free to make a PR to [this file which generates the formats](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/blob/main/toggle-citation-format.js) or open a [Feature Request](https://www.ieee.org/).

## Advanced Usage

### Bibliography Actions
- `⇧ + ↵`: Reveal the entry in [BibDesk](http://bibdesk.sourceforge.net), [VSCode](https://code.visualstudio.com), or [Sublime](https://www.sublimetext.com/), depending on the setting `open_entries_in`.
- `⌘⌥ + ↵`: Paste the full bibliographic entry in the APA 6th Style (requires [Pandoc](https://pandoc.org/installing.html)).
- `⌘ + L`: Preview the (unabridged) title, abstract, and list of keywords in Large Type.
- `⌘fn + ↵`: Delete the entry from the BibTeX library.
	- ⚠️ This feature is untested with BiBTeX files created with apps other than BibDesk and Bookends (or have been formatted with `bibtex-tidy`). [Create an issue](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues) for problems with other apps.
- Note that removing entries does __not__ work with the [BetterBibTeX Zotero Plugin](https://retorque.re/zotero-better-bibtex/) since the plugin only does a one-way-sync (Zotero ➞ BibTeX file), meaning any changes to the `.bib` file will be overridden.

### Adding entries to the BibTeX library
- Use the Alfred Keyword `+`, followed by a __DOI__, __ISBN__, or __URL that contains a DOI__.
- You can __parse & add a bibliographic entry__ by selecting the text and pressing the respective hotkey (requires [anystyle](https://github.com/inukshuk/anystyle), installed via `sudo gem install anystyle-cli`).
- Leave the input after the `+` empty to create a __new, empty BibTeX entry__.
- The new entry will be added to your library, with a properly formatted, unique citekey. Afterwards the entry will be opened in the app specified in `open_entries_in`.
- Note that adding entries does __not__ work with the [BetterBibTeX Zotero Plugin](https://retorque.re/zotero-better-bibtex/) since the plugin only does a one-way-sync (Zotero ➞ BibTeX file), meaning any changes to the `.bib` file will be overridden.

### Literature Note Actions
- Looks in the folder specified in the workflow settings for files that are *exactly* named like the citekey (without `@`, but with `.md` extension).
- Entries that have such a literature note will be indicated by a `📓`.
- Add `*` to any search query to filter only for entries with literature notes, e.g. `* grieser` will search for entries from "Grieser" with literature notes. Can be combined with other queries (see: [smart queries](#search)).
- `Meh + ↵`[^4]: Open the literature note.
	- If the file is in an [Obsidian Vault](https://obsidian.md/), opens the file in Obsidian.
	- If there is no literature note, a new one will be created.
- `⌘ + Y`: Preview the literature note with QuickLook (requires QLmarkdown or Peek[^1]).

### PDFs Management Actions
The following features require that all your PDFs are located in the folder specified in your workflow settings.
- `fn + ↵`: __Auto-file and auto-rename__ the *currently selected PDF*. Inside your selected pdf folder, uses the template path: `{first_letter_of_citekey}/{citekey-author-part}/{citekey}_{shortened_title}.pdf`
- The `📕` indicates that the entry already has an associated PDF at that location.
- `Hyper + ↵`[^4]: If the entry has an associated PDF file, open it with the default PDF reader.
- ℹ️ Add `pdf` to any search query to filter only for entries with PDFs that have been added by the auto-file feature. `pdf grieser`, for example, will display only entries from the author "Grieser" with PDFs. Can be combined with other queries (see: [smart queries](#search)).

### Auxiliary Features
Triggered via the Alfred Keyword `scp` (for `S`upercharged `C`itation `P`icker).
- __CSL Search__: Search for a citation style, which will be downloaded to the location specified in your workflow settings (default: `~/.pandoc/csl/`).
- __Bibliography Stats__: Brief statistical summary of the library. (Currently only total number of citations.)
- __Cheatsheet: Citation Picker Actions__: Open a cheat sheet of the available actions of the Supercharged Citation Picker.
- __Force Buffer Reload__: Force a reload of the citation picker for debugging purposes.

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

[^4]: `Hyper` is an artificial "fifth" modifier key equivalent to `⌘⌥⌃⇧`, and can be created using apps like [Karabiner Elements](https://karabiner-elements.pqrs.org/), [BetterTouchTool](https://www.macupdate.com/app/mac/32953/bettertouchtool), or [Hyperkey](https://hyperkey.app/). `Meh` is an artificial "fifth" modifier key equivalent to `⌥⌃⇧`.

[^5]: Latex right now does not support page numbers. If you can code, feel free to make a PR implementing LaTeX citations with page numbers.
