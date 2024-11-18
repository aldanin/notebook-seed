import type {
  OutputItem,
  RendererApi,
  RendererContext,
} from "vscode-notebook-renderer";
import { getStyleTag } from "../common/renderers.helpers";
import rendererCss from "./renderer.css";
import { SeedItem } from "./seed.model";

const css = rendererCss;
interface IRenderInfo {
  container: HTMLElement;
  mime?: string;
  value: SeedItem[];
  context: RendererContext<unknown>;
}

export function activate(context: RendererContext<void>): RendererApi {
  return {
    renderOutputItem(output: OutputItem, element: HTMLElement) {
      let shadow = element.shadowRoot;
      if (!shadow) {
        shadow = element.attachShadow({ mode: "open" });

        shadow.append(getStyleTag(css).cloneNode(true));

        const root = document.createElement("div");
        root.id = "root";
        shadow.append(root);
      }

      const items: SeedItem[] = output.json();
      render({
        container: shadow.querySelector("#root")!,
        value: items,
        context,
      });
    },
  };
}

export function render({ container, value: items }: IRenderInfo) {
  const pre = document.createElement("pre");

  const codeDiv = document.createElement("div");
  items.forEach((item) => {
    const spanDiv = document.createElement("div");
    spanDiv.className = "item-row";

    const span1: HTMLSpanElement = document.createElement("span");
    span1.innerText = `Hello, `;
    span1.className = `item-row-caption`;

    const span2: HTMLSpanElement = document.createElement("span");
    span2.innerText = item.title;
    span2.className = `item-row-title`;

    spanDiv.appendChild(span1);
    spanDiv.appendChild(span2);

    codeDiv.append(spanDiv);
  });
  pre.appendChild(codeDiv);
  container.appendChild(pre);
}
