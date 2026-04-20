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
const COMPASS_GRID = [
  { label: "NW", prop: "nw_to", command: "northwest" },
  { label: "N", prop: "n_to", command: "north" },
  { label: "NE", prop: "ne_to", command: "northeast" },
  { label: "W", prop: "w_to", command: "west" },
  { label: "", prop: "", command: "look" },
  // center = Look
  { label: "E", prop: "e_to", command: "east" },
  { label: "SW", prop: "sw_to", command: "southwest" },
  { label: "S", prop: "s_to", command: "south" },
  { label: "SE", prop: "se_to", command: "southeast" }
];
const VERTICAL_DIRS = [
  { label: "U", prop: "u_to", command: "up" },
  { label: "D", prop: "d_to", command: "down" },
  { label: "In", prop: "in_to", command: "in" },
  { label: "Out", prop: "out_to", command: "out" }
];
const COMPASS_CELL = 40;
const COMPASS_GAP = 3;
const compassGridStyle = {
  display: "grid",
  gridTemplateColumns: `repeat(3, ${COMPASS_CELL}px)`,
  gridTemplateRows: `repeat(3, ${COMPASS_CELL}px)`,
  gap: `${COMPASS_GAP}px`,
  flexShrink: 0
};
const compassCellBase = {
  fontFamily: UI_FONT,
  fontSize: "12px",
  lineHeight: "1",
  border: "1px solid #555",
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
const compassCenter = {
  ...compassCellBase,
  backgroundColor: "#555",
  color: "#ccc",
  border: "1px solid #666",
  fontSize: "18px"
};
const verticalDirStyle = {
  ...compassCellBase,
  backgroundColor: "#555",
  color: "#ccc",
  border: "1px solid #666",
  width: `${COMPASS_CELL}px`,
  height: `${COMPASS_CELL}px`
};
const verticalDirInactive = {
  ...compassCellBase,
  backgroundColor: "#2a2a2a",
  color: "#444",
  border: "1px solid #333",
  cursor: "default",
  width: `${COMPASS_CELL}px`,
  height: `${COMPASS_CELL}px`
};
function CompassRose({
  activeExits,
  onSubmit
}) {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: `${COMPASS_GAP}px` }, children: [
    /* @__PURE__ */ jsx("div", { style: compassGridStyle, children: COMPASS_GRID.map((cell, i) => {
      if (i === 4) {
        return /* @__PURE__ */ jsx("button", { type: "button", style: compassCenter, onClick: () => onSubmit("look"), title: "Look", children: "\u{1F441}" }, "look");
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
    }) }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: `${COMPASS_GAP}px` }, children: VERTICAL_DIRS.map((dir) => {
      const active = activeExits.has(dir.prop);
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          style: active ? verticalDirStyle : verticalDirInactive,
          onClick: active ? () => onSubmit(dir.command) : void 0,
          disabled: !active,
          title: active ? dir.command : void 0,
          children: dir.label
        },
        dir.prop
      );
    }) })
  ] });
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
          /* @__PURE__ */ jsx(CompassRose, { activeExits, onSubmit: submit })
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
