import {
  textStyleEquals
} from "@inform6sharp/game-runner";
function styleToCss(style, overrides) {
  const css = {};
  if (style.bold) {
    if (overrides?.bold) {
      Object.assign(css, overrides.bold);
    } else {
      css.fontWeight = "bold";
    }
  }
  if (style.underline) {
    if (overrides?.underline) {
      Object.assign(css, overrides.underline);
    } else {
      css.textDecoration = "underline";
    }
  }
  if (style.reverse) {
    if (overrides?.reverse) {
      Object.assign(css, overrides.reverse);
    } else {
      css.backgroundColor = "var(--if-fg)";
      css.color = "var(--if-bg)";
    }
  }
  if (style.fixed && overrides?.fixed) {
    Object.assign(css, overrides.fixed);
  }
  return css;
}
function coalesceCells(row) {
  const runs = [];
  for (const cell of row) {
    const last = runs.length > 0 ? runs[runs.length - 1] : null;
    if (last !== null && textStyleEquals(last.style, cell.style)) {
      runs[runs.length - 1] = { text: last.text + cell.char, style: last.style };
    } else {
      runs.push({ text: cell.char, style: cell.style });
    }
  }
  return runs;
}
function composeStyles(base, overlay) {
  return {
    bold: base.bold || overlay.bold,
    underline: base.underline || overlay.underline,
    reverse: base.reverse || overlay.reverse,
    fixed: base.fixed || overlay.fixed
  };
}
export {
  coalesceCells,
  composeStyles,
  styleToCss
};
