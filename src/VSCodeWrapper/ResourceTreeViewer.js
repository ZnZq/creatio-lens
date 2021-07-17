const vscode = require("vscode");
const path = require("path");
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
			item.contextValue = "resource";

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

		vscode.commands.registerCommand("resourceTreeViewer.refresh", () => {
			const editor = vscode.window.activeTextEditor;
			core.updateResourcesList(editor?.document?.uri?.fsPath);
		});

		vscode.commands.registerCommand("resourceTreeViewer.resourcesStrings", (item) => {
			var value = `Resources.Strings.${item.tooltip}`;
			vscode.env.clipboard.writeText(value);
			vscode.window.showInformationMessage(`Скопировано: ${value}`);
		});

		vscode.commands.registerCommand("resourceTreeViewer.localizableStrings", (item) => {
			var value = `resources.localizableStrings.${item.tooltip}`;
			vscode.env.clipboard.writeText(value);
			vscode.window.showInformationMessage(`Скопировано: ${value}`);
		});

		vscode.commands.registerCommand("resourceTreeViewer.connectionLocalizableStrings", (item) => {
			const editor = vscode.window.activeTextEditor;
			var filePath = editor?.document?.uri?.fsPath;
			var fileExt = path.extname(filePath);
			var fileName = path.basename(filePath, fileExt);

			var value = `UserConnection.GetLocalizableString("${fileName}", "${item.tooltip}")`;
			vscode.env.clipboard.writeText(value);
			vscode.window.showInformationMessage(`Скопировано: ${value}`);
		});

		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor?.document?.uri?.scheme === "file") {
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