import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { StatusBar } from "./status-bar.js";
import { Transcript } from "./transcript.js";
import { CharInput } from "./char-input.js";
function GameScreen({ engine, terminal, styleOverrides, hideStatusBar, autoFocusInput = true }) {
  const { status, transcript, statusGrid, inputRequest, error, submitLine, submitChar } = engine;
  const inputRef = useRef(null);
  function handleContainerClick() {
    const selection = window.getSelection();
    if (selection !== null && !selection.isCollapsed) return;
    inputRef.current?.focus();
  }
  if (status === "error") {
    return /* @__PURE__ */ jsxs("div", { style: { padding: "16px", color: "#c00", fontFamily: "var(--if-font-family)" }, children: [
      "Error: ",
      error
    ] });
  }
  if (status === "loading") {
    return /* @__PURE__ */ jsx("div", { style: { padding: "16px", fontFamily: "var(--if-font-family)", opacity: 0.6 }, children: "Loading..." });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: handleContainerClick,
      style: { display: "flex", flexDirection: "column", height: "100%" },
      children: [
        !hideStatusBar && /* @__PURE__ */ jsx(StatusBar, { grid: statusGrid, rowHeightPx: terminal.rowHeightPx, styleOverrides }),
        /* @__PURE__ */ jsx(
          Transcript,
          {
            entries: transcript,
            inputRequest,
            onSubmitLine: submitLine,
            inputRef,
            styleOverrides,
            autoFocusInput
          }
        ),
        /* @__PURE__ */ jsx(CharInput, { active: inputRequest.kind === "char", onChar: submitChar }),
        status === "finished" && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              padding: "8px",
              fontFamily: "var(--if-font-family)",
              fontSize: "var(--if-font-size)",
              fontStyle: "italic",
              opacity: 0.6,
              borderTop: "1px solid #ccc"
            },
            children: "[Game finished]"
          }
        )
      ]
    }
  );
}
export {
  GameScreen
};
