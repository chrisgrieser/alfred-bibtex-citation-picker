#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const citekey = argv.join("");
	const literatureNotePath = $.getenv("literature_note_folder")
		.replace(/^~/, app.pathTo("home folder"))
		+ "/" + citekey + ".md";

	// Create literature note
	const literatureNoteExists = Application("Finder").exists(Path(literatureNotePath));
	if (!literatureNoteExists) {
		// TODO: template functionality
		const template = "---\ntags: \naliases:\n---\n\n";
		app.doShellScript(`echo '${template}' > '${literatureNotePath}'`);
	}

	// open with Obsidian, if in Vault
	const obsidianJsonFilePath = app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.json";
	const vaults = JSON.parse(app.read(obsidianJsonFilePath)).vaults;
	const isFileInObsidianVault = Object.values(vaults).some(v => literatureNotePath.startsWith(v.path));

	if (isFileInObsidianVault) {
		Application("Obsidian").activate();
		// eslint-disable-next-line no-magic-numbers
		delay(0.3); // needed so Obsidian can pick up newly created file
		const URI = "obsidian://open?path=" + encodeURIComponent(literatureNotePath);
		app.openLocation(URI);
		return;
	}

	// open with default app, if not in vault
	app.doShellScript(`open '${literatureNotePath}'`);

}
