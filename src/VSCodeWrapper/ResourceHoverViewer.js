const vscode = require('vscode');
const core = require("../../core/creatio-lens-core");

class ResourceHoverViewer {
	constructor() {
		vscode.languages.registerHoverProvider('javascript', {
			async provideHover(document, position, token) {
				if (document.languageId !== "javascript" || document.uri.scheme !== 'file') {
					return null;
				}

				var line = document.lineAt(position.line).text;
				var values = await core.getResourseValue({
					filePath: document.uri.fsPath,
					line: line
				});

				if (values) {
                    var hoverText = values.map(value => `${value.key}: ${value.value}`)
                        .join("  \n");
					return Promise.resolve(new vscode.Hover(hoverText));
				}

				return Promise.resolve(null);
			}
		});
	}
}

module.exports = {
    ResourceHoverViewer
};