# BibTeX-Citation-Picker for Alfred
![](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic)

[Alfred](https://www.alfredapp.com/) Workflow for selecting citations in [Pandoc Syntax](https://pandoc.org/MANUAL.html#citation-syntax) from a BibTeX File. Performs quicker than other citation pickers and also opens literature notes.

<img width=50% src="https://user-images.githubusercontent.com/73286100/132755578-cce9892e-d3c0-4ba3-9666-4649d8b96202.png">

## Table of Contents
<!-- MarkdownTOC -->

- [Setup](#setup)
- [Usage](#usage)
	- [Search](#search)
	- [Actions](#actions)
	- [Literature Notes](#literature-notes)
- [Additional Alfred Keywords](#additional-alfred-keywords)
- [About the Developer](#about-the-developer)
	- [Profiles](#profiles)
	- [Donate](#donate)

<!-- /MarkdownTOC -->

## Setup
Requirements: [Alfred Powerpack](https://www.alfredapp.com/powerpack/)
1. [Download the latest release](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/releases/latest).
2. In the Alfred Environment Variables, set `bibtex_library_path` to the absolute path to your library file. (Tutorial: [How to set Environment Variables in Alfred](https://www.alfredapp.com/help/workflows/advanced/variables/#environment))
3. Set a hotkey for the citation picker.

## Usage
Press the hotkey in any text field to launch the citation picker.

### Search
- Search for the title, author, editor, year, or, collection.
- Prepend `@` to search for a citekey, e.g. `@Grieser2020`.
- Prepend `#` to search for keywords (tags), e.g. `#sociology`

### Actions
- `↵`: Paste the citekey of the selected citation.
- `⌘ + ↵`: Add page numbers, then paste citekey.
- `⌥ + ↵`:  Add another citation. Use  `⌘⌥ + ↵` to add page numbers to this citation and then add another citation.
- `⌘ + C`: Copy the URL to the clipboard, if there is one.
- `tab`: Filter the search results for the author(s) of the selected entry.
- `⌘⇧ + ↵`: Open the literature note, if there is one. (If the entry has an URL, a `📓` will be shown.)
- `⌘ + Y`: Quicklook the literature note (requires QLmarkdown or Peek[^1]).
- `⇧ + ↵`: reveal the entry in [BibDesk](http://bibdesk.sourceforge.net) (if installed).
- `⌃ + ↵`: Open the URL in the browser. (If the entry has an URL, a `🌐` will be shown.)
- `fn + ↵`: Paste the full bibliographic entry as APA 6th (requires [Pandoc](https://pandoc.org)).

### Literature Notes
regarding `⌘⇧ + ↵` and `⌘ + Y`:
- Look for literature notes in the folder `literature_note_folder` set in the environment variables.
- The files must be *exactly* named like the citekey (without `@`) and have a `.md` extension.

## Additional Alfred Keywords
- `force reload`: Force a reload of the buffer for debugging purposes.
- `pandoc`: Open a cheat sheet for the Pandoc citation syntax.
- `csl`: Search for a citation style, which will be installed in the folder `csl_folder` specified in your environment variables.

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

[^1]: [QLmarkdown](https://github.com/sbarex/QLMarkdown) and [Peek](https://apps.apple.com/app/peek-quick-look-extension/id1554235898) both enable previewing of Markdown documents. Peek works with a wide range of other file types than Markdown, but costs around 5€. QLMarkdown is free, but only works for Markdown and requires some minor small setup. To enable the proper display of YAML headers, you need to enable the respective setting in the Advanced Options of QLMarkdown or Peek.
