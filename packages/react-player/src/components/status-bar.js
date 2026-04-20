import { jsx } from "react/jsx-runtime";
import { styleToCss, coalesceCells } from "../util/style-css.js";
function StatusBar({ grid, rowHeightPx, styleOverrides }) {
  if (grid.lines === 0) return null;
  const height = grid.lines * rowHeightPx;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        height: `${height}px`,
        overflow: "hidden",
        fontFamily: "var(--if-font-family)",
        fontSize: "var(--if-font-size)",
        lineHeight: "var(--if-line-height)",
        backgroundColor: "#000",
        color: "#fff",
        padding: "0 4px",
        boxSizing: "border-box",
        // Inside the status bar, `reverse` should produce the traditional
        // "inverted bar" look, which here means white-on-black (the bar's
        // own base colours are already black-on-white-inverted: black bg,
        // white fg). Override the shared `--if-fg`/`--if-bg` inside the
        // bar so reverse runs read as black-text-on-white-background,
        // matching Lectrote/Zoom/Frotz.
        "--if-fg": "#fff",
        "--if-bg": "#000"
      },
      children: grid.cells.map((row, rowIdx) => /* @__PURE__ */ jsx("div", { style: { whiteSpace: "pre", height: `${rowHeightPx}px` }, children: coalesceCells(row).map((run, runIdx) => /* @__PURE__ */ jsx("span", { style: styleToCss(run.style, styleOverrides), children: run.text }, runIdx)) }, rowIdx))
    }
  );
}
export {
  StatusBar
};
