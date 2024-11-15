import type {
  OutputItem,
  RendererApi,
  RendererContext,
} from "vscode-notebook-renderer";
import { SeedItem } from "./seed.model";


interface IRenderInfo {
  container: HTMLElement;
  mime?: string;
  value: SeedItem[];
  context: RendererContext<unknown>;
}

export function activate(context: RendererContext<void>): RendererApi {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './renderer.css';
  document.head.appendChild(link);
  return {
    renderOutputItem(output: OutputItem, element: HTMLElement) {
      const items: SeedItem[] = output.json();
      render({ container: element, value: items, context });
    },
  };
}

export function render({ container, value: items }: IRenderInfo) {
  const pre = document.createElement("pre");

  const codeDiv = document.createElement("div");
  items.forEach((item) => {
    const spanDiv = document.createElement("div");
    const span: HTMLSpanElement = document.createElement("span");
    span.innerText = `Hello, ${item.title}`;
    span.style.color = "#5ab2ff";
    span.style.fontSize = "16px";
    span.className = "item-row";

    spanDiv.appendChild(span);

    codeDiv.append(spanDiv);
  });
  pre.appendChild(codeDiv);
  container.appendChild(pre);
}
