const vscode = require('vscode');
const types = require("../../core/typedef");
const babelTypes = require("@babel/types");
const core = require("../../core/creatio-lens-core");
const helper = require("../../core/creatio-lens-helper");

class SchemaTreeItem extends vscode.TreeItem {
	/** @type {types.SchemaItem} */
	schemaItem = null;

	/**
	 * @param {types.SchemaItem} schemaItem
	 */
	constructor(schemaItem) {
		super(schemaItem.name, schemaItem.getHasChildren()
			? vscode.TreeItemCollapsibleState.Collapsed
			: vscode.TreeItemCollapsibleState.None);
		this.schemaItem = schemaItem;
		this.tooltip = schemaItem.tooltip;
		if (schemaItem.location) {
			this.command = {
				command: 'schemaTreeViewer.reveal',
				title: "Reveal",
				arguments: [schemaItem.location]
			};
		}

	}

	/** @returns {Array<SchemaTreeItem>} */
	getChildren() {
		if (this.schemaItem.getHasChildren()) {
			var children = this.schemaItem.getChildren();
			return children.map(child => new SchemaTreeItem(child));
		}

		return [];
	}
}

/** @implements {vscode.TreeDataProvider<SchemaTreeItem>} */
class SchemaTreeViewer {

	/**
	 * @param {vscode.ExtensionContext} context
	 */
	constructor(context) {
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;

		context.subscriptions.push(vscode.window.registerTreeDataProvider('SchemaTreeViewer', this));
		context.subscriptions.push(vscode.window.createTreeView('SchemaTreeViewer', {
			treeDataProvider: this
		}));

		vscode.commands.registerCommand('schemaTreeViewer.refresh', async () => {
			this.refresh();
		});

		vscode.commands.registerCommand('schemaTreeViewer.reveal', ( /** @type {babelTypes.SourceLocation} */ location) => {
			const editor = vscode.window.activeTextEditor;
			if (!editor || !location) {
				return;
			}

			var start = new vscode.Position(
				location.start.line - 1,
				location.start.column,
			);
			var end = new vscode.Position(
				location.end.line - 1,
				location.end.column,
			);

			editor.selection = new vscode.Selection(start, end);
			editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenter);
		});

		core.onAfterUpdateAST.subscribe(() => this.refresh());
	}

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	/**
	 * @param {SchemaTreeItem} element
	 */
	getTreeItem(element) {
		return element;
	}

	/**
	 * @param {SchemaTreeItem} element
	 */
	async getChildren(element) {
		if (!element) {
			var roots = await core.getSchemaTreeRoots();

			return roots.map(root => new SchemaTreeItem(types.create(root)));
		}

		if (element instanceof SchemaTreeItem) {
			return element.getChildren();
		}

		return null;
	}
}

module.exports = {
	SchemaTreeViewer
};