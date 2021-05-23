const vscode = require('vscode');
const core = require('./core/creatio-lens-core');
const { ResourceHoverViewer } = require('./src/VSCodeWrapper/ResourceHoverViewer');
const { SchemaTreeViewer } = require('./src/VSCodeWrapper/SchemaTreeViewer');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	await core.activate();

	console.log('Congratulations, your extension "creatio-lens" is now active!');

	const editor = vscode.window.activeTextEditor;
	var isValid = editor?.document?.languageId === "javascript";

	if (isValid) {
		core.updateAST(editor.document.uri.fsPath, editor.document.getText());
	}

	vscode.workspace.onDidChangeTextDocument(event => {
		if (event.contentChanges.length === 0) {
			return;
		}

		const activeEditor = vscode.window.activeTextEditor;
		const isValid = activeEditor
			&& event.document === activeEditor.document
			&& event.document.languageId === "javascript";

		if (isValid) {
			core.updateAST(event.document.uri.fsPath, event.document.getText());
		}

		core.updateAST(null, null);
	}, null, context.subscriptions);

	vscode.window.onDidChangeActiveTextEditor(editor => {
		var isValid = editor?.document?.languageId === "javascript";

		if (isValid) {
			core.updateAST(editor.document.uri.fsPath, editor.document.getText());
		}

		core.updateAST(null, null);
	}, null, context.subscriptions);

	new ResourceHoverViewer();
	new SchemaTreeViewer(context);
}

async function deactivate() {
	await core.deactivate();
}

module.exports = {
	activate,
	deactivate
}