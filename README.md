# BibTeX-Citation-Picker for Alfred
![](https://img.shields.io/github/downloads/chrisgrieser/alfred-bibtex-citation-picker/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/alfred-bibtex-citation-picker?label=Latest%20Release&style=plastic)

[Alfred](https://www.alfredapp.com/) Workflow for selecting citations in [Pandoc Syntax](https://pandoc.org/MANUAL.html#citation-syntax) from a BibTeX File.

<img width=50% src="https://user-images.githubusercontent.com/73286100/132755578-cce9892e-d3c0-4ba3-9666-4649d8b96202.png">

## Requirements
1. [Alfred Powerpack](https://www.alfredapp.com/powerpack/)
2. Bibliography as BibTeX-file.

## Setup
1. [Download the latest release](https://github.com/chrisgrieser/alfred-bibtex-citation-picker/releases/latest).
2. In the Alfred Environment Variables, set `bibtex_library_path` to your library file.
3. Set a hotkey for the citation Picker.

## Usage
Press the hotkey in any text field to launch the citation picker.
- `↵`: paste the citekey of the selected citation.
- `⌘ + ↵`: add page numbers, then paste citekey.
- `⌥ + ↵`:  add another citation. Use  `⌘ + ⌥ + ↵` to add page numbers to this citation and then add another citation.
- `⌘ + C`: to copy the URL to the clipboard, if there is one
- `⇧ + ↵`: reveal the entry in [BibDesk](http://bibdesk.sourceforge.net), if installed.
- `⌃ + ↵`: open the URL in the browser. (If the entry has an URL, a '🌐' will be shown.)
- `fn + ↵`: Paste the full bibliographic entry as APA 6th. Requires [Pandoc](https://pandoc.org).

## About the Developer
In my day job, I am a sociologist studying the social mechanisms underlying the digital economy. For my PhD project, I investigate the governance of the app economy and how software ecosystems manage the tension between innovation and compatibility. If you are interested in this subject, feel free to get in touch!

### Profiles
- [Academic Website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [GitHub](https://github.com/chrisgrieser/)
- [Twitter](https://twitter.com/pseudo_meta)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/) <!-- markdown-link-check-disable-line -->

### Donate
- [PayPal](https://www.paypal.com/PayPalme/ChrisGrieser)
- [Ko-Fi](https://ko-fi.com/pseudometa) <!-- markdown-link-check-disable-line -->
