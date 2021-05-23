const vscode = require('vscode');
const core = require("../../core/creatio-lens-core");
const types = require("../../core/typedef");

class ConstantHighlight {
    /** @type {Array<vscode.TextEditorDecorationType>} */
	decorations = [];

	constructor() {
        core.onBeforeUpdateAST.subscribe(_ => this.clearDecorations());
        core.onAfterUpdateAST.subscribe(_ => this.draw());
	}

    async draw() {
        const highlights = await core.getConstantHighlights()
        if (!highlights) {
            return;
        }

        highlights.forEach(highlight => this.addDecorationWithText(highlight));
    }

	/**
	 * @param {types.Highlight} highlight
	 */
	addDecorationWithText(highlight) {
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
		this.decorations.splice(0, this.decorations.length);
	}
}

module.exports = {
	ConstantHighlight
};