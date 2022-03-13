# Supercharged Citation Picker
![](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic)

[Alfred](https://www.alfredapp.com/) Workflow for selecting citations in [Pandoc Syntax](https://pandoc.org/MANUAL.html#citation-syntax) from a BibTeX File.

## Feature Overview
- Inserts __Pandoc Citation Syntax__ (`[@citekey]`). Works with page numbers & multiple citations.
- __works system-wide__, in case you also work in another Markdown app.
- __smart search__: search for citekeys, authors, title, publication, keywords (tags), include/exclude authors in *et al*, tab-completion, ...
- __feature-rich__: paste single-entry bibliographies, remove entries from your library *without opening a reference management app*, open URLs, open or create literature notes, search for `.csl` files online, ...
- __Obsidian integration:__ When located in an Obsidian vault, literature notes will automatically be opened/created in Obsidian. (Otherwise, they will be opened in the default app for markdown files.)
- __very performant:__ considerably quicker than other citation pickers (~200ms to fully reload a library with ~4000 entries on my machine)
- __easy installation:__ no dependencies, no required plugins, no setup (other then entering the link to your `.bib` file).

<img width=60% alt="promo screenshot" src="assets/promo.png">

## Table of Contents
<!-- MarkdownTOC -->

- [Setup](#setup)
- [Usage](#usage)
	- [Search](#search)
	- [Citation Actions](#citation-actions)
	- [URL Actions](#url-actions)
	- [Bibliography Actions](#bibliography-actions)
	- [Literature Note Actions](#literature-note-actions)
- [Auxiliary Features](#auxiliary-features)
- [About the Developer](#about-the-developer)
	- [Profiles](#profiles)
	- [Donate](#donate)
	- [Credits](#credits)

<!-- /MarkdownTOC -->

## Setup
1. [Download the latest release](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/releases/latest).
2. In the workflow settings, set `bibtex_library_path` to the absolute path of your BibTeX library file (Workflow settings tutorial: [How to set environment variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment)).
3. Set a hotkey for the citation picker by double-clicking the respective field in the workflow window.

## Usage
Press the hotkey in any text field to launch the citation picker.
- Alternatively, you can use the Alfred keyword `ct` or the [snippet trigger](https://www.alfredapp.com/help/workflows/triggers/snippet/) `###` (when snippet triggers are activated).

### Search
- Search for the title, author/editor (last name), year, or, collection/journal-title.
- Prepend `@` to search for a citekey, e.g. `@Grieser2020`.
- Prepend `#` to search for keywords (tags), e.g. `#sociology`.
- *Smart Queries*: You can search for any combination of the above. For example, the query `2020 #cognition Grieser` will filter for entries published in 2020, with the tag "cognition", and with (fuzzy-matched) "Grieser" as author/editor.
- The workflow setting `match_authors_in_etal` determines whether authors (or editors) in the *et al.* are still matched when searching for them (default: *true*).

### Citation Actions
- `↵`: Paste the citekey of the selected citation.
- `⌥ + ↵`:  Add another citation.
- `⌘ + ↵`: Add page numbers before pasting the selected citekey. Confirm the page number with `⌥ + ↵` or `⌘ + ↵` to add another citation afterwards.
- *Tab-Completion*: Pressing `tab` autocompletes the author/editor name(s).

### URL Actions
- *If the entry has an URL, a* `🌐` *will be shown. In case there is no URL, the DOI will be used as substitute.*
- `⌃ + ↵`: Open the URL in the browser.
- `⌘ + C`: Copy the URL to the clipboard.

### Bibliography Actions
- `⇧ + ↵`: Reveal the entry in [BibDesk](http://bibdesk.sourceforge.net) (if installed).
- `fn + ↵`: Paste the full bibliographic entry as APA 6th (requires [Pandoc](https://pandoc.org)).
- `⌘fn + ↵`: Delete the entry from the BibTeX library (__Experimental__).
	– ⚠️ This feature is untested with BiBTeX files created with apps other than BibDesk. Please make backups, and [create an issue](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/issues) for problems with other apps.
	- Note that this feature does __not__ work with the [BetterBibTeX Zotero Plugin](https://retorque.re/zotero-better-bibtex/), since the plugin does a one-way-sync (Zotero ➞ BibTeX file), meaning any changes to the `.bib` file will be overridden.

### Literature Note Actions
- `⌘⇧ + ↵`: Open the literature note.
	- If the file is in an [Obsidian Vault](https://obsidian.md/), opens the file in Obsidian.
	- If there is no literature note, a new one will be created and then opened.
- `⌘ + Y`: Quicklook the literature note, if there is one (requires QLmarkdown or Peek[^1]).
- *If the entry has a corresponding literature note, a* `📓` *will be shown.*
- *Both actions look for literature specified in the workflow settings `literature_note_folder`. The files must be named __exactly__ like the citekey (without `@`) and have a `.md` extension.*

## Auxiliary Features
Triggered via the Alfred Keyword `scp` (for `S`upercharged `C`itation `P`icker).
- __CSL Search__: Search for a citation style, which will be downloaded to the location `csl_folder` specified in your workflow settings (default: `~/.pandoc/csl/`).
- __Bibliography Stats__: Brief statistical summary of the library. (Currently only total number of citations.)
- __Cheatsheet: Pandoc Citation Syntax__: Open a cheat sheet for the Pandoc citation syntax.
- __Cheatsheet: Citation Picker Actions__: Open a cheat sheet of the available actions of the Supercharged Citation Picker.
- __Buffer Reload__: Force a reload of the citation picker. Mostly for debugging purposes.

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
- [PayPal](https://www.paypal.com/PayPalme/ChrisGrieser)
- [Ko-Fi](https://ko-fi.com/pseudometa)

<!-- markdown-link-check-enable -->

### Credits
<a href="https://www.flaticon.com/authors/freepik">Icons created by Freepik - Flaticon</a>

[^1]: [QLmarkdown](https://github.com/sbarex/QLMarkdown) and [Peek](https://apps.apple.com/app/peek-quick-look-extension/id1554235898) both enable previewing of Markdown documents. Peek works with a wide range of other file types than Markdown, but costs around 5€. QLMarkdown is free, but only works for Markdown and requires some minor small setup. To enable the proper display of YAML headers, you need to enable the respective setting in the Advanced Options of QLMarkdown or Peek.
