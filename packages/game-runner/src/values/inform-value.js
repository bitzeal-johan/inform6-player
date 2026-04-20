function intValue(n) {
  return { kind: "int", value: n | 0 };
}
function stringValue(s) {
  return { kind: "string", value: s };
}
function routineValue(name) {
  return { kind: "routine", routineName: name };
}
function dictWordValue(word) {
  return { kind: "dictWord", word };
}
function toInt(v) {
  switch (v.kind) {
    case "int":
      return v.value;
    case "string":
      return 0;
    case "array":
      return 0;
    case "byteArray":
      return 0;
    case "routine":
      return 0;
    case "propertyAddress": {
      const key = v.objectId.toLowerCase() + "." + v.propertyName.toLowerCase();
      let hash = 524288;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i) | 0;
      }
      return Math.abs(hash) % 524287 + 524288;
    }
    case "dictWord":
      return 0;
  }
}
function isTruthy(v) {
  return toInt(v) !== 0;
}
function ivAdd(a, b) {
  return intValue(toInt(a) + toInt(b) | 0);
}
function ivSub(a, b) {
  return intValue(toInt(a) - toInt(b) | 0);
}
function ivMul(a, b) {
  return intValue(Math.imul(toInt(a), toInt(b)));
}
function ivDiv(a, b) {
  const bVal = toInt(b);
  if (bVal === 0) return intValue(0);
  return intValue(toInt(a) / bVal | 0);
}
function ivMod(a, b) {
  const bVal = toInt(b);
  if (bVal === 0) return intValue(0);
  return intValue(toInt(a) % bVal | 0);
}
export {
  dictWordValue,
  intValue,
  isTruthy,
  ivAdd,
  ivDiv,
  ivMod,
  ivMul,
  ivSub,
  routineValue,
  stringValue,
  toInt
};
