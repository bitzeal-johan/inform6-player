import { useEffect } from "react";
const ENTER_CHAR_CODE = 13;
const SPACE_CHAR_CODE = 32;
function CharInput({ active, onChar }) {
  useEffect(() => {
    if (!active) return;
    function handleKeyDown(e) {
      e.preventDefault();
      let charCode;
      if (e.key === "Enter") {
        charCode = ENTER_CHAR_CODE;
      } else if (e.key === " ") {
        charCode = SPACE_CHAR_CODE;
      } else if (e.key.length === 1) {
        charCode = e.key.charCodeAt(0);
      } else {
        return;
      }
      onChar(charCode);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onChar]);
  return null;
}
export {
  CharInput
};
