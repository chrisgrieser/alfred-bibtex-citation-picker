#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//───────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const citekey = argv.join("");
	const literatureNotePath =
		$.getenv("literature_note_folder").replace(/^~/, app.pathTo("home folder")) +
		`/${citekey}.md`;
	const literatureNoteExists = Application("Finder").exists(Path(literatureNotePath));

	// Create literature note
	if (!literatureNoteExists) {
		const template = "---\ntags: \naliases:\n---\n\n";
		app.doShellScript(`echo '${template}' > '${literatureNotePath}'`);
	}

	// open with Obsidian, if in Vault
	const obsidianJsonFilePath =
		app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.json";
	const vaults = JSON.parse(app.read(obsidianJsonFilePath)).vaults;
	const isFileInObsidianVault = Object.values(vaults).some((v) =>
		// lowercase comparison, since macOS filesystem is case-insensitive
		literatureNotePath.toLowerCase().startsWith(v.path.toLowerCase()),
	);

	if (isFileInObsidianVault) {
		Application("Obsidian").activate();
		delay(0.3); // needed so Obsidian can pick up newly created file
		const uri = "obsidian://open?path=" + encodeURIComponent(literatureNotePath);
		app.openLocation(uri);
		return;
	}

	// open with default app, if not in vault
	app.doShellScript(`open '${literatureNotePath}'`);
}
