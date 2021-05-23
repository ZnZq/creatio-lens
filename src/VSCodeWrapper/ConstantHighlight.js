const vscode = require("vscode");
const core = require("../../core/creatio-lens-core");
const types = require("../../core/typedef");
const _ = require("underscore");

class ConstantHighlight {
	/** @type {Array<vscode.TextEditorDecorationType>} */
	decorations = [];

	/** @type {Array<types.Highlight>} */
	highlights = [];

	/** @type {Array<vscode.Range>} */
	ranges = [];

	/** @type {NodeJS.Timeout} */
	timeout = null;

	constructor() {
		core.onAfterUpdateAST.subscribe(_ => this.updateHighlights());

		vscode.window.onDidChangeTextEditorVisibleRanges(event => {
			this.ranges = [...event.visibleRanges];
			this.draw();
		});

		this.ranges = [...vscode.window.activeTextEditor.visibleRanges];
		this.draw();
	}

	draw() {
		const hasRange = this.ranges?.length > 0;
		if (!hasRange || this.highlights.length === 0) {
			return;
		}

		const highlights = this.highlights.filter(highlight => {
			return !highlight.props.draweed && _.any(this.ranges, range => {
				const startLine = range.start.line - 10;
				const endLine = range.end.line + 10;

				return startLine <= highlight.location.line && highlight.location.line <= endLine;
			});
		});

		highlights.forEach(highlight => this.addDecorationWithText(highlight));
	}

	async updateHighlights() {
		this.clearDecorations();
		this.highlights = await core.getConstantHighlights() || [];
		this.draw();
	}

	/**
	 * @param {types.Highlight} highlight
	 */
	addDecorationWithText(highlight) {
		if (highlight.props.draweed) {
			return;
		}
		highlight.props.draweed = true;

		const activeTextEditor = vscode.window.activeTextEditor;

		if (!activeTextEditor || !highlight.name) {
			return;
		}

		const decorationType = vscode.window.createTextEditorDecorationType({
			after: {
				contentText: highlight.name,
				margin: "15px",
				color: "#757575"
			}
		});

		const range = new vscode.Range(
			new vscode.Position(highlight.location.line - 1, highlight.location.column + 1),
			new vscode.Position(highlight.location.line - 1, highlight.location.column + 1)
		);

		activeTextEditor.setDecorations(decorationType, [{ range }]);
		this.decorations.push(decorationType);
	};

	clearDecorations() {
		this.decorations.forEach(decoration => decoration.dispose());
		this.decorations = [];
	}
}

module.exports = {
	ConstantHighlight
};