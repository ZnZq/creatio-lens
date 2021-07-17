const vscode = require("vscode");
const types = require("../../core/typedef");
const babelTypes = require("@babel/types");
const core = require("../../core/creatio-lens-core");
const helper = require("../../core/creatio-lens-helper");

class RegionTreeItem extends vscode.TreeItem {
	/** @type {types.Region} */
	region = null;

	/**
	 * @param {types.Region} region
	 */
	constructor(region) {
		super(region.name, region.children.length > 0
			? vscode.TreeItemCollapsibleState.Collapsed
			: vscode.TreeItemCollapsibleState.None);
		this.region = region;
		if (region.location) {
			this.command = {
				command: "RegionTreeViewer.reveal",
				title: "Reveal",
				arguments: [region.location]
			};
		}

	}

	/** @returns {Array<RegionTreeItem>} */
	getChildren() {
		if (this.region.children.length > 0) {
			return this.region.children.map(child => new RegionTreeItem(child));
		}

		return [];
	}
}

/** @implements {vscode.TreeDataProvider<RegionTreeItem>} */
class RegionTreeViewer {

	/** @type {NodeJS.Timeout} */
	timeout = null;

	/**
	 * @param {vscode.ExtensionContext} context
	 */
	constructor(context) {
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;

		context.subscriptions.push(vscode.window.registerTreeDataProvider("RegionTreeViewer", this));
		context.subscriptions.push(vscode.window.createTreeView("RegionTreeViewer", {
			treeDataProvider: this
		}));

		vscode.commands.registerCommand("RegionTreeViewer.refresh", async () => {
			this.refresh();
		});

		vscode.commands.registerCommand("RegionTreeViewer.reveal", ( /** @type {babelTypes.SourceLocation} */ location) => {
			const editor = vscode.window.activeTextEditor;
			if (!editor || !location) {
				return;
			}

			var start = new vscode.Position(
				location.start.line - 1, location.start.column,
			);
			var end = new vscode.Position(
				location.end.line - 1, location.end.column,
			);

			editor.selection = new vscode.Selection(start, end);
			editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
		});

		core.onAfterUpdateAST.subscribe(() => this.refresh());
	}

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	/**
	 * @param {RegionTreeItem} element
	 */
	getTreeItem(element) {
		return element;
	}

	/**
	 * @param {RegionTreeItem} element
	 */
	async getChildren(element) {
		if (!element) {
			var regions = await core.getRegions();

			return regions.map(region => new RegionTreeItem(region));
		}

		if (element instanceof RegionTreeItem) {
			return element.getChildren();
		}

		return null;
	}
}

module.exports = {
	RegionTreeViewer
};