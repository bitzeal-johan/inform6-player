import { propertyValueEquals } from "../values/property-value.js";
function isObjectDeltaEmpty(d) {
  return d.parentChange === null && d.addedAttributes.size === 0 && d.removedAttributes.size === 0 && d.propertyChanges.size === 0;
}
function isStateDeltaEmpty(d) {
  return d.turnDelta === null && d.scoreDelta === null && d.randomSeedChange === null && d.objectChanges.size === 0 && d.globalChanges.size === 0;
}
function computeStateDelta(from, to) {
  return {
    turnDelta: to.turn !== from.turn ? to.turn - from.turn : null,
    scoreDelta: to.score !== from.score ? to.score - from.score : null,
    randomSeedChange: to.randomSeed !== from.randomSeed ? to.randomSeed : null,
    objectChanges: computeObjectChanges(from.treeState, to.treeState),
    globalChanges: computeGlobalChanges(from.globals, to.globals)
  };
}
function computeObjectChanges(from, to) {
  const changes = /* @__PURE__ */ new Map();
  const allIds = /* @__PURE__ */ new Set();
  for (const id of from.parents.keys()) allIds.add(id);
  for (const id of to.parents.keys()) allIds.add(id);
  for (const objId of allIds) {
    const delta = computeObjectDelta(from, to, objId);
    if (!isObjectDeltaEmpty(delta)) {
      changes.set(objId, delta);
    }
  }
  return changes;
}
function computeObjectDelta(from, to, objectId) {
  const fromParent = from.getParent(objectId);
  const toParent = to.getParent(objectId);
  const fromAttrs = from.attributes.get(objectId) ?? /* @__PURE__ */ new Set();
  const toAttrs = to.attributes.get(objectId) ?? /* @__PURE__ */ new Set();
  const fromProps = from.properties.get(objectId) ?? /* @__PURE__ */ new Map();
  const toProps = to.properties.get(objectId) ?? /* @__PURE__ */ new Map();
  const addedAttributes = /* @__PURE__ */ new Set();
  for (const attr of toAttrs) {
    if (!fromAttrs.has(attr)) addedAttributes.add(attr);
  }
  const removedAttributes = /* @__PURE__ */ new Set();
  for (const attr of fromAttrs) {
    if (!toAttrs.has(attr)) removedAttributes.add(attr);
  }
  const propertyChanges = /* @__PURE__ */ new Map();
  for (const [key, value] of toProps) {
    const oldValue = fromProps.get(key);
    if (oldValue === void 0 || !propertyValueEquals(value, oldValue)) {
      propertyChanges.set(key, value);
    }
  }
  for (const key of fromProps.keys()) {
    if (!toProps.has(key)) {
      propertyChanges.set(key, null);
    }
  }
  return {
    parentChange: toParent !== fromParent ? toParent : null,
    addedAttributes,
    removedAttributes,
    propertyChanges
  };
}
function computeGlobalChanges(from, to) {
  const changes = /* @__PURE__ */ new Map();
  for (const [key, value] of to.entries()) {
    const oldValue = from.get(key);
    if (oldValue === null || !propertyValueEquals(value, oldValue)) {
      changes.set(key, value);
    }
  }
  for (const key of from.keys()) {
    if (!to.contains(key)) {
      changes.set(key, null);
    }
  }
  return changes;
}
function applyStateDelta(state, delta) {
  let result = state;
  if (delta.turnDelta !== null) {
    result = { ...result, turn: state.turn + delta.turnDelta };
  }
  if (delta.scoreDelta !== null) {
    result = { ...result, score: state.score + delta.scoreDelta };
  }
  if (delta.randomSeedChange !== null) {
    result = { ...result, randomSeed: delta.randomSeedChange };
  }
  for (const [objId, objDelta] of delta.objectChanges) {
    result = applyObjectDelta(result, objId, objDelta);
  }
  for (const [key, value] of delta.globalChanges) {
    if (value === null) {
      throw new Error(`Variable removal not implemented (attempted to remove global '${key}')`);
    }
    result = { ...result, globals: result.globals.set(key, value) };
  }
  return result;
}
function applyObjectDelta(state, objId, delta) {
  let result = state;
  if (delta.parentChange !== null) {
    if (delta.parentChange === "nothing") {
      result = { ...result, treeState: result.treeState.removeFromParent(objId) };
    } else {
      result = { ...result, treeState: result.treeState.moveObject(objId, delta.parentChange) };
    }
  }
  for (const attr of delta.addedAttributes) {
    result = { ...result, treeState: result.treeState.setAttribute(objId, attr) };
  }
  for (const attr of delta.removedAttributes) {
    result = { ...result, treeState: result.treeState.removeAttribute(objId, attr) };
  }
  for (const [propName, propValue] of delta.propertyChanges) {
    if (propValue !== null) {
      result = { ...result, treeState: result.treeState.setProperty(objId, propName, propValue) };
    }
  }
  return result;
}
export {
  applyStateDelta,
  computeStateDelta,
  isStateDeltaEmpty
};
