import { useState, useEffect } from "react";
import { DEFAULT_TERMINAL_CONFIG } from "../defaults.js";
function selectProfile(config, containerWidth) {
  let selected = config[0];
  for (const bp of config) {
    if (bp.minWidthPx <= containerWidth) {
      selected = bp;
    }
  }
  return selected.profile;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
const DEFAULT_CHAR_WIDTH_RATIO = 0.6;
function measureCharWidth(fontFamily, fontSizePx) {
  if (typeof document === "undefined") {
    return fontSizePx * DEFAULT_CHAR_WIDTH_RATIO;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return fontSizePx * DEFAULT_CHAR_WIDTH_RATIO;
  }
  ctx.font = `${fontSizePx}px ${fontFamily}`;
  return ctx.measureText("M").width;
}
function resolveTerminal(containerWidth, containerHeight, config) {
  const profile = selectProfile(config, containerWidth);
  const testFontSize = (profile.minFontSizePx + profile.maxFontSizePx) / 2;
  const charWidthRatio = profile.charWidthRatio ?? measureCharWidth(profile.fontFamily, testFontSize) / testFontSize;
  const idealFontSize = containerWidth / (profile.columns * charWidthRatio);
  const fontSizePx = clamp(idealFontSize, profile.minFontSizePx, profile.maxFontSizePx);
  const charWidthPx = fontSizePx * charWidthRatio;
  const rowHeightPx = fontSizePx * profile.lineHeight;
  const rows = Math.max(1, Math.floor(containerHeight / rowHeightPx));
  return {
    profile,
    fontSizePx,
    charWidthPx,
    rowHeightPx,
    columns: profile.columns,
    rows
  };
}
function useTerminal(containerRef, config) {
  const [resolved, setResolved] = useState(null);
  const effectiveConfig = config ?? DEFAULT_TERMINAL_CONFIG;
  useEffect(() => {
    const el = containerRef.current;
    if (el === null) return;
    const rect = el.getBoundingClientRect();
    setResolved(resolveTerminal(rect.width, rect.height, effectiveConfig));
  }, [containerRef, effectiveConfig]);
  return resolved;
}
export {
  resolveTerminal,
  useTerminal
};
