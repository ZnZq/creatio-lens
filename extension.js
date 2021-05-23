const vscode = require('vscode');
const core = require('./core/creatio-lens-core');
const { CompleteViewer } = require('./src/VSCodeWrapper/CompleteViewer');
const { ConstantHighlight } = require('./src/VSCodeWrapper/ConstantHighlight');
const { ResourceHoverViewer } = require('./src/VSCodeWrapper/ResourceHoverViewer');
const { SchemaTreeViewer } = require('./src/VSCodeWrapper/SchemaTreeViewer');
const { UpdateDescriptor } = require('./src/VSCodeWrapper/UpdateDescriptor');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	console.log('Congratulations, your extension "creatio-lens" is now active!');
	await core.activate();
	core.onError.subscribe(error => vscode.window.showErrorMessage(error.toString()));

	new ResourceHoverViewer();
	new UpdateDescriptor();
	new SchemaTreeViewer(context);
	new ConstantHighlight();
	new CompleteViewer(context);

	await initUpdateAST(context);
}

function deactivate() {
	core.deactivate();
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function initUpdateAST(context) {
	const editor = vscode.window.activeTextEditor;
	var isValid = editor?.document?.languageId === "javascript";

	if (isValid) {
		await core.updateAST(editor.document.uri.fsPath, editor.document.getText());
	}

	vscode.workspace.onDidChangeTextDocument(async event => {
		if (event.contentChanges.length === 0) {
			return;
		}

		const activeEditor = vscode.window.activeTextEditor;
		const isValid = activeEditor
			&& event.document === activeEditor.document
			&& event.document.languageId === "javascript";

		if (isValid) {
			return await core.updateAST(event.document.uri.fsPath, event.document.getText());
		}

		await core.updateAST(null, null);
	}, null, context.subscriptions);

	vscode.window.onDidChangeActiveTextEditor(async editor => {
		var isValid = editor?.document?.languageId === "javascript";

		if (isValid) {
			return await core.updateAST(editor.document.uri.fsPath, editor.document.getText());
		}

		await core.updateAST(null, null);
	}, null, context.subscriptions);
}

module.exports = {
	activate,
	deactivate
}