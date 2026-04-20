const ROMAN_STYLE = {
  bold: false,
  underline: false,
  reverse: false,
  fixed: false
};
const EMPTY_CELL = { char: " ", style: ROMAN_STYLE };
function applyStyleName(current, name) {
  switch (name) {
    case "roman":
      return ROMAN_STYLE;
    case "bold":
      return { ...current, bold: true };
    case "underline":
      return { ...current, underline: true };
    case "reverse":
      return { ...current, reverse: true };
    case "fixed":
      return { ...current, fixed: true };
    default:
      throw new Error(`Unknown Inform6 style name: ${name}`);
  }
}
function textStyleEquals(a, b) {
  return a.bold === b.bold && a.underline === b.underline && a.reverse === b.reverse && a.fixed === b.fixed;
}
function glkStyleToInform6StyleName(styleCode) {
  switch (styleCode) {
    case 0:
      return "roman";
    // style_Normal — reset
    case 1:
      return "bold";
    // style_Emphasized
    case 2:
      return "fixed";
    // style_Preformatted
    case 3:
      return "bold";
    // style_Header
    case 4:
      return "bold";
    // style_Subheader
    case 5:
      return "bold";
    // style_Alert
    case 6:
      return "underline";
    // style_Note
    case 7:
      return "roman";
    // style_BlockQuote — no Inform6 flag
    case 8:
      return "bold";
    // style_Input
    case 9:
    // style_User1
    case 10:
    // style_User2
    default:
      return null;
  }
}
export {
  EMPTY_CELL,
  ROMAN_STYLE,
  applyStyleName,
  glkStyleToInform6StyleName,
  textStyleEquals
};
