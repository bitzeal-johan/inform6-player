import { intValue, toInt } from "./inform-value.js";
function intPropValue(n) {
  return { kind: "int", value: n | 0 };
}
function stringPropValue(s) {
  return { kind: "string", value: s };
}
function propToScalarInt(pv) {
  switch (pv.kind) {
    case "int":
      return pv.value;
    case "string":
      return 1;
    // strings are truthy in Inform6
    case "list":
      return pv.values.length > 0 ? propToScalarInt(pv.values[0]) : 0;
    case "dictWord":
      return 1;
    // dict words are truthy in Inform6
    case "routine":
      return 1;
  }
}
function propToInformValue(pv) {
  switch (pv.kind) {
    case "int":
      return intValue(pv.value);
    case "string":
      return { kind: "string", value: pv.value };
    case "list":
      return intValue(pv.values.length > 0 ? propToScalarInt(pv.values[0]) : 0);
    case "dictWord":
      return { kind: "dictWord", word: pv.word };
    case "routine":
      return { kind: "routine", routineName: pv.routineName };
  }
}
function informValueToProp(iv) {
  switch (iv.kind) {
    case "int":
      return intPropValue(iv.value);
    case "string":
      return stringPropValue(iv.value);
    case "array":
      return intPropValue(0);
    case "byteArray":
      return intPropValue(0);
    case "routine":
      return { kind: "routine", routineName: iv.routineName };
    case "propertyAddress":
      return intPropValue(toInt(iv));
    case "dictWord":
      return { kind: "dictWord", word: iv.word };
  }
}
function propertyValueEquals(a, b) {
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case "int":
      return a.value === b.value;
    case "string":
      return a.value === b.value;
    case "dictWord":
      return a.word === b.word;
    case "routine":
      return a.routineName === b.routineName;
    case "list": {
      const bList = b;
      if (a.values.length !== bList.values.length) return false;
      for (let i = 0; i < a.values.length; i++) {
        if (!propertyValueEquals(a.values[i], bList.values[i])) return false;
      }
      return true;
    }
  }
}
export {
  informValueToProp,
  intPropValue,
  propToInformValue,
  propToScalarInt,
  propertyValueEquals,
  stringPropValue
};
