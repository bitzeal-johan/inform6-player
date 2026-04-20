import { createGameDefinition } from "./game-definition.js";
import { ObjectIdMapper } from "../mappers/object-id-mapper.js";
import { ObjectTreeState } from "./object-tree-state.js";
import { Variables } from "./variables.js";
import { intValue } from "../values/inform-value.js";
import { intPropValue, propToScalarInt, propToInformValue } from "../values/property-value.js";
import { InformArray } from "../values/inform-array.js";
import { PersistentMap } from "../values/persistent-map.js";
function createInitialGameState(definition, _io, randomSeed) {
  return {
    definition: definition ? createGameDefinition(definition) : createGameDefinition({}),
    treeState: ObjectTreeState.empty,
    globals: Variables.empty,
    turn: 0,
    score: 0,
    randomSeed: randomSeed ?? 0,
    memoryMap: PersistentMap.emptyNumberKeyed(),
    dataStack: []
  };
}
function setGlobal(state, name, value) {
  return { ...state, globals: state.globals.setInt(name, value) };
}
function getGlobal(state, name) {
  return state.globals.getInt(name);
}
function setGlobalProp(state, name, value) {
  return { ...state, globals: state.globals.set(name, value) };
}
function getGlobalProp(state, name) {
  return state.globals.get(name);
}
function toStringId(state, iv) {
  if (iv.kind === "string") return iv.value;
  if (iv.kind === "int") return state.definition.objectIds.getName(iv.value);
  return "nothing";
}
function getParent(state, objIv) {
  const id = toStringId(state, objIv);
  const parentId = state.treeState.getParent(id);
  return intValue(state.definition.objectIds.getNumber(parentId));
}
function getChild(state, objIv) {
  const id = toStringId(state, objIv);
  const children = state.treeState.getChildren(id);
  if (children.length === 0) return intValue(0);
  children.sort(
    (a, b) => state.definition.objectIds.getNumber(a) - state.definition.objectIds.getNumber(b)
  );
  return intValue(state.definition.objectIds.getNumber(children[0]));
}
function getSibling(state, objIv) {
  const id = toStringId(state, objIv);
  const parentId = state.treeState.getParent(id);
  if (parentId === "nothing") return intValue(0);
  const siblings = state.treeState.getChildren(parentId);
  siblings.sort(
    (a, b) => state.definition.objectIds.getNumber(a) - state.definition.objectIds.getNumber(b)
  );
  const idx = siblings.indexOf(id);
  if (idx === -1 || idx === siblings.length - 1) return intValue(0);
  return intValue(state.definition.objectIds.getNumber(siblings[idx + 1]));
}
function registerObject(state, objId) {
  return { ...state, treeState: state.treeState.registerObject(objId) };
}
function moveObject(state, objIv, destIv) {
  const objId = toStringId(state, objIv);
  const destId = toStringId(state, destIv);
  return { ...state, treeState: state.treeState.moveObject(objId, destId) };
}
function removeFromParent(state, objIv) {
  const objId = toStringId(state, objIv);
  return { ...state, treeState: state.treeState.removeFromParent(objId) };
}
function setAttribute(state, objIv, attrName) {
  const id = toStringId(state, objIv);
  return { ...state, treeState: state.treeState.setAttribute(id, attrName) };
}
function clearAttribute(state, objIv, attrName) {
  const id = toStringId(state, objIv);
  return { ...state, treeState: state.treeState.removeAttribute(id, attrName) };
}
function hasAttribute(state, objIv, attrName) {
  const id = toStringId(state, objIv);
  return state.treeState.hasAttribute(id, attrName);
}
function hasAttributeByIndex(state, objIv, attrIndex) {
  const attrName = state.definition.attributeMapper.getAttributeName(attrIndex);
  if (attrName === null) return false;
  return hasAttribute(state, objIv, attrName);
}
function safeGetProperty(state, objIv, propName) {
  const id = toStringId(state, objIv);
  const pv = state.treeState.getProperty(id, propName);
  if (pv === null) {
    const objDef = state.definition.objects.get(id.toLowerCase());
    if (objDef !== void 0) {
      const initPv = objDef.initialProperties.get(propName.toLowerCase());
      if (initPv !== void 0) return propToScalarInt(initPv);
    }
    return 0;
  }
  return propToScalarInt(pv);
}
function getPropertyAsInformValue(state, objIv, propName) {
  const id = toStringId(state, objIv);
  const pv = state.treeState.getProperty(id, propName);
  if (pv === null) {
    const objDef = state.definition.objects.get(id.toLowerCase());
    if (objDef !== void 0) {
      const initPv = objDef.initialProperties.get(propName.toLowerCase());
      if (initPv !== void 0) return propToInformValue(initPv);
    }
    return intValue(0);
  }
  return propToInformValue(pv);
}
function setProperty(state, objStringId, propName, value) {
  return { ...state, treeState: state.treeState.setProperty(objStringId, propName, value) };
}
function provides(state, objIv, propName) {
  const id = toStringId(state, objIv);
  const objDef = state.definition.objects.get(id.toLowerCase());
  if (objDef === void 0) return false;
  return objDef.providedProperties.has(propName.toLowerCase());
}
function isIn(state, objIv, containerIv) {
  const objId = toStringId(state, objIv);
  const containerId = toStringId(state, containerIv);
  const parentId = state.treeState.getParent(objId);
  return parentId.toLowerCase() === containerId.toLowerCase();
}
function syntheticPropertyAddress(objectId, propName) {
  let hash = 524288;
  const key = objectId.toLowerCase() + "." + propName.toLowerCase();
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i) | 0;
  }
  return Math.abs(hash) % 524287 + 524288;
}
function getPropertyAddress(state, objIv, propName) {
  const id = toStringId(state, objIv);
  const lowerProp = propName.toLowerCase();
  const objDef = state.definition.objects.get(id.toLowerCase());
  if (objDef === void 0) return intValue(0);
  if (!objDef.providedProperties.has(lowerProp)) return intValue(0);
  return { kind: "propertyAddress", objectId: id, propertyName: lowerProp, values: [] };
}
function getPropertyLength(state, objIv, propName) {
  const id = toStringId(state, objIv);
  const lowerProp = propName.toLowerCase();
  const objDef = state.definition.objects.get(id.toLowerCase());
  if (objDef === void 0) return 0;
  if (!objDef.providedProperties.has(lowerProp)) return 0;
  if (objDef.functionPropertyNames.has(lowerProp)) return 4;
  const pv = state.treeState.getProperty(id, lowerProp);
  if (pv !== null) {
    if (pv.kind === "list") return pv.values.length * 4;
    return 4;
  }
  const initPv = objDef.initialProperties.get(lowerProp);
  if (initPv !== void 0) {
    if (initPv.kind === "list") return initPv.values.length * 4;
    return 4;
  }
  return 4;
}
function isOfClass(state, objIv, className) {
  const id = toStringId(state, objIv);
  const objDef = state.definition.objects.get(id.toLowerCase());
  if (objDef === void 0) return false;
  if (state.definition.classHierarchy.has(id.toLowerCase())) return false;
  const objClassName = objDef.className;
  if (objClassName === null) return false;
  let current = objClassName.toLowerCase();
  const target = className.toLowerCase();
  while (current !== null) {
    if (current === target) return true;
    const parent = state.definition.classHierarchy.get(current);
    current = parent !== void 0 ? parent : null;
  }
  return false;
}
function classCreate(state, className) {
  const lowerClassName = className.toLowerCase();
  const classDef = state.definition.objects.get(lowerClassName);
  if (classDef === void 0) return [state, 0];
  let maxNum = 0;
  for (const [, objDef] of state.definition.objects) {
    if (objDef.number > maxNum) maxNum = objDef.number;
  }
  const newNum = maxNum + 1;
  const newId = `${lowerClassName}_dyn_${newNum}`;
  const newObjDef = {
    id: newId,
    number: newNum,
    shortName: classDef.shortName,
    className: lowerClassName,
    initialProperties: classDef.initialProperties,
    initialAttributes: classDef.initialAttributes,
    providedProperties: classDef.providedProperties,
    functionPropertyNames: classDef.functionPropertyNames
  };
  const newObjects = new Map(state.definition.objects);
  newObjects.set(newId, newObjDef);
  const newMapping = /* @__PURE__ */ new Map();
  for (const [, objDef] of state.definition.objects) {
    newMapping.set(objDef.number, objDef.id);
  }
  newMapping.set(newNum, newId);
  const newObjectIds = new ObjectIdMapper(newMapping);
  const newDefinition = {
    ...state.definition,
    objects: newObjects,
    objectIds: newObjectIds
  };
  let newTreeState = state.treeState.registerObject(newId);
  for (const attr of classDef.initialAttributes) {
    newTreeState = newTreeState.setAttribute(newId, attr);
  }
  return [{ ...state, definition: newDefinition, treeState: newTreeState }, newNum];
}
function pushStack(state, value) {
  return { ...state, dataStack: [...state.dataStack, value] };
}
function popStack(state) {
  if (state.dataStack.length === 0) return [state, 0];
  const value = state.dataStack[state.dataStack.length - 1];
  return [{ ...state, dataStack: state.dataStack.slice(0, -1) }, value];
}
function nextRandom(state, max) {
  const seed = state.randomSeed * 1103515245 + 12345 & 2147483647 | 0;
  const newState = { ...state, randomSeed: seed };
  if (max <= 0) return [newState, seed];
  return [newState, Math.abs(seed) % max + 1];
}
function getPropertyWordAt(state, objIv, propName, index) {
  const id = toStringId(state, objIv);
  const lowerProp = propName.toLowerCase();
  const pv = state.treeState.getProperty(id, lowerProp);
  if (pv !== null) {
    if (pv.kind === "list") {
      if (index >= 0 && index < pv.values.length) return propToScalarInt(pv.values[index]);
      return 0;
    }
    return index === 0 ? propToScalarInt(pv) : 0;
  }
  const objDef = state.definition.objects.get(id.toLowerCase());
  if (objDef !== void 0) {
    const initPv = objDef.initialProperties.get(lowerProp);
    if (initPv !== void 0) {
      if (initPv.kind === "list") {
        if (index >= 0 && index < initPv.values.length) return propToScalarInt(initPv.values[index]);
        return 0;
      }
      return index === 0 ? propToScalarInt(initPv) : 0;
    }
  }
  return 0;
}
function getPropertyByteAt(state, objIv, propName, index) {
  return getPropertyWordAt(state, objIv, propName, index) & 255;
}
function setPropertyWordAt(state, objIv, propName, index, value) {
  const id = toStringId(state, objIv);
  const lowerProp = propName.toLowerCase();
  let pv = state.treeState.getProperty(id, lowerProp);
  if (pv === null) {
    const objDef = state.definition.objects.get(id.toLowerCase());
    if (objDef !== void 0) {
      const initPv = objDef.initialProperties.get(lowerProp);
      if (initPv !== void 0) pv = initPv;
    }
  }
  if (pv !== null && pv.kind === "list") {
    const newValues = [...pv.values];
    if (index >= 0 && index < newValues.length) {
      newValues[index] = intPropValue(value);
      return setProperty(state, id, lowerProp, { kind: "list", values: newValues });
    }
  }
  if (index === 0) {
    return setProperty(state, id, lowerProp, intPropValue(value));
  }
  return state;
}
function setPropertyByteAt(state, objIv, propName, index, value) {
  return setPropertyWordAt(state, objIv, propName, index, value & 255);
}
function getArrayByAddress(state, address) {
  const exact = state.memoryMap.get(address);
  if (exact !== void 0) return exact;
  if (address >= 1048576) {
    const dict = state.definition.dictionary;
    if (dict.getWord(address) !== null) {
      return buildDictionaryEntryArray(address, 0, dict);
    }
    const dictBase = 1048576;
    const offsetFromBase = address - dictBase;
    const entryIndex = offsetFromBase / 16 | 0;
    const offsetWithinEntry = offsetFromBase % 16;
    if (offsetWithinEntry !== 0) {
      const entryAddress = dictBase + entryIndex * 16;
      if (dict.getWord(entryAddress) !== null) {
        return buildDictionaryEntryArray(entryAddress, offsetWithinEntry, dict);
      }
    }
  }
  const found = findContainingArray(state, address);
  if (found !== void 0) {
    const [baseAddr, arr] = found;
    return createOffsetView(arr, address - baseAddr, address);
  }
  return void 0;
}
let _cachedMemoryMap = null;
let _cachedAddresses = [];
function getSortedAddresses(state) {
  if (state.memoryMap !== _cachedMemoryMap) {
    _cachedMemoryMap = state.memoryMap;
    _cachedAddresses = Array.from(state.memoryMap.keys()).sort((a, b) => a - b);
  }
  return _cachedAddresses;
}
function binarySearchFloor(sorted, target) {
  let lo = 0, hi = sorted.length - 1, result = -1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    if (sorted[mid] <= target) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}
function findContainingArray(state, address) {
  const addrs = getSortedAddresses(state);
  const pos = binarySearchFloor(addrs, address);
  if (pos < 0) return void 0;
  const baseAddr = addrs[pos];
  const arr = state.memoryMap.get(baseAddr);
  const arraySize = arr.isByteArray ? arr.length : arr.length * 4;
  if (address < baseAddr + arraySize) return [baseAddr, arr];
  return void 0;
}
function createOffsetView(arr, byteOffset, viewAddress) {
  return InformArray.createView(arr, byteOffset, viewAddress);
}
function buildDictionaryEntryArray(entryAddress, offset, dict) {
  const DICT_WORD_SIZE = 9;
  const entrySize = 16;
  const bytes = [];
  const word = dict.getWord(entryAddress);
  const wordId = entryAddress;
  for (let i = offset; i < entrySize; i++) {
    if (i < DICT_WORD_SIZE) {
      bytes.push(word !== null && i < word.length ? word.charCodeAt(i) : 0);
    } else if (i === DICT_WORD_SIZE + 1) {
      bytes.push(0);
    } else if (i === DICT_WORD_SIZE + 2) {
      bytes.push(dict.getWordFlags(wordId));
    } else if (i === DICT_WORD_SIZE + 3) {
      const encoded = dict.verbNumbers.get(wordId);
      bytes.push(encoded !== void 0 ? encoded >> 8 & 255 : 0);
    } else if (i === DICT_WORD_SIZE + 4) {
      const encoded = dict.verbNumbers.get(wordId);
      bytes.push(encoded !== void 0 ? encoded & 255 : 0);
    } else {
      bytes.push(0);
    }
  }
  return InformArray.createByteArrayFromData(entryAddress + offset, bytes);
}
function getWordAtRawAddress(state, rawAddr, wordIdx) {
  const exact = state.memoryMap.get(rawAddr);
  if (exact !== void 0) return exact.getWord(wordIdx);
  const found = findContainingArray(state, rawAddr);
  if (found !== void 0) {
    const [baseAddr, arr] = found;
    const byteOffset = rawAddr - baseAddr + wordIdx * 4;
    return arr.getByte(byteOffset) << 24 | arr.getByte(byteOffset + 1) << 16 | arr.getByte(byteOffset + 2) << 8 | arr.getByte(byteOffset + 3);
  }
  return void 0;
}
function getByteAtRawAddress(state, rawAddr, byteIdx) {
  const exact = state.memoryMap.get(rawAddr);
  if (exact !== void 0) return exact.getByte(byteIdx);
  const found = findContainingArray(state, rawAddr + byteIdx);
  if (found !== void 0) {
    const [baseAddr, arr] = found;
    return arr.getByte(rawAddr + byteIdx - baseAddr);
  }
  return void 0;
}
function setByteInArray(state, address, index, value) {
  const arr = state.memoryMap.get(address);
  if (!arr) {
    const found = findContainingArray(state, address + index);
    if (found === void 0) return state;
    const [baseAddr, base] = found;
    const byteOffset = address + index - baseAddr;
    const updated2 = base.setByte(byteOffset, value);
    if (updated2 === base) return state;
    return { ...state, memoryMap: state.memoryMap.set(baseAddr, updated2) };
  }
  const updated = arr.setByte(index, value);
  if (updated === arr) return state;
  return { ...state, memoryMap: state.memoryMap.set(address, updated) };
}
function setWordInArray(state, address, index, value) {
  const arr = state.memoryMap.get(address);
  if (!arr) {
    const byteAddr = address + index * 4;
    const found = findContainingArray(state, byteAddr);
    if (found === void 0) return state;
    const [baseAddr, base] = found;
    const byteOffset = byteAddr - baseAddr;
    let updated2;
    if (base.isByteArray) {
      updated2 = base.setByte(byteOffset, value >> 24 & 255);
      updated2 = updated2.setByte(byteOffset + 1, value >> 16 & 255);
      updated2 = updated2.setByte(byteOffset + 2, value >> 8 & 255);
      updated2 = updated2.setByte(byteOffset + 3, value & 255);
    } else {
      updated2 = base.setWord(byteOffset / 4 | 0, value);
    }
    if (updated2 === base) return state;
    return { ...state, memoryMap: state.memoryMap.set(baseAddr, updated2) };
  }
  const updated = arr.setWord(index, value);
  if (updated === arr) return state;
  return { ...state, memoryMap: state.memoryMap.set(address, updated) };
}
function setByteAtAddress(state, byteAddress, value) {
  const found = findContainingArray(state, byteAddress);
  if (found !== void 0) {
    const [baseAddr, arr] = found;
    const byteOffset = byteAddress - baseAddr;
    const updated = arr.setByte(byteOffset, value);
    if (updated === arr) return state;
    return { ...state, memoryMap: state.memoryMap.set(baseAddr, updated) };
  }
  throw new Error(`setByteAtAddress: no array contains address ${byteAddress}`);
}
function setWordAtByteOffset(state, byteAddress, value) {
  const found = findContainingArray(state, byteAddress);
  if (found !== void 0) {
    const [baseAddr, arr] = found;
    const byteOffset = byteAddress - baseAddr;
    let updated;
    if (arr.isByteArray) {
      updated = arr.setByte(byteOffset, value >> 24 & 255);
      updated = updated.setByte(byteOffset + 1, value >> 16 & 255);
      updated = updated.setByte(byteOffset + 2, value >> 8 & 255);
      updated = updated.setByte(byteOffset + 3, value & 255);
    } else {
      const wordIndex = byteOffset / 4 | 0;
      updated = arr.setWord(wordIndex, value);
    }
    if (updated === arr) return state;
    return { ...state, memoryMap: state.memoryMap.set(baseAddr, updated) };
  }
  throw new Error(`setWordAtByteOffset: no array contains byte address ${byteAddress}`);
}
export {
  classCreate,
  clearAttribute,
  createInitialGameState,
  getArrayByAddress,
  getByteAtRawAddress,
  getChild,
  getGlobal,
  getGlobalProp,
  getParent,
  getPropertyAddress,
  getPropertyAsInformValue,
  getPropertyByteAt,
  getPropertyLength,
  getPropertyWordAt,
  getSibling,
  getWordAtRawAddress,
  hasAttribute,
  hasAttributeByIndex,
  isIn,
  isOfClass,
  moveObject,
  nextRandom,
  popStack,
  provides,
  pushStack,
  registerObject,
  removeFromParent,
  safeGetProperty,
  setAttribute,
  setByteAtAddress,
  setByteInArray,
  setGlobal,
  setGlobalProp,
  setProperty,
  setPropertyByteAt,
  setPropertyWordAt,
  setWordAtByteOffset,
  setWordInArray,
  toStringId
};
