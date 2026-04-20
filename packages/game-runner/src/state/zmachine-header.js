import { InformArray } from "../values/inform-array.js";
const HDR_SCREENHLINES = 32;
const HDR_SCREENWCHARS = 33;
const HEADER_BASE = HDR_SCREENHLINES;
const HEADER_SIZE = 2;
const MAX_BYTE_VALUE = 255;
function clampByte(value) {
  const v = value | 0;
  if (v < 0) return 0;
  if (v > MAX_BYTE_VALUE) return MAX_BYTE_VALUE;
  return v;
}
function populateZMachineHeader(state, rows, columns) {
  if (state.memoryMap.get(HEADER_BASE) !== void 0) {
    return state;
  }
  let header = InformArray.createByteArray(HEADER_BASE, HEADER_SIZE);
  header = header.setByte(HDR_SCREENHLINES - HEADER_BASE, clampByte(rows));
  header = header.setByte(HDR_SCREENWCHARS - HEADER_BASE, clampByte(columns));
  return { ...state, memoryMap: state.memoryMap.set(HEADER_BASE, header) };
}
export {
  populateZMachineHeader
};
