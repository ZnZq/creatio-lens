const vscode = require("vscode");
const core = require("../../core/creatio-lens-core");

class UpdateDescriptor {
	constructor() {
		vscode.workspace.onDidSaveTextDocument(function(document) {
			if (document.uri.scheme === "file") {
				core.updateDescriptor(document.uri.fsPath);
			}
		});
	}
}

module.exports = {
	UpdateDescriptor
};