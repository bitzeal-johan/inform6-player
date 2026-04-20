const MOBILE_FONT_FAMILY = '"SF Mono", "Roboto Mono", monospace';
const DESKTOP_FONT_FAMILY = '"Menlo", "Consolas", monospace';
const DEFAULT_TERMINAL_CONFIG = [
  {
    minWidthPx: 0,
    profile: {
      fontFamily: MOBILE_FONT_FAMILY,
      columns: 40,
      minFontSizePx: 10,
      maxFontSizePx: 16,
      lineHeight: 1.4,
      charWidthRatio: null
    }
  },
  {
    minWidthPx: 600,
    profile: {
      fontFamily: DESKTOP_FONT_FAMILY,
      columns: 60,
      minFontSizePx: 12,
      maxFontSizePx: 18,
      lineHeight: 1.3,
      charWidthRatio: null
    }
  },
  {
    minWidthPx: 1024,
    profile: {
      fontFamily: DESKTOP_FONT_FAMILY,
      columns: 80,
      minFontSizePx: 13,
      maxFontSizePx: 20,
      lineHeight: 1.3,
      charWidthRatio: null
    }
  }
];
export {
  DEFAULT_TERMINAL_CONFIG
};
