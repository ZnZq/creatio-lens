const vscode = require("vscode");
const core = require("./core/creatio-lens-core");
const { ConstantHighlight } = require("./src/VSCodeWrapper/ConstantHighlight");
const { ResourceHoverViewer } = require("./src/VSCodeWrapper/ResourceHoverViewer");
const { SchemaTreeViewer } = require("./src/VSCodeWrapper/SchemaTreeViewer");
const { ResourceTreeViewer } = require("./src/VSCodeWrapper/ResourceTreeViewer");
const { RegionTreeViewer } = require("./src/VSCodeWrapper/RegionTreeViewer");
const { UpdateDescriptor } = require("./src/VSCodeWrapper/UpdateDescriptor");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	console.log("Congratulations, extension \"creatio-lens\" is now active!");
	await core.activate();
	initConfiguration(context);
	core.onError.subscribe(error => {
		vscode.window.showErrorMessage(error.toString());
		console.error(error);
	});

	new ResourceHoverViewer();
	new UpdateDescriptor();
	new SchemaTreeViewer(context);
	new ResourceTreeViewer(context);
	new RegionTreeViewer(context);
	new ConstantHighlight();

	await initUpdate(context);
}

function deactivate() {
	core.deactivate();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function initConfiguration(context) {
	function applyConfiguration() {
		let configuration = vscode.workspace.getConfiguration('creatio-lens');

		core.resetConfig();
		core.applyConfig({
			descriptor: configuration.descriptor,
			schema: configuration.schema,
			highlight: configuration.highlight,
			resource: configuration.resource,
			region: configuration.region
		});
	}

	applyConfiguration();

	vscode.workspace.onDidChangeConfiguration(async event => {
		if (event.affectsConfiguration('creatio-lens')) {
			applyConfiguration();
		}
	}, null, context.subscriptions);
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function initUpdate(context) {
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