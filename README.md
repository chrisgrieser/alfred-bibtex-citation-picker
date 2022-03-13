# Supercharged Citation Picker
![](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic)

[Alfred](https://www.alfredapp.com/) Workflow for selecting citations in [Pandoc Syntax](https://pandoc.org/MANUAL.html#citation-syntax) from a BibTeX File. Performs quicker than other citation pickers and also offers various utilities for interacting with literature notes and bibliography.

<img width=50% src="https://user-images.githubusercontent.com/73286100/132755578-cce9892e-d3c0-4ba3-9666-4649d8b96202.png">

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
2. In the Alfred Environment Variables, set `bibtex_library_path` to the absolute path to your BibTeX library file (Tutorial: [How to set Environment Variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment)).
3. Set a hotkey for the citation picker.

## Usage
Press the hotkey in any text field to launch the citation picker.

### Search
- Search for the title, author/editor (last name), year, or, collection/journal-title.
- Prepend `@` to search for a citekey, e.g. `@Grieser2020`.
- Prepend `#` to search for keywords (tags), e.g. `#sociology`.
- *Smart Queries*: You can search for any combination of the above. For example, the query `2020 #cognition Grieser` will filter for entries published in 2020, with the tag "cognition", and with fuzzy-matched "Grieser" as author/editor.

### Citation Actions
- `↵`: Paste the citekey of the selected citation.
- `⌘ + ↵`: Add page numbers, then paste citekey.
- `⌥ + ↵`:  Add another citation.
- `⌘⌥ + ↵`: Used to add page numbers to this citation *and then* add another citation.
- `tab`: Tab-complete the author name, i.e. filter the search results for the author(s) of the selected entry.

### URL Actions
- *If the entry has an URL, a* `🌐` *will be shown. In case there is no URL, the DOI will be used.*
- `⌃ + ↵`: Open the URL in the browser.
- `⌘ + C`: Copy the URL to the clipboard.

### Bibliography Actions
- `⇧ + ↵`: Reveal the entry in [BibDesk](http://bibdesk.sourceforge.net) (if installed).
- `fn + ↵`: Paste the full bibliographic entry as APA 6th (requires [Pandoc](https://pandoc.org)).
- `⌘fn + ↵`: Delete the entry from the BibTeX library. (⚠️ Experimental – Feature untested with  BiBTeX files created with apps other than BibDesk. Please make backups before.)

### Literature Note Actions
- `⌘⇧ + ↵`: Open the literature note. If there is no literature note, a new one will be created and then opened.
- `⌘ + Y`: Quicklook the literature note (requires QLmarkdown or Peek[^1]).
- *If the entry has an corresponding literature note, a* `📓` *will be shown.*
- *Both actions look for literature specified in the environment variable `literature_note_folder`. The files must be named __exactly__ like the citekey (without `@`) and have a `.md` extension.*

## Auxiliary Features
Triggered via the Alfred Keyword `scp` (`S`upercharged `C`itation `P`icker)
- __CSL Search__: Search for a citation style, which will be downloaded in the folder `csl_folder` specified in your environment variables.
- __Bibliography Stats__: 
- __Cheatsheet: Pandoc Citation Syntax__: Open a cheat sheet for the Pandoc citation syntax.
- __Cheatsheet: Citation Picker Actions__: Open a cheat sheet for [various actions](#usage) of the Supercharged Citation Picker.
- __Buffer Reload__: Force a reload of the citation picker for debugging purposes.

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

## Credits
<a href="https://www.flaticon.com/authors/freepik">Icons created by Freepik - Flaticon</a>

[^1]: [QLmarkdown](https://github.com/sbarex/QLMarkdown) and [Peek](https://apps.apple.com/app/peek-quick-look-extension/id1554235898) both enable previewing of Markdown documents. Peek works with a wide range of other file types than Markdown, but costs around 5€. QLMarkdown is free, but only works for Markdown and requires some minor small setup. To enable the proper display of YAML headers, you need to enable the respective setting in the Advanced Options of QLMarkdown or Peek.
