import { InformArray } from "../values/inform-array.js";
import { PersistentMap } from "../values/persistent-map.js";
import { PersistentSet } from "../values/persistent-set.js";
import { ObjectTreeState } from "../state/object-tree-state.js";
import { Variables } from "../state/variables.js";
function serializeState(state) {
  return {
    turn: state.turn,
    score: state.score,
    randomSeed: state.randomSeed,
    globals: serializeGlobals(state.globals),
    treeState: serializeTreeState(state.treeState),
    memoryMap: serializeMemoryMap(state.memoryMap),
    dataStack: state.dataStack
  };
}
function deserializeState(data, definition) {
  return {
    definition,
    turn: data.turn,
    score: data.score,
    randomSeed: data.randomSeed,
    globals: deserializeGlobals(data.globals),
    treeState: deserializeTreeState(data.treeState),
    memoryMap: deserializeMemoryMap(data.memoryMap),
    dataStack: [...data.dataStack]
  };
}
function serializeStateToJson(state) {
  return JSON.stringify(serializeState(state));
}
function deserializeStateFromJson(json, definition) {
  return deserializeState(JSON.parse(json), definition);
}
function serializePropertyValue(pv) {
  switch (pv.kind) {
    case "int":
      return { kind: "int", value: pv.value };
    case "string":
      return { kind: "string", value: pv.value };
    case "dictWord":
      return { kind: "dictWord", word: pv.word };
    case "routine":
      return { kind: "routine", routineName: pv.routineName };
    case "list":
      return { kind: "list", values: pv.values.map(serializePropertyValue) };
  }
}
function deserializePropertyValue(spv) {
  switch (spv.kind) {
    case "int":
      return { kind: "int", value: spv.value };
    case "string":
      return { kind: "string", value: spv.value };
    case "dictWord":
      return { kind: "dictWord", word: spv.word };
    case "routine":
      return { kind: "routine", routineName: spv.routineName };
    case "list":
      return { kind: "list", values: spv.values.map(deserializePropertyValue) };
  }
}
function serializeGlobals(globals) {
  const result = {};
  for (const [key, value] of globals.entries()) {
    result[key] = serializePropertyValue(value);
  }
  return result;
}
function deserializeGlobals(data) {
  const entries = [];
  for (const [key, spv] of Object.entries(data)) {
    entries.push([key, deserializePropertyValue(spv)]);
  }
  return Variables.fromEntries(entries);
}
function serializeTreeState(tree) {
  const parents = {};
  for (const [key, value] of tree.parents) {
    parents[key] = value;
  }
  const attributes = {};
  for (const [key, value] of tree.attributes) {
    attributes[key] = [...value];
  }
  const properties = {};
  for (const [objId, propMap] of tree.properties) {
    const objProps = {};
    for (const [propName, propValue] of propMap) {
      objProps[propName] = serializePropertyValue(propValue);
    }
    properties[objId] = objProps;
  }
  return { parents, attributes, properties };
}
function deserializeTreeState(data) {
  let parents = PersistentMap.empty();
  for (const [key, value] of Object.entries(data.parents)) {
    parents = parents.set(key, value);
  }
  let attributes = PersistentMap.empty();
  for (const [key, value] of Object.entries(data.attributes)) {
    attributes = attributes.set(key, PersistentSet.fromValues(value));
  }
  let properties = PersistentMap.empty();
  for (const [objId, objProps] of Object.entries(data.properties)) {
    const entries = [];
    for (const [propName, spv] of Object.entries(objProps)) {
      entries.push([propName, deserializePropertyValue(spv)]);
    }
    properties = properties.set(objId, PersistentMap.fromEntries(entries));
  }
  const childrenBuilt = /* @__PURE__ */ new Map();
  for (const [objId, parentId] of parents) {
    if (parentId !== "nothing") {
      const existing = childrenBuilt.get(parentId);
      if (existing !== void 0) {
        existing.push(objId);
      } else {
        childrenBuilt.set(parentId, [objId]);
      }
    }
  }
  let children = PersistentMap.empty();
  let siblings = PersistentMap.empty();
  for (const [parentId, childList] of childrenBuilt) {
    children = children.set(parentId, childList);
    for (let i = 0; i < childList.length - 1; i++) {
      siblings = siblings.set(childList[i], childList[i + 1]);
    }
  }
  return ObjectTreeState.fromData(parents, attributes, properties, children, siblings);
}
function serializeMemoryMap(memoryMap) {
  const result = [];
  for (const [address, arr] of memoryMap) {
    const data = [];
    if (arr.isByteArray) {
      for (let i = 0; i < arr.length; i++) data.push(arr.getByte(i));
    } else {
      for (let i = 0; i < arr.length; i++) data.push(arr.getWord(i));
    }
    result.push({ address, isByte: arr.isByteArray, data });
  }
  return result;
}
function deserializeMemoryMap(data) {
  let map = PersistentMap.emptyNumberKeyed();
  for (const entry of data) {
    const arr = entry.isByte ? InformArray.createByteArrayFromData(entry.address, entry.data) : InformArray.createWordArrayFromData(entry.address, entry.data);
    map = map.set(entry.address, arr);
  }
  return map;
}
export {
  deserializeState,
  deserializeStateFromJson,
  serializeState,
  serializeStateToJson
};
