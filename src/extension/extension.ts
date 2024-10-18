/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MyNotebookSerializer } from './parser/serializers/serializer';
import { SeedKernel } from './seed-kernel';
import { CODE_CELL_PLACEHOLDER } from '../common/seed.model';
import { NotebookDocumentContentChange } from 'vscode';
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer(
			"seed-notebook",
			new MyNotebookSerializer()
		)
	);

	context.subscriptions.push(new SeedKernel());

	context.subscriptions.push(
		vscode.commands.registerCommand("seed-items:new", async () => {
			const newNotebook = await vscode.workspace.openNotebookDocument(
				"seed-notebook",
				new vscode.NotebookData([
					new vscode.NotebookCellData(
						vscode.NotebookCellKind.Markup,
						"## Enter a seed user",
						"markdown"
					),
					new vscode.NotebookCellData(
						vscode.NotebookCellKind.Code,
						CODE_CELL_PLACEHOLDER, // Each code cell will have a place holder
						"plaintext"
					),
				])
			);
			await vscode.commands.executeCommand(
				"vscode.openWith",
				newNotebook.uri,
				"seed-notebook"
			);
		})
	);

	// Add the place holder for each new code cell:
	vscode.workspace.onDidChangeNotebookDocument((event: vscode.NotebookDocumentChangeEvent) => {
		event.contentChanges.forEach((change: NotebookDocumentContentChange) => {
			change.addedCells.forEach(async (cell) => {
				if (cell.kind === vscode.NotebookCellKind.Code && cell.document.getText() === '') {
					// Add placeholder content if the new cell is a code cell and is empty
					const edit = new vscode.WorkspaceEdit();
					edit.replace(cell.document.uri, new vscode.Range(0, 0, 0, 0), CODE_CELL_PLACEHOLDER);
					await vscode.workspace.applyEdit(edit);
				}
			});
		});
	});
}
