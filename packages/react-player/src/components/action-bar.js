import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  deriveGameViewModel
} from "@inform6sharp/game-runner";
const UI_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const CELL = 40;
const GAP = 3;
const cellBase = {
  fontFamily: UI_FONT,
  fontSize: "12px",
  lineHeight: "1",
  borderRadius: "4px",
  cursor: "pointer",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: "1px solid #666",
  backgroundColor: "#555",
  color: "#ccc",
  boxSizing: "border-box"
};
const dirActive = { ...cellBase };
const dirInactive = {
  ...cellBase,
  backgroundColor: "#2a2a2a",
  color: "#444",
  border: "1px solid #333",
  cursor: "default"
};
const alwaysActive = { ...cellBase, fontSize: "18px" };
const actionCell = { ...cellBase };
const toggleCell = { ...cellBase, backgroundColor: "#444" };
const disabledCell = {
  ...cellBase,
  backgroundColor: "#333",
  color: "#555",
  cursor: "default"
};
const listItemStyle = {
  fontFamily: UI_FONT,
  fontSize: "14px",
  lineHeight: "1.4",
  padding: "8px 14px",
  backgroundColor: "#555",
  color: "#ccc",
  border: "1px solid #666",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "left",
  minHeight: "44px",
  width: "100%",
  boxSizing: "border-box"
};
const listLabelStyle = {
  fontFamily: UI_FONT,
  fontSize: "12px",
  color: "#888",
  padding: "2px 4px",
  userSelect: "none"
};
const disabledListItem = {
  ...listItemStyle,
  backgroundColor: "#333",
  color: "#666",
  cursor: "default",
  fontStyle: "italic"
};
const actionGridStyle = {
  display: "grid",
  gridTemplateColumns: `repeat(3, ${CELL}px)`,
  gridTemplateRows: `repeat(3, ${CELL}px)`,
  gap: `${GAP}px`
};
const DIR_CELLS = [
  { label: "NW", prop: "nw_to", command: "northwest", col: 1, row: 0 },
  { label: "N", prop: "n_to", command: "north", col: 2, row: 0 },
  { label: "NE", prop: "ne_to", command: "northeast", col: 3, row: 0 },
  { label: "Up", prop: "u_to", command: "up", col: 4, row: 0 },
  { label: "In", prop: "in_to", command: "in", col: 0, row: 1 },
  { label: "W", prop: "w_to", command: "west", col: 1, row: 1 },
  { label: "E", prop: "e_to", command: "east", col: 3, row: 1 },
  { label: "Dn", prop: "d_to", command: "down", col: 4, row: 1 },
  { label: "Out", prop: "out_to", command: "out", col: 0, row: 2 },
  { label: "SW", prop: "sw_to", command: "southwest", col: 1, row: 2 },
  { label: "S", prop: "s_to", command: "south", col: 2, row: 2 },
  { label: "SE", prop: "se_to", command: "southeast", col: 3, row: 2 }
];
const compassGridStyle = {
  display: "grid",
  gridTemplateColumns: `repeat(5, ${CELL}px)`,
  gridTemplateRows: `repeat(3, ${CELL}px)`,
  gap: `${GAP}px`
};
function ListItem({ label, onClick }) {
  return /* @__PURE__ */ jsx("button", { type: "button", style: listItemStyle, onClick, children: label });
}
const ActionBar = forwardRef(
  function ActionBar2({ gameState, inputRequest, recentOutput, onSubmit }, ref) {
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
    useImperativeHandle(ref, () => ({
      dismiss() {
        setExpanded("none");
      }
    }), []);
    if (vm.inputContext !== "command") return null;
    const roomTargets = vm.targets.filter((t) => t.location === "room");
    const invTargets = vm.targets.filter((t) => t.location === "inventory");
    const activeExits = useMemo(
      () => new Set(vm.exits.map((e) => e.directionProperty)),
      [vm.exits]
    );
    const panelOpen = expanded !== "none";
    const canDrop = vm.droppable.length > 0;
    function pos(col, row, span = 1) {
      return { gridColumn: `${col + 1} / span ${span}`, gridRow: row + 1 };
    }
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
          !panelOpen && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxs("div", { style: actionGridStyle, children: [
              /* @__PURE__ */ jsx("button", { type: "button", style: { ...actionCell, ...pos(0, 0, 3) }, onClick: () => submit("inventory"), children: "Inventory" }),
              /* @__PURE__ */ jsx("button", { type: "button", style: { ...toggleCell, ...pos(0, 1, 3) }, onClick: () => togglePanel("take"), children: "Take" }),
              /* @__PURE__ */ jsx("button", { type: "button", style: { ...canDrop ? toggleCell : disabledCell, ...pos(0, 2, 2) }, onClick: canDrop ? () => togglePanel("drop") : void 0, disabled: !canDrop, children: "Drop" }),
              /* @__PURE__ */ jsx("button", { type: "button", style: { ...toggleCell, ...pos(2, 2) }, onClick: () => togglePanel("more"), title: "More actions", children: "\u2026" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: compassGridStyle, children: [
              /* @__PURE__ */ jsx("button", { type: "button", style: { ...alwaysActive, ...pos(2, 1) }, onClick: () => submit("look"), title: "Look", children: "\u{1F441}" }),
              /* @__PURE__ */ jsx("button", { type: "button", style: { ...alwaysActive, ...pos(4, 2) }, onClick: () => togglePanel("examine"), title: "Examine", children: "\u{1F50D}" }),
              DIR_CELLS.map((cell) => {
                const active = activeExits.has(cell.prop);
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    style: { ...active ? dirActive : dirInactive, ...pos(cell.col, cell.row) },
                    onClick: active ? () => submit(cell.command) : void 0,
                    disabled: !active,
                    title: active ? cell.command : void 0,
                    children: cell.label
                  },
                  cell.prop
                );
              })
            ] })
          ] }),
          expanded === "take" && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: vm.takeable.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(ListItem, { label: "Take all", onClick: () => submit("take all") }),
            vm.takeable.map((item) => /* @__PURE__ */ jsx(ListItem, { label: item.shortName, onClick: () => submit(`take ${item.shortName}`) }, item.objectNumber))
          ] }) : /* @__PURE__ */ jsx("div", { style: disabledListItem, children: "Nothing to take here" }) }),
          expanded === "drop" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
            /* @__PURE__ */ jsx(ListItem, { label: "Drop all", onClick: () => submit("drop all") }),
            vm.droppable.map((item) => /* @__PURE__ */ jsx(ListItem, { label: item.shortName, onClick: () => submit(`drop ${item.shortName}`) }, item.objectNumber))
          ] }),
          expanded === "examine" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
            roomTargets.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { style: listLabelStyle, children: "Here:" }),
              roomTargets.map((target) => /* @__PURE__ */ jsx(ListItem, { label: target.shortName, onClick: () => submit(target.command) }, target.objectNumber))
            ] }),
            invTargets.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { style: listLabelStyle, children: "Carrying:" }),
              invTargets.map((target) => /* @__PURE__ */ jsx(ListItem, { label: target.shortName, onClick: () => submit(target.command) }, target.objectNumber))
            ] }),
            roomTargets.length === 0 && invTargets.length === 0 && /* @__PURE__ */ jsx("div", { style: disabledListItem, children: "Nothing to examine" })
          ] }),
          expanded === "more" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
            /* @__PURE__ */ jsx(ListItem, { label: "Wait", onClick: () => submit("z") }),
            /* @__PURE__ */ jsx(ListItem, { label: "Undo", onClick: () => submit("undo") }),
            /* @__PURE__ */ jsx(ListItem, { label: "Save", onClick: () => submit("save") }),
            /* @__PURE__ */ jsx(ListItem, { label: "Restore", onClick: () => submit("restore") }),
            /* @__PURE__ */ jsx(ListItem, { label: "Restart", onClick: () => submit("restart") })
          ] })
        ]
      }
    );
  }
);
export {
  ActionBar
};
