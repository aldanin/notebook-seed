export function getStyleTag(css: string) {
	const style = document.createElement("style");
	style.type = "text/css";
	style.textContent = css;

	return style;
}