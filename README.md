# Supercharged Citation Picker
![](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic) 

A citation picker and lightweight reference manager for [Alfred](https://www.alfredapp.com/). Uses a BibTeX File and supports various formats like [Pandoc Markdown](https://pandoc.org/MANUAL.html#citation-syntax), [Multi-Markdown](https://fletcher.github.io/MultiMarkdown-6/syntax/citation.html), [LaTeX](https://www.overleaf.com/learn/latex/Biblatex_citation_styles), or [Org Mode](https://orgmode.org/manual/Citations.html).

<img width=60% alt="showcase screenshot" src="assets/showcase.png">

## Feature Overview
- Inserts __Pandoc Citation Syntax__ (`[@citekey]`), supporting page numbers & multiple citations (`[@citekey, p. 23; @citekey, p. 42]`). Can also be configured to use __LaTeX__, __Multi-Markdown__, __eta templates__, __Org Mode__, `[[wikilinks]]`, `#tags` or `bare citkeys` as citation format.
- __App-independent:__ Works system-wide, in every text field of every app.
- __Smart Search:__ Search for citekeys, authors, title, publication, keywords (tags), include or exclude authors in *et al.*, tab-completion, fuzzy-matching, sorting recently used entries to the top.
- __Feature-rich:__ Paste single-entry bibliographies, open URLs, open or create literature notes, attach PDFs, search for `.csl` files online, and more.
- __Blazingly Fast:__ Considerably quicker than any other citation picker (~200 ms to fully reload a library with ~4000 entries).
- __Simple Installation:__ Just enter the path to your `.bib` file, and you are ready to go.
- __Lightweight Reference Manager:__ Automatically rename and file PDFs, remove, entries, and more.
- __Quickly Add New Entries:__ Select a DOI or ISBN and add them directly to your BibTeX library via hotkey.
- __Obsidian Integration:__ When located in your [Obsidian Vault](https://obsidian.md/), literature notes are automatically opened or created in Obsidian instead of the default markdown app.

## Table of Contents
<!--toc:start-->
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
    - [Search](#search)
    - [Citation Actions](#citation-actions)
    - [URL Actions](#url-actions)
    - [Icon Meanings](#icon-meanings)
  - [Changing the Citation Format](#changing-the-citation-format)
    - [Available Formats](#available-formats)
    - [Other Format Customization](#other-format-customizations)
  - [Advanced Usage](#advanced-usage)
    - [Bibliography Actions](#bibliography-actions)
    - [Add New Entries](#add-new-entries)
    - [Literature Note Actions](#literature-note-actions)
    - [PDF Management Actions](#pdf-management-actions)
    - [Auxiliary Features](#auxiliary-features)
  - [Spread the Word](#spread-the-word)
  - [About the Developer](#about-the-developer)
    - [Profiles](#profiles)
    - [Donate](#donate)
    - [Credits](#credits)
<!--toc:end-->

## Installation
1. [Download the latest release](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/releases/latest).
2. Enter the BibTeX Library path.
3. Use the citation picker via the Alfred keyword `ct`, or set a [hotkey](https://www.alfredapp.com/help/workflows/triggers/hotkey/) for the citation picker by double-clicking the respective field in the workflow window.

## Basic Usage
Press the [hotkey](https://www.alfredapp.com/help/workflows/triggers/hotkey/) in any text field to start the citation picker. Alternatively, use the `ct` keyword.

### Search
- You can search for the title, author/editor (last name), year, collection, or journal name.
- Prepend `@` to a word to search for a citekey, for example `@Grieser2020`.
- Prepend `#` to search for keywords (tags), for example `#sociology`.
- *Smart Queries*: You can search for any combination of the above. For example, the query `2020 #cognition grieser` searches for entries published in 2020, with the tag "cognition," and with "Grieser" as author/editor.

### Citation Actions
- <kbd>⏎</kbd>: Paste the citekey of the selected citation.
- <kbd>⌥</kbd><kbd>⏎</kbd>: Add another citation.
- <kbd>⇧</kbd><kbd>⌘</kbd><kbd>⏎</kbd>: Paste an inline-citation (citation without surrounding formatting, for example `@Grieser2022` instead of `[@Grieser2022]`)
- <kbd>⌘</kbd><kbd>⏎</kbd>: Add page numbers before pasting the selected citekey.
  - Confirm the page number with <kbd>⌥</kbd><kbd>⏎</kbd> or <kbd>⌘</kbd><kbd>⏎</kbd> to add another citation afterward.
  - Confirm with <kbd>⇧</kbd><kbd>⌘</kbd><kbd>⏎</kbd> for an inline-citation with page number (`@Grieser2022 [p. 42]`).

### URL Actions
- <kbd>⌃</kbd><kbd>⏎</kbd>: Open the URL in the browser.
- <kbd>⌘</kbd><kbd>C</kbd>: Copy the URL to the clipboard.
- In both cases, if the entry has a DOI but not a URL, the citation picker uses the DOI-URL (`https://doi.org/…`) instead.

### Icon Meanings

| Icon | Entry has       |
|:-----|:----------------|
| 🌐   | URL or DOI      |
| 📄   | Abstract        |
| n 🏷 | n Keywords      |
| 📓   | Literature Note |
| 📕   | PDF             |

## Changing the Citation Format

### Available Formats
You can use the `scp` and select __Change Citation Format__ to change the format of the citations:

- Pandoc (default)
- Org Mode
- Multi-Markdown (MMD)
- LaTeX
- eta template
- iA Writer
- `[[wikilink]]`
- `#tag`
- bare citekey
- bracketed citekey

> __Note__  
> Not all formats support all citation-related features. For example, adding Page numbers as well as inline-citations are not supported for Latex, Wikilinks, and Tags, and iA Writer does not support multiple citations.

### Other Format Customizations
If you want to use a format that is not available, you can customize the format yourself by changing the workflow environment variables starting with `_format`. (Tutorial: [How to set environment variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment))

If there is a citation syntax that is commonly used, or if you want to improve support for an existing format, feel free to open a [Feature Request](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues/new?assignees=&labels=enhancement&template=feature_request.yml&title=Feature+Request%3A+).

You can also make a PR to [this file which defines the citation formats](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/blob/main/scripts/toggle-citation-format.js).

## Advanced Usage

### Bibliography Actions
- <kbd>⇧</kbd><kbd>⏎</kbd>: Reveal the entry in Zotero, neovim, BibDesk, VS Code, or Sublime Text, depending on the setting in the workflow configuration.
- <kbd>⌘</kbd><kbd>⌥</kbd><kbd>⏎</kbd>: Paste the full bibliographic entry in the APA 6th Style (requires [Pandoc](https://pandoc.org/installing.html)).
- <kbd>⌘</kbd><kbd>L</kbd>: Preview the (unabridged) title, abstract, and list of keywords.
- <kbd>⌘</kbd><kbd>fn</kbd><kbd>⏎</kbd>: Delete the entry from the BibTeX library. (⚠️ This cannot be undone.) 

### Add New Entries
- [Universal Action](https://www.alfredapp.com/help/features/universal-actions/) or [Hotkey](https://www.alfredapp.com/help/workflows/triggers/hotkey/): Uses the selected __DOI__, __ISBN__, or __URL containing a DOI__ to add a new entry to the library.
  - A second [Universal Action](https://www.alfredapp.com/help/features/universal-actions/) can be used to parse & add a bibliographic entry. Requires [anystyle](https://github.com/inukshuk/anystyle).
  - The new entry is added to your library, with a correctly formatted and unique citekey. Afterward, the entry is opened.
- [File Action](https://www.alfredapp.com/help/features/universal-actions/): Use the `Add Entry and Auto-file` action on a PDF file that includes a DOI. The DOI is automatically retrieved from the PDF, the entry added to the library, and the PDF auto-filed (see [PDF Management Actions](#pdf-management-actions)). Requires [pdfgrep](https://pdfgrep.org/).

> __Warn__
> Adding or removing entries does __not__ work with the [BetterBibTeX Zotero Plugin](https://retorque.re/zotero-better-bibtex/) since the plugin only does a one-way-sync (Zotero ➞ BibTeX file), meaning any changes to the `.bib` file are not reflected in Zotero.

### Literature Note Actions
- The citation picker looks in the folder specified in the workflow settings for files that are *exactly* named like the citekey, optionally followed by an underscore `_` and some text, for example: `{citekey}.md` or `{citekey}_{title}.md`. The citekey itself must not contain underscores, and the filename must not include the `@`.
- Entries that have such a literature note is indicated by a `📓`.
- <kdb>⌃</kdb><kdb>⌥</kdb><kdb>⏎</kdb>: Open the literature note.
  - If the file is in your [Obsidian Vault](https://obsidian.md/), it is opened directly in Obsidian instead of the default text editor.
  - If there is no literature note, a new one is created.
- <kdb>⌘</kdb><kdb>Y</kdb>: Preview the literature note with `QuickLook` (requires `QLmarkdown` or `Peek`[^1]).
- Add `*` to any search query to filter only for entries with literature notes, for example `* grieser` searches for entries matching "grieser" which also have a literature notes. Can be combined with other queries (see: [smart queries](#search)).

### PDF Management Actions
The following features require that all your PDFs are located in the folder specified in your workflow settings.
<!-- LTeX: enabled=false -->
- <kbd>fn</kbd><kbd>⏎</kbd>: __Auto-file and auto-rename__ the *currently selected PDF*. Inside your selected PDF folder, uses the template path: `{first_letter_of_citekey}/{citekey-author-part}/{citekey}_{shortened_title}.pdf` <!-- LTeX: enabled=true -->
- The `📕` indicates that the entry already has an associated PDF at that location.
- <kbd>⇪</kbd><kbd>⏎</kbd>[^2]: If the entry has an associated PDF file, open it with the default PDF reader. The citekey must not contain an underscore (`_`).
- Add `pdf` to any search query to filter only for entries with PDFs that have been added by the auto-file feature. `pdf grieser`, for example, displays only entries from the author "Grieser" with PDFs. Can be combined with other queries (see: [smart queries](#search)).

### Auxiliary Features
<!-- vale Vale.Spelling = NO -->
Triggered via the Alfred Keyword `scp` (mnemonic: `S`upercharged `C`itation `P`icker).
<!-- vale Vale.Spelling = YES -->
- __Cheatsheet: Citation Picker Actions__: Open a cheat sheet of the available actions of the Supercharged Citation Picker.
- __Citation Style Search__: Search for a citation style (`.csl` file), which is downloaded to the location specified in your workflow settings (default: `~/.pandoc/csl/`).
- __Force Buffer Reload__: Force a reload of the citation picker. Mostly for debugging purposes.

<!-- vale Google.FirstPerson = NO -->
## Spread the Word
As this is probably the most feature-rich and most performant citation picker on macOS, it is kind of a bummer that not many people know about this. However, I do not really know where to "advertise" this, since I am not aware of any forum or website for academics that work with markdown and BibTeX. So if you know a good place, feel free to contact me or spread the word yourself. 😊

## About the Developer
In my day job, I am a sociologist studying the social mechanisms underlying the digital economy. For my PhD project, I investigate the governance of the app economy and how software ecosystems manage the tension between innovation and compatibility. If you are interested in this subject, feel free to get in touch.

### Profiles
- [Academic Website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [GitHub](https://github.com/chrisgrieser/)
- [Twitter](https://twitter.com/pseudo_meta)
- [Mastodon](https://pkm.social/@pseudometa)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

### Donate
<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

### Credits
<a href="https://www.flaticon.com/authors/freepik">Icons created by Freepik (Flaticon)</a>
<!-- vale Google.FirstPerson = YES -->

[^1]: [QLmarkdown](https://github.com/sbarex/QLMarkdown) and [Peek](https://apps.apple.com/app/peek-quick-look-extension/id1554235898) both enable previewing of Markdown documents. Peek works with a wide range of other file types than Markdown, but costs around 5€. `QLMarkdown` is free, but only works for Markdown and requires some minor setup. To enable the proper display of YAML headers, you need to enable the respective setting in the Advanced Options of `QLMarkdown` or Peek.

[^2]: `Hyper` is an artificial "fifth" modifier key equal to `⌘⌥⌃⇧`, and can be created using apps like [Karabiner Elements](https://karabiner-elements.pqrs.org/), [BetterTouchTool](https://www.macupdate.com/app/mac/32953/bettertouchtool), or [Hyperkey](https://hyperkey.app/).
