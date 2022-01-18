#!/bin/zsh
cat << EOB
{
	"items": [
		{
			"title": "🚪 Exit this Configuration",
			"match":"exit leave quit cancel",
			"uid": "1",
			"arg": "exit"
		},
		{
			"title": "❓ Documentation & Guide for the Pandoc-Suite",
			"arg": "workflow_documentation",
			"match":"help documentation usage guide",
			"uid": "2",
			"subtitle": "Troubleshooting & further Information"
		},
		{
			"title": "❓ Pandoc Documentation",
			"arg": "man_pandoc",
			"match":"help documentation usage guide manual",
			"uid": "3",
			"subtitle": "open man page in Preview.app"
		},
		{
			"title": "🆕 ✍️ Search & Select Citation Style",
			"arg": "csl_file",
			"match":"citation style csl",
			"uid": "4",
			"subtitle": "currently: $csl_file"
		},
		{
			"title": "📚 1️⃣ BibTeX Library",
			"arg": "bibtex_library_path",
			"match":"bib bibtex library references",
			"uid": "5",
			"subtitle": "currently: $bibtex_library_path"
		},
		{
			"title": "📚 🤿 Debugging: Deep Search Library File",
			"arg": "hard_bib_search",
			"match":"bib bibtex library references",
			"uid": "6",
			"subtitle": "Select this if your BibTex Library cannot be found with the option above"
		},
		{
			"title": "📇 Set Resource Path subfolder",
			"match":"resource path ressource images attachments",
			"arg": "resource_path_subfolder",
			"uid": "7",
			"subtitle": "currently: $resource_path_subfolder"
		},
		{
			"title": "🔘 Hotkey Output Format",
			"match":"hotkey output format docx html pdf pptx",
			"arg": "hotkey_output_format",
			"uid": "8",
			"subtitle": "currently: $hotkey_output_format"
		},
		{
			"title": "📅 Date to Add (filename & content)",
			"match":"date format filename add insert american",
			"arg": "date_to_append",
			"uid": "9",
			"subtitle": "currently: $date_to_append"
		},
		{
			"title": "📄 Word Reference Document",
			"match":"word docx reference document template office microsoft",
			"arg": "reference_docx_path",
			"uid": "10",
			"subtitle": "currently: $reference_docx_path"
		},
		{
			"title": "🏎 PDF-Engine",
			"match":"pdf-engine pdf engine pdflatex wkhtmltopdf groff",
			"arg": "pdf_engine",
			"uid": "11",
			"subtitle": "currently: $pdf_engine"
		},
		{
			"title": "🧑‍🏫 Powerpoint Reference Presentation",
			"match":"reference powerpoint presentation pptx template office microsoft slides",
			"arg": "reference_pptx_path",
			"uid": "12",
			"subtitle": "currently: $reference_pptx_path"
		},
		{
			"title": "📊 Slide Level for Powerpoint",
			"match":"slide level for powerpoint presentation pptx",
			"arg": "slide_level",
			"uid": "13",
			"subtitle": "currently: $slide_level"
		},
		{
			"title": "✴️ Citation Picker",
			"match":"zotero citation picker alfred classic alternative",
			"arg": "citation_picker",
			"uid": "14",
			"subtitle": "currently: $citation_picker"
		},
		{
			"title": "📚 2️⃣ Additional Library (optional)",
			"arg": "second_library",
			"match":"additional second library bib bibtex references",
			"uid": "15",
			"subtitle": "currently: $second_library"
		},
		{
			"title": "❇️ Further Arguments",
			"match":"additional further more arguments options",
			"arg": "further_pandoc_args",
			"uid": "16",
			"subtitle": "currently: $further_pandoc_args"
		},
		{
			"title": "⚙️ Writer Extensions",
			"match":"extensions writer additional options",
			"arg": "writer_extensions",
			"uid": "17",
			"subtitle": "currently: $writer_extensions"
		},
		{
			"title": "⚙️ Reader Extensions",
			"match":"extensions reader additional options",
			"arg": "reader_extensions",
			"uid": "18",
			"subtitle": "currently: $reader_extensions"
		},
		{
			"title": "🚰 Pandoc Filter (used before --citeproc)",
			"match":"filter addtional options",
			"arg": "pandoc_filter",
			"uid": "19",
			"subtitle": "currently: $pandoc_filter"
		},
		{
			"title": "📄 Pandoc Template",
			"match":"tempaltes addtional options",
			"arg": "pandoc_template",
			"uid": "20",
			"subtitle": "currently: $pandoc_template"
		},
		{
			"title": "🔄 Debugging: Force Citation Picker Buffer Reload",
			"match":"debugging buffer citation picker reload cache reset bug force",
			"arg": "force_buffer_reload",
			"uid": "21",
			"subtitle": "Try this when the Alfred Citation Picker misbehaves"
		},
		{
			"title": "📧 Debugging: Report an Issue to the Developer",
			"match":"debugging email mail issue report bug help",
			"arg": "email",
			"uid": "22",
			"subtitle": "will open default mail client"
		},
		{
			"title": "🚀 Open Output File after Conversion",
			"match":"open output after conversion Finder reveal",
			"arg": "open_after",
			"uid": "23",
			"subtitle": "currently: $open_after"
		},
		{
			"title": "📄 OpenOffice Reference Document",
			"match":"writer openoffice office odt reference document template",
			"arg": "reference_odt_path",
			"uid": "24",
			"subtitle": "currently: $reference_odt"
		},
		{
			"title": "🔗 Link Citations to Bibliography & Bibliography to URLs",
			"match":"link autolink URL hyperlink citations bibliography",
			"arg": "link_citations_biblio",
			"uid": "25",
			"subtitle": "currently: $link_citations_biblio"
		}
	]
}

EOB
