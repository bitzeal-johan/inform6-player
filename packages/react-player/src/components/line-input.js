import { jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
const LineInput = React.forwardRef(
  function LineInput2({ onSubmit }, ref) {
    const [value, setValue] = useState("");
    useEffect(() => {
      if (typeof ref === "function") return;
      ref?.current?.focus();
    }, [ref]);
    function handleSubmit(e) {
      e.preventDefault();
      const trimmed = value.trimEnd();
      setValue("");
      onSubmit(trimmed);
    }
    return /* @__PURE__ */ jsx(
      "form",
      {
        onSubmit: handleSubmit,
        style: {
          display: "inline-flex",
          flex: 1,
          minWidth: 0,
          width: "80%"
        },
        children: /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            type: "text",
            value,
            onChange: (e) => setValue(e.target.value),
            autoComplete: "off",
            spellCheck: false,
            style: {
              fontFamily: "var(--if-font-family)",
              fontSize: "var(--if-font-size)",
              lineHeight: "var(--if-line-height)",
              border: "none",
              outline: "none",
              padding: 0,
              background: "transparent",
              color: "inherit",
              width: "100%"
            }
          }
        )
      }
    );
  }
);
export {
  LineInput
};
