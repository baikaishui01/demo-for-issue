import * as vscode from 'vscode';
import ViewLoader from './view/loader';

export function activate(context: vscode.ExtensionContext) {

	const showCommand = vscode.commands.registerCommand('issueDemo.showLint', () => {
		ViewLoader.showWebview(context);
	});

	context.subscriptions.push(showCommand);
}
export function deactivate() {}