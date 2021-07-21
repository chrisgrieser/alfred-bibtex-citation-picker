#!/usr/bin/env osascript -l JavaScript
function run(){

ObjC.import('stdlib');
app = Application.currentApplication();
app.includeStandardAdditions = true;

return app.doShellScript('cat "' + $.getenv('alfred_workflow_data') + '/buffer.json" ');
}
