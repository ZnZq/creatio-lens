const vscode = require("vscode");
const types = require("../../core/typedef");
const babelTypes = require("@babel/types");
const core = require("../../core/creatio-lens-core");
const helper = require("../../core/creatio-lens-helper");
const _ = require("underscore");

class ResourceTreeItem extends vscode.TreeItem {
	/** @type {Object.<string, string>} */
	resources = null;

	/**
	 * @param {Object.<string, string>} resources 
	 * @param {string} culture 
	 */
	constructor(resources, culture) {
		super(culture, vscode.TreeItemCollapsibleState.Collapsed);
		this.resources = resources;
		this.tooltip = culture;
	}

	/** @returns {Array<vscode.TreeItem>} */
	getChildren() {
		return _.map(this.resources, (value, key) => {
			var item = new vscode.TreeItem(value);
			item.tooltip = key;

			return item;
		});
	}
}

/** @implements {vscode.TreeDataProvider<vscode.TreeItem>} */
class ResourceTreeViewer {

	/** @type {NodeJS.Timeout} */
	timeout = null;

	/** @type {types.Resource} */
	resources = null;

	/**
	 * @param {vscode.ExtensionContext} context
	 */
	constructor(context) {
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;

		context.subscriptions.push(vscode.window.registerTreeDataProvider("ResourceTreeViewer", this));
		context.subscriptions.push(vscode.window.createTreeView("ResourceTreeViewer", {
			treeDataProvider: this
		}));

		vscode.commands.registerCommand("resourceTreeViewer.refresh", async () => {
			this.refresh();
		});

		vscode.window.onDidChangeActiveTextEditor(editor => {
			var isValid = editor?.document?.languageId === "javascript";
			if (isValid) {
				core.updateResourcesList(editor.document.uri.fsPath);
				return;
			}
	
			core.updateResourcesList(null);
		}, null, context.subscriptions);

		core.onResourcesUpdated.subscribe(resources => this.refresh(resources));

		const editor = vscode.window.activeTextEditor;
		core.updateResourcesList(editor?.document?.uri?.fsPath);
	}

	refresh(resources) {
		this.resources = resources;
		this._onDidChangeTreeData.fire();
	}

	/**
	 * @param {ResourceTreeItem} element
	 */
	getTreeItem(element) {
		return element;
	}

	/**
	 * @param {ResourceTreeItem} element
	 */
	getChildren(element) {
		if (!element) {
			if (!this.resources) {
				return null;
			}

			return _.map(this.resources.cultures, (value, key) => new ResourceTreeItem(value, key));
		}

		if (element instanceof ResourceTreeItem) {
			return element.getChildren();
		}

		return null;
	}
}

module.exports = {
	ResourceTreeViewer
};