#!/bin/zsh
cat << EOB
{
	"items": [
		{
			"title": "🚪 Exit this Configuration",
			"match":"exit leave quit cancel",
			"arg": "exit"
		},
		{
			"title": "❓ Documentation & Guide for the Pandoc-Suite",
			"arg": "workflow_documentation",
			"match":"help documentation usage guide",
			"subtitle": "Troubleshooting & further Information"
		},
		{
			"title": "❓ Pandoc Documentation",
			"arg": "man_pandoc",
			"match":"help documentation usage guide manual",
			"subtitle": "open man page in Preview.app"
		},
		{
			"title": "🆕 ✍️ Search & Select Citation Style",
			"arg": "csl_file",
			"match":"citation style csl",
			"subtitle": "currently: $csl_file"
		},
		{
			"title": "📚 1️⃣ BibTeX Library",
			"arg": "bibtex_library_path",
			"match":"bib bibtex library references",
			"subtitle": "currently: $bibtex_library_path"
		},
		{
			"title": "📚 🤿 Debugging: Deep Search Library File",
			"arg": "hard_bib_search",
			"match":"bib bibtex library references",
			"subtitle": "Select this if your BibTex Library cannot be found with the option above"
		},
		{
			"title": "📇 Set Resource Path subfolder",
			"match":"resource path ressource images attachments",
			"arg": "resource_path_subfolder",
			"subtitle": "currently: $resource_path_subfolder"
		},
		{
			"title": "🔘 Hotkey Output Format",
			"match":"hotkey output format docx html pdf pptx",
			"arg": "hotkey_output_format",
			"subtitle": "currently: $hotkey_output_format"
		},
		{
			"title": "📅 Date to Add (filename & content)",
			"match":"date format filename add insert american",
			"arg": "date_to_append",
			"subtitle": "currently: $date_to_append"
		},
		{
			"title": "📄 Word Reference Document",
			"match":"word docx reference document",
			"arg": "reference_docx",
			"subtitle": "currently: $reference_docx_path"
		},
		{
			"title": "🏎 PDF-Engine",
			"match":"pdf-engine pdf engine pdflatex wkhtmltopdf groff",
			"arg": "pdf_engine",
			"subtitle": "currently: $pdf_engine"
		},
		{
			"title": "🧑‍🏫 Powerpoint Reference Presentation",
			"match":"reference powerpoint presentation pptx",
			"arg": "reference_pptx",
			"subtitle": "currently: $reference_pptx_path"
		},
		{
			"title": "📊 Slide Level for Powerpoint",
			"match":"slide level for powerpoint presentation pptx",
			"arg": "slide_level",
			"subtitle": "currently: $slide_level"
		},
		{
			"title": "✴️ Citation Picker",
			"match":"zotero citation picker alfred classic alternative",
			"arg": "citation_picker",
			"subtitle": "currently: $citation_picker"
		},
		{
			"title": "📚 2️⃣ Additional Library (optional)",
			"arg": "second_library",
			"match":"additional second library bib bibtex references",
			"subtitle": "currently: $second_library"
		},
		{
			"title": "❇️ Further Arguments",
			"match":"additional further more arguments options",
			"arg": "further_pandoc_args",
			"subtitle": "currently: $further_pandoc_args"
		},
		{
			"title": "⚙️ Writer Extensions",
			"match":"extensions writer addtional options",
			"arg": "writer_extensions",
			"subtitle": "currently: $writer_extensions"
		},
		{
			"title": "⚙️ Reader Extensions",
			"match":"extensions reader addtional options",
			"arg": "reader_extensions",
			"subtitle": "currently: $reader_extensions"
		},
		{
			"title": "🚰 Pandoc Filter (used before --citeproc)",
			"match":"filter addtional options",
			"arg": "pandoc_filter",
			"subtitle": "currently: $pandoc_filter"
		},
		{
			"title": "📄 Pandoc Template",
			"match":"tempaltes addtional options",
			"arg": "pandoc_template",
			"subtitle": "currently: $pandoc_template"
		},
		{
			"title": "🔄 Debugging: Force Citation Picker Buffer Reload",
			"match":"debugging buffer citation picker reload cache reset bug",
			"arg": "force_buffer_reload",
			"subtitle": "afterwards, launches BibTeX citation picker"
		},
		{
			"title": "📧 Debugging: Report an Issue to the Developer",
			"match":"debugging email mail issue report bug help",
			"arg": "email",
			"subtitle": "will open your default mail client"
		}
	]
}

EOB