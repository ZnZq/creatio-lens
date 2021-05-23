const vscode = require('vscode');
const core = require('./core/creatio-lens-core');
const { ConstantHighlight } = require('./src/VSCodeWrapper/ConstantHighlight');
const { ResourceHoverViewer } = require('./src/VSCodeWrapper/ResourceHoverViewer');
const { SchemaTreeViewer } = require('./src/VSCodeWrapper/SchemaTreeViewer');
const { UpdateDescriptor } = require('./src/VSCodeWrapper/UpdateDescriptor');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "creatio-lens" is now active!');
	core.activate();
	core.onError.subscribe(error => vscode.window.showErrorMessage(error.toString()));

	new ResourceHoverViewer();
	new UpdateDescriptor();
	new SchemaTreeViewer(context);
	new ConstantHighlight();

	initUpdateAST(context);
}

function deactivate() {
	core.deactivate();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function initUpdateAST(context) {
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
			return;
		}

		core.updateAST(null, null);
	}, null, context.subscriptions);
}

module.exports = {
	activate,
	deactivate
}