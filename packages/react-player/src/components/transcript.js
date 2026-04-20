import { jsx, jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { styleToCss, composeStyles } from "../util/style-css.js";
import { LineInput } from "./line-input.js";
const INPUT_OVERLAY = {
  bold: true,
  underline: false,
  reverse: false,
  fixed: false
};
function Transcript({
  entries,
  inputRequest,
  onSubmitLine,
  inputRef,
  styleOverrides,
  autoFocusInput = true
}) {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        flex: 1,
        overflowY: "auto",
        fontFamily: "var(--if-font-family)",
        fontSize: "var(--if-font-size)",
        lineHeight: "var(--if-line-height)",
        padding: "8px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      },
      children: [
        entries.map((entry, entryIdx) => {
          if (entry.kind === "input") {
            return /* @__PURE__ */ jsxs(React.Fragment, { children: [
              entry.runs.map((run, runIdx) => /* @__PURE__ */ jsx("span", { style: styleToCss(composeStyles(run.style, INPUT_OVERLAY), styleOverrides), children: run.text }, runIdx)),
              "\n"
            ] }, entryIdx);
          }
          return /* @__PURE__ */ jsx(React.Fragment, { children: entry.runs.map((run, runIdx) => /* @__PURE__ */ jsx("span", { style: styleToCss(run.style, styleOverrides), children: run.text }, runIdx)) }, entryIdx);
        }),
        inputRequest.kind === "line" && /* @__PURE__ */ jsx(LineInput, { ref: inputRef, onSubmit: onSubmitLine, autoFocus: autoFocusInput }),
        inputRequest.kind === "char" && /* @__PURE__ */ jsx("span", { style: { fontStyle: "italic", opacity: 0.7 }, children: "(press any key)" }),
        /* @__PURE__ */ jsx("div", { ref: bottomRef })
      ]
    }
  );
}
export {
  Transcript
};
