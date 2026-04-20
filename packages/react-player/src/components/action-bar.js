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
const GRID_4X4 = [
  { kind: "direction", label: "NW", prop: "nw_to", command: "northwest" },
  { kind: "direction", label: "N", prop: "n_to", command: "north" },
  { kind: "direction", label: "NE", prop: "ne_to", command: "northeast" },
  { kind: "direction", label: "U", prop: "u_to", command: "up" },
  { kind: "direction", label: "W", prop: "w_to", command: "west" },
  { kind: "look", label: "\u{1F441}", prop: "", command: "look" },
  { kind: "direction", label: "E", prop: "e_to", command: "east" },
  { kind: "direction", label: "D", prop: "d_to", command: "down" },
  { kind: "direction", label: "SW", prop: "sw_to", command: "southwest" },
  { kind: "direction", label: "S", prop: "s_to", command: "south" },
  { kind: "direction", label: "SE", prop: "se_to", command: "southeast" },
  { kind: "empty", label: "", prop: "", command: "" },
  { kind: "direction", label: "In", prop: "in_to", command: "in" },
  { kind: "direction", label: "Out", prop: "out_to", command: "out" },
  { kind: "empty", label: "", prop: "", command: "" },
  { kind: "examine", label: "\u{1F50D}", prop: "", command: "" }
];
const COMPASS_CELL = 40;
const COMPASS_GAP = 3;
const compassGridStyle = {
  display: "grid",
  gridTemplateColumns: `repeat(4, ${COMPASS_CELL}px)`,
  gridTemplateRows: `repeat(4, ${COMPASS_CELL}px)`,
  gap: `${COMPASS_GAP}px`,
  flexShrink: 0
};
const compassCellBase = {
  fontFamily: UI_FONT,
  fontSize: "12px",
  lineHeight: "1",
  borderRadius: "4px",
  cursor: "pointer",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0
};
const compassActive = {
  ...compassCellBase,
  backgroundColor: "#555",
  color: "#ccc",
  border: "1px solid #666"
};
const compassInactive = {
  ...compassCellBase,
  backgroundColor: "#2a2a2a",
  color: "#444",
  border: "1px solid #333",
  cursor: "default"
};
const compassAlwaysActive = {
  ...compassCellBase,
  backgroundColor: "#555",
  color: "#ccc",
  border: "1px solid #666",
  fontSize: "18px"
};
const compassEmpty = {
  visibility: "hidden"
};
function CompassRose({
  activeExits,
  onSubmit,
  onExamine
}) {
  return /* @__PURE__ */ jsx("div", { style: compassGridStyle, children: GRID_4X4.map((cell, i) => {
    if (cell.kind === "empty") {
      return /* @__PURE__ */ jsx("div", { style: compassEmpty }, i);
    }
    if (cell.kind === "look") {
      return /* @__PURE__ */ jsx("button", { type: "button", style: compassAlwaysActive, onClick: () => onSubmit("look"), title: "Look", children: cell.label }, "look");
    }
    if (cell.kind === "examine") {
      return /* @__PURE__ */ jsx("button", { type: "button", style: compassAlwaysActive, onClick: onExamine, title: "Examine", children: cell.label }, "examine");
    }
    const active = activeExits.has(cell.prop);
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        style: active ? compassActive : compassInactive,
        onClick: active ? () => onSubmit(cell.command) : void 0,
        disabled: !active,
        title: active ? cell.command : void 0,
        children: cell.label
      },
      cell.prop
    );
  }) });
}
function ActionButton({ label, onClick }) {
  return /* @__PURE__ */ jsx("button", { type: "button", style: buttonStyle, onClick, children: label });
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
  const hasTargets = vm.targets.length > 0;
  const hasTakeable = vm.takeable.length > 0;
  const hasDroppable = vm.droppable.length > 0;
  const roomTargets = vm.targets.filter((t) => t.location === "room");
  const invTargets = vm.targets.filter((t) => t.location === "inventory");
  const activeExits = useMemo(
    () => new Set(vm.exits.map((e) => e.directionProperty)),
    [vm.exits]
  );
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
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "flex-start" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { ...sectionStyle, flex: 1, minWidth: 0, alignContent: "flex-start" }, children: [
            /* @__PURE__ */ jsx(ActionButton, { label: "Inv", onClick: () => submit("inventory") }),
            hasTakeable && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                style: expanded === "take" ? toggleActiveStyle : toggleStyle,
                onClick: () => togglePanel("take"),
                children: "Take"
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
          /* @__PURE__ */ jsx(CompassRose, { activeExits, onSubmit: submit, onExamine: () => togglePanel("examine") })
        ] }),
        expanded === "take" && /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsx(ActionButton, { label: "All", onClick: () => submit("take all") }),
          vm.takeable.map((item) => /* @__PURE__ */ jsx(ItemButton, { item, onClick: () => submit(`take ${item.shortName}`) }, item.objectNumber))
        ] }),
        expanded === "more" && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: /* @__PURE__ */ jsxs("div", { style: sectionStyle, children: [
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
