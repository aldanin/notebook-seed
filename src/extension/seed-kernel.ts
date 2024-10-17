process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import vscode from "vscode";
import { CODE_CELL_PLACEHOLDER } from "../common/seed.model";

export class SeedKernel {
  private _controller;

  constructor() {
    this._controller = vscode.notebooks.createNotebookController(
      "seed-notebook-controller",
      "seed-notebook",
      "seed Notebook Controller"
    );

    this._controller.executeHandler = async (cells, _notebook, _controller) => {
      for (const cell of cells) {
        const execution = this._controller.createNotebookCellExecution(cell);
        execution.start(Date.now());
        // For demonstration only - add the cell text to the mock object:
        const text = (<string>cell.document.getText()).replace(
          CODE_CELL_PLACEHOLDER,
          ""
        );

        try {
          execution.replaceOutput([
            // The cell output's content, passed for mthe final stage - displaying
            new vscode.NotebookCellOutput([
              vscode.NotebookCellOutputItem.json(
                [
                  {
                    title: text,
                  },
                ],
                "x-application/seed-output"
              ),
            ]),
          ]);
        } catch (error) {
          console.error("Error fetching data", error);
        }

        execution.end(true, Date.now());
      }
    };
  }

  dispose() {
    this._controller.dispose();
  }
}
