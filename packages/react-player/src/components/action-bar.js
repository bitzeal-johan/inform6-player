import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from "react";
import {
  deriveGameViewModel
} from "@inform6sharp/game-runner";
const UI_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const baseStyle = {
  fontFamily: UI_FONT,
  fontSize: "14px",
  lineHeight: "1.4",
  padding: "8px 14px",
  backgroundColor: "#555",
  color: "#ccc",
  border: "1px solid #666",
  borderRadius: "6px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  textAlign: "center",
  minHeight: "44px"
};
const buttonStyle = {
  ...baseStyle,
  flex: "1 1 auto",
  maxWidth: "120px",
  minWidth: "44px"
};
const compactButtonStyle = {
  ...baseStyle,
  flex: "0 0 44px",
  width: "44px",
  padding: "8px 0"
};
const toggleStyle = {
  ...buttonStyle,
  backgroundColor: "#444"
};
const toggleActiveStyle = {
  ...buttonStyle,
  backgroundColor: "#666"
};
const sectionStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  alignItems: "center"
};
const labelStyle = {
  fontFamily: UI_FONT,
  fontSize: "12px",
  color: "#888",
  marginRight: "2px",
  userSelect: "none",
  flex: "0 0 auto"
};
function ActionButton({ label, onClick }) {
  return /* @__PURE__ */ jsx("button", { type: "button", style: buttonStyle, onClick, children: label });
}
function ExitButton({ exit, onClick }) {
  return /* @__PURE__ */ jsx("button", { type: "button", style: compactButtonStyle, onClick, title: exit.longName, children: exit.shortName.toUpperCase() });
}
function TargetButton({ target, onClick }) {
  return /* @__PURE__ */ jsx("button", { type: "button", style: buttonStyle, onClick, title: `examine ${target.shortName}`, children: target.shortName });
}
function ItemButton({ item, onClick }) {
  return /* @__PURE__ */ jsx("button", { type: "button", style: buttonStyle, onClick, children: item.shortName });
}
function ActionBar({ gameState, inputRequest, recentOutput, onSubmit }) {
  const [expanded, setExpanded] = useState("none");
  const vm = useMemo(
    () => deriveGameViewModel(gameState, inputRequest, recentOutput),
    [gameState, inputRequest, recentOutput]
  );
  const submit = useCallback((command) => {
    setExpanded("none");
    onSubmit(command);
  }, [onSubmit]);
  const togglePanel = useCallback((panel) => {
    setExpanded((prev) => prev === panel ? "none" : panel);
  }, []);
  if (vm.inputContext !== "command") return null;
  const hasExits = vm.exits.length > 0;
  const hasTargets = vm.targets.length > 0;
  const hasTakeable = vm.takeable.length > 0;
  const hasDroppable = vm.droppable.length > 0;
  const roomTargets = vm.targets.filter((t) => t.location === "room");
  const invTargets = vm.targets.filter((t) => t.location === "inventory");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        padding: "8px",
        borderTop: "1px solid #444",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsx(ActionButton, { label: "Inv", onClick: () => submit("inventory") }),
          hasExits && vm.exits.map((exit) => /* @__PURE__ */ jsx(ExitButton, { exit, onClick: () => submit(exit.command) }, exit.directionProperty)),
          hasTakeable && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              style: expanded === "take" ? toggleActiveStyle : toggleStyle,
              onClick: () => togglePanel("take"),
              children: "Take"
            }
          ),
          hasTargets && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              style: expanded === "examine" ? toggleActiveStyle : toggleStyle,
              onClick: () => togglePanel("examine"),
              children: "Examine"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              style: expanded === "more" ? toggleActiveStyle : toggleStyle,
              onClick: () => togglePanel("more"),
              title: "More actions",
              children: "\u2026"
            }
          )
        ] }),
        expanded === "take" && /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsx(ActionButton, { label: "All", onClick: () => submit("take all") }),
          vm.takeable.map((item) => /* @__PURE__ */ jsx(ItemButton, { item, onClick: () => submit(`take ${item.shortName}`) }, item.objectNumber))
        ] }),
        expanded === "more" && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsx(ActionButton, { label: "Look", onClick: () => submit("look") }),
          /* @__PURE__ */ jsx(ActionButton, { label: "Wait", onClick: () => submit("z") }),
          hasDroppable && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              style: toggleStyle,
              onClick: () => setExpanded("drop"),
              children: "Drop"
            }
          ),
          /* @__PURE__ */ jsx(ActionButton, { label: "Undo", onClick: () => submit("undo") }),
          /* @__PURE__ */ jsx(ActionButton, { label: "Save", onClick: () => submit("save") }),
          /* @__PURE__ */ jsx(ActionButton, { label: "Restore", onClick: () => submit("restore") }),
          /* @__PURE__ */ jsx(ActionButton, { label: "Restart", onClick: () => submit("restart") })
        ] }) }),
        expanded === "drop" && /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsx(ActionButton, { label: "All", onClick: () => submit("drop all") }),
          vm.droppable.map((item) => /* @__PURE__ */ jsx(ItemButton, { item, onClick: () => submit(`drop ${item.shortName}`) }, item.objectNumber))
        ] }),
        expanded === "examine" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
          roomTargets.length > 0 && /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
            /* @__PURE__ */ jsx("span", { style: labelStyle, children: "Here:" }),
            roomTargets.map((target) => /* @__PURE__ */ jsx(TargetButton, { target, onClick: () => submit(target.command) }, target.objectNumber))
          ] }),
          invTargets.length > 0 && /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
            /* @__PURE__ */ jsx("span", { style: labelStyle, children: "Carrying:" }),
            invTargets.map((target) => /* @__PURE__ */ jsx(TargetButton, { target, onClick: () => submit(target.command) }, target.objectNumber))
          ] })
        ] })
      ]
    }
  );
}
export {
  ActionBar
};
