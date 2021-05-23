const vscode = require('vscode');
const core = require("../../core/creatio-lens-core");
const { Terrasoft } = require("../../core/creatio-lens-data");

class CompleteViewer {

    /**
     * @param {vscode.ExtensionContext} context
     */
    constructor(context) {
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider("javascript", {
            provideCompletionItems(document, position, token) {
                const line = document.lineAt(position).text;
                const linePrefix = line.substr(0, position.character);
    
                var items = [
                    ...core.completionItems("Terrasoft.DataValueType.", linePrefix, Terrasoft.DataValueType),
                    ...core.completionItems("Terrasoft.ComparisonType.", linePrefix, Terrasoft.ComparisonType),
                    ...core.completionItems("Terrasoft.ViewItemType.", linePrefix, Terrasoft.ViewItemType),
                    ...core.completionItems("Terrasoft.ViewModelColumnType.", linePrefix, Terrasoft.ViewModelColumnType),
                ];
    
                return items.map(value => new vscode.CompletionItem(value));
            }
        }, '.'));
    }
}

module.exports = {
    CompleteViewer
}