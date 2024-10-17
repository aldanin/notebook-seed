/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';


declare class TextDecoder {
	decode(data: Uint8Array): string;
}

export function registerCommands(): vscode.Disposable {

	const subscriptions: vscode.Disposable[] = [];

	subscriptions.push(vscode.commands.registerCommand('github-issues.new', async () => {
		const newNotebook = await vscode.workspace.openNotebookDocument('github-issues', new vscode.NotebookData(
			[new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'repo:microsoft/vscode is:open', 'github-issues')]
		));
		await vscode.commands.executeCommand('vscode.openWith', newNotebook.uri, 'github-issues');
	}));
	subscriptions.push(vscode.commands.registerCommand('ad-list.new', async () => {
		const newNotebook = await vscode.workspace.openNotebookDocument('ad-list', new vscode.NotebookData(
			[new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'ad: open it', 'ad-list')]
		));
		await vscode.commands.executeCommand('vscode.openWith', newNotebook.uri, 'ad-list');
	}));



	return vscode.Disposable.from(...subscriptions);
}
