import vscode, { NotebookCellKind } from "vscode";

export class MyNotebookSerializer implements vscode.NotebookSerializer {
  async deserializeNotebook(
    content: Uint8Array,
    _token: vscode.CancellationToken
  ): Promise<vscode.NotebookData> {
    const text = new TextDecoder().decode(content);
    const data = text ? JSON.parse(text) : undefined;

    const cells =
      data?.cells?.map((cell: any) => {
        const cellData = new vscode.NotebookCellData(
          cell.kind,
          cell.value,
          cell.language
        );

        // Deserialize outputs
        if (cell.outputs) {
          cellData.outputs = cell.outputs.map(
            (output: any) =>
              new vscode.NotebookCellOutput(
                output.items.map(
                  (item: any) =>
                    new vscode.NotebookCellOutputItem(
                      Uint8Array.from(atob(item.data), (c) => c.charCodeAt(0)), // Properly decode base64 back to Uint8Array
                      item.mime
                    )
                )
              )
          );
        }

        return cellData;
      }) ?? [];

    return new vscode.NotebookData(cells);
  }

  async serializeNotebook(
    data: vscode.NotebookData,
    _token: vscode.CancellationToken
  ): Promise<Uint8Array> {
    const notebookContent = {
      cells: data.cells.map((cell) => ({
        kind: cell.kind,
        value: cell.value,
        language: cell.languageId,
        outputs: cell.outputs?.map((output) => ({
          items: output.items.map((item) => {
            let text;
            try {
              const decoder = new TextDecoder('utf-8');
              text = decoder.decode(new Uint8Array(item.data));
            } catch (err) {
              console.log(err);
            }

            return {
              mime: item.mime,
              data: utf8ToBase64(text as string), // Properly convert Uint8Array to base64
            };
          }),
        })),
      })),
    };

    const content = new TextEncoder().encode(JSON.stringify(notebookContent));
    return content;
  }
}

function utf8ToBase64(str: string) {
  return btoa(
    new Uint8Array(new TextEncoder().encode(str))
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

export class MyNotebookSerializer__ implements vscode.NotebookSerializer {
  deserializeNotebook(
    content: Uint8Array,
    // token: vscode.CancellationToken
  ): vscode.NotebookData | Promise<vscode.NotebookData> {
    const text = new TextDecoder().decode(content);
    const notebookData: vscode.NotebookData = new vscode.NotebookData([
      {
        value: text,
        kind: NotebookCellKind.Code,
        outputs: [],
        languageId: "json",
      },
    ]);

    return notebookData;
  }
  serializeNotebook(
    data: vscode.NotebookData,
    // token: vscode.CancellationToken
  ): Uint8Array | Promise<Uint8Array> {
    let text = "";
    data?.cells.forEach((cell: vscode.NotebookCellData) => {
      const outputs = cell.outputs;
      text = text.concat(cell.value);
    });

    return new TextEncoder().encode(text);
  }
}
