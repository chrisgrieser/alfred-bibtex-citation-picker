# Supercharged Citation Picker
![GitHub downloads](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=GitHub%20Downloads&style=plastic&logo=github)
![Alfred gallery downloads](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisgrieser%2F.config%2Frefs%2Fheads%2Fmain%2FAlfred.alfredpreferences%2Falfred-gallery-downloads.yaml&query="supercharged-citation-picker"&style=plastic&logo=alfred&label=Gallery%20Downloads&color=%235C1F87)
![Latest release](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic)

A smart citation picker and lightweight reference manager for
[Alfred](https://www.alfredapp.com/). Uses `.bib` files and supports
[Pandoc](https://pandoc.org/MANUAL.html#citation-syntax),
[Multi-Markdown](https://fletcher.github.io/MultiMarkdown-6/syntax/citation.html),
[LaTeX](https://www.overleaf.com/learn/latex/Biblatex_citation_styles), [org
mode](https://orgmode.org/manual/Citations.html), and various other formats.

<img width="1106" alt="showcase" src="https://github.com/chrisgrieser/alfred-bibtex-citation-picker/assets/73286100/c16c0621-ca62-4f05-909b-c2acd602feb1">

## Feature overview

### Core features
- Inserts __Pandoc citation syntax__ (`[@citekey]`), supporting page numbers &
  multiple citations (`[@citekey, p. 23; @citekey, p. 42]`). Can also be
  configured to use __LaTeX__, __Multi-Markdown__, __eta templates__, __org
  mode__, `[[wikilinks]]`, `#tags`, or `bare citkeys` as citation format.
- __App-independent:__ Works system-wide, in every text field of every app.
- __Smart search:__ Search for citekeys, authors, title, publication, keywords
  (tags), include or exclude authors in *et al.*, tab-completion,
  short queries, sorting recently used entries to the top, …
- __Simple installation:__ Just enter the path to your `.bib` file, and you are
  ready to go.
- __Blazingly fast:__ Considerably quicker than any other citation picker
  (200 milliseconds to fully reload a library with 4000 entries).

### Advanced features
- __Citation actions:__ Paste single-entry bibliographies, open URLs,
  open or create literature notes, attach PDFs, search for `.csl` files online,
  and more.
- __Lightweight reference management:__ Automatically rename and file PDFs, add,
  or remove entries.
- __Quickly add new entries:__ Select a DOI or ISBN and add them directly to
  your BibTeX library via hotkey.
- __Support for two libraries:__ You can pick citations from two BibTeX Library
  files at the same time.
- __Obsidian integration:__ When located in your [Obsidian
  Vault](https://obsidian.md/), literature notes are automatically
  opened/created in Obsidian instead of the default Markdown app.

## Table of contents

<!-- toc -->

- [Installation](#installation)
- [Basic usage](#basic-usage)
	* [Search](#search)
	* [Citation actions](#citation-actions)
	* [URL actions](#url-actions)
	* [Icon meanings](#icon-meanings)
- [Changing the citation format](#changing-the-citation-format)
- [Advanced usage](#advanced-usage)
	* [Bibliography actions](#bibliography-actions)
	* [Add new entries](#add-new-entries)
	* [Literature note actions](#literature-note-actions)
	* [PDF management actions](#pdf-management-actions)
	* [Link preview](#link-preview)
	* [Auxiliary features](#auxiliary-features)
- [Cite this software project](#cite-this-software-project)
- [Credits](#credits)
- [About the developer](#about-the-developer)

<!-- tocstop -->

## Installation
1. [Download the latest release](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/releases/latest).
2. Enter the BibTeX library path.
3. Select your citation format. The default is *Pandoc Citations*. To switch to
   another format like LaTeX, Multi-Markdown, org mode, eta, \[\[wikilinks\]\],
   or #tags use the keyword `scp` in Alfred and select `Change citation format`.
4. Use the citation picker via the Alfred keyword `cc`, or set a
   [hotkey](https://www.alfredapp.com/help/workflows/triggers/hotkey/) for the
   citation picker by double-clicking the respective field in the workflow
   window.

## Basic usage
Press the [hotkey](https://www.alfredapp.com/help/workflows/triggers/hotkey/) in
any text field to start the citation picker. Alternatively, use the `ct`
keyword.

### Search
- You can search for the title, author/editor (last name), year, collection, or
  journal name.
- Prepend `@` to a word to search for a citekey, for example `@Grieser2020`.
- Prepend `#` to search for keywords (tags), for example `#sociology`.
- *Smart Queries*: You can search for any combination of the above. For example,
  the query `2020 #cognition grieser` searches for entries published in 2020,
  with the tag "cognition," and with "Grieser" as author/editor.
- *Short Queries*: You do not need to fully spell out every item. `grie #cogn
  2020` gives you the same result as above, if no other author begins with
  `grie` and no other tag starts with `cogn`.

### Citation actions
- <kbd>⏎</kbd>: Paste the citekey of the selected citation.
- <kbd>⌥</kbd><kbd>⏎</kbd>: Add another citation.
- <kbd>⇧</kbd><kbd>⌘</kbd><kbd>⏎</kbd>: Paste an inline-citation (citation
  without surrounding formatting, for example `@Grieser2022` instead of `[@Grieser2022]`)
- <kbd>⌘</kbd><kbd>⏎</kbd>: Add page numbers before pasting the selected citekey.
  * Confirm the page number with <kbd>⌥</kbd><kbd>⏎</kbd> or
	<kbd>⌘</kbd><kbd>⏎</kbd> to add another citation afterward.
  * Confirm with <kbd>⇧</kbd><kbd>⌘</kbd><kbd>⏎</kbd> for an inline-citation
	with page number (`@Grieser2022 [p. 42]`).

### URL actions
- <kbd>⌃</kbd><kbd>⏎</kbd>: Open the URL in the browser.
- <kbd>⌘</kbd><kbd>C</kbd>: Copy the URL to the clipboard.
- In both cases, if the entry has a DOI but not a URL, the citation picker uses
  the DOI-URL (`https://doi.org/…`) instead.

### Icon meanings
<!-- markdownlint-disable table-column-style -->
| Icon | Entry has                             |
|:-----|:--------------------------------------|
| 🌐   | URL or DOI                            |
| 📄   | Abstract                              |
| n 🏷 | n Keywords                            |
| 📓   | Literature Note                       |
| 📕   | PDF                                   |
| 2️⃣    | entry is from 2nd library             |
| 📎   | entry has attachment                  |
<!-- markdownlint-enable table-column-style -->

## Changing the citation format
You can use the `scp` and select __Change citation format__ to change the format
of the citations:
- Pandoc (default)
- Org Mode
- Multi-Markdown (`MMD`)
- LaTeX
- eta template
- `iA Writer`
- Formatted single entry
	* Requires [Pandoc](https://pandoc.org/installing.html).
	* The used citation style can be customized in the workflow configuration
	  (default: APA 7th).
- `[[wikilink]]`
- `#tag`
- bare citekey
- bracketed citekey

> [!NOTE]
> Not all formats support all citation-related features. For example, adding
> Page numbers as well as inline-citations are not supported for LaTeX,
> Wikilinks, and Tags.

If there is a citation syntax that is commonly used, or if you want to improve
support for an existing format, feel free to open a [Feature
Request](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues/new?assignees=&labels=enhancement&template=feature_request.yml&title=Feature+Request%3A+)
or make a PR to [this file which defines the citation
formats](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/blob/main/scripts/toggle-citation-format.js).

> [!NOTE]
> Due to technical restrictions, you may need to set the citation style once
> more after updates to this workflow.

## Advanced usage

### Bibliography actions
- <kbd>⇧</kbd><kbd>⏎</kbd>: Reveal the entry in Zotero, Neovim, VS Code,
  BibDesk, or Sublime Text, depending on the setting in the workflow
  configuration. (Note that this does not work for the secondary library.)
- <kbd>⌘</kbd><kbd>⌥</kbd><kbd>⏎</kbd>: Paste the full bibliographic entry.
	* Requires [Pandoc](https://pandoc.org/installing.html).
	* The used citation style can be customized in the workflow configuration.
	  (default: APA 7th)
- <kbd>⌘</kbd><kbd>L</kbd>: Preview the unabridged title, abstract, and list of
  all keywords (tags).
- <kbd>⌘</kbd><kbd>fn</kbd><kbd>⏎</kbd>: Delete the entry from the BibTeX
  library. (⚠️ This cannot be undone.)
- <kbd>⌘</kbd><kbd>Y</kbd>: Preview the URL of entry in a QuickLook window.

### Add new entries
- [Universal Action](https://www.alfredapp.com/help/features/universal-actions/)
  or [Hotkey](https://www.alfredapp.com/help/workflows/triggers/hotkey/): Uses
  the selected __DOI__, __ISBN__, or __URL containing a DOI__ to add a new entry
  to the library.

> [!NOTE]
> Adding or removing entries does __not__ work with the [BetterBibTeX Zotero
> Plugin](https://retorque.re/zotero-better-bibtex/) since the plugin only does
> a one-way-sync (Zotero ➞ BibTeX file), meaning any changes to the `.bib` file
> are not reflected in Zotero.

### Literature note actions
- The citation picker looks in the folder specified in the workflow settings for
  files that are *exactly* named like the citekey. Entries that have such a
  literature note are indicated by a `📓`.
- <kbd>⌃</kbd><kbd>⌥</kbd><kbd>⏎</kbd>: Open the literature note.
  * If the file is in your [Obsidian Vault](https://obsidian.md/), it is
	opened directly in Obsidian instead of the default text editor.
  * If there is no literature note, a new one is created.
- Add `*` to any search query to filter only for entries with literature notes,
  for example `* grieser` searches for entries matching "Grieser" which also
	have a literature notes. Can be combined with other queries (see: [smart
	queries](#search)).

### PDF management actions
The following features require that all your PDFs are located in the folder
specified in your workflow settings.
- The citation picker looks in the folder specified in the workflow settings for
  PDFs that are *exactly* named like the citekey, optionally followed by an
  underscore `_` and some text. For example: `{citekey}.pdf` or
  `{citekey}_{title}.pdf`. The citekey itself must not contain underscores, and
  the filename must not include the `@`.
- The `📕` indicates that the entry has an associated PDF at that location.
- <kbd>Hyper</kbd><kbd>⏎</kbd>[^1]: If the entry has an associated PDF file,
  open it with the default PDF reader.
- Add `pdf` to any search query to filter only for entries with PDFs that have
  been added by the auto-file feature. `pdf grieser`, for example, displays only
  entries from the author "Grieser" with PDFs. Can be combined with other
  queries (see: [smart queries](#search)).
- A `📎` indicates that the BibTeX entry has a `file`, `local-url`, or
  `attachment` field. You can use
  <kbd>⌃</kbd><kbd>⌥</kbd><kbd>⌘</kbd><kbd>⏎</kbd> to open the attachment. If
  there are multiple attachments, the first one is opened.

### Link preview
- Install the
  [AlfredExtraPane](https://github.com/mr-pennyworth/alfred-extra-pane) for
  previews of entry URLs.

### Auxiliary features
Triggered via the Alfred Keyword `scp` (mnemonic: Supercharged Citation Picker).
- __Cheatsheet__: Open a cheat sheet of the available actions of the
  Supercharged Citation Picker.
- __Citation Style Search__: Search for a citation style (`.csl` file), which is
  downloaded to the location specified in your workflow settings (default:
  `~/.pandoc/csl/`).
- __Force Buffer Reload__: Force a reload of the citation picker. Mostly for
  debugging purposes.

## Cite this software project
If you want to mention this software project in an academic publication, please
cite it as:

```txt
Grieser, C. (2023). Supercharged Citation Picker [Computer software]. 
https://github.com/chrisgrieser/alfred-bibtex-citation-picker
```

For other citation styles, use the following metadata: [cff
file](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/blob/main/CITATION.cff)

## Credits
<a href="https://www.flaticon.com/authors/freepik">Icons created by `Freepik`
(`Flaticon`)</a>

## About the developer
In my day job, I am a sociologist studying the social mechanisms underlying the
digital economy. For my PhD project, I investigate the governance of the app
economy and how software ecosystems manage the tension between innovation and
compatibility. If you are interested in this subject, feel free to get in touch.

- [Academic website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Mastodon](https://pkm.social/@pseudometa)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

*For bug reports and features requests, please use the [GitHub issue tracker](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues/new/choose).*

<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'> <img height='36'
style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3'
border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

[^1]: `Hyper` is an artificial "fifth" modifier key equal to `⌘⌥⌃⇧`, and can be
	created using apps like [Karabiner
	Elements](https://karabiner-elements.pqrs.org/),
	[BetterTouchTool](https://www.macupdate.com/app/mac/32953/bettertouchtool),
	or [Hyperkey](https://hyperkey.app/).
