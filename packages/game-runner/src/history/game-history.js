import { computeStateDelta, applyStateDelta } from "./state-delta.js";
const DEFAULT_MAX_UNDO_STEPS = 100;
function createGameHistory(maxSteps = DEFAULT_MAX_UNDO_STEPS) {
  return { undoStack: [], redoStack: [], maxSteps };
}
function pushState(history, before, after) {
  const delta = computeStateDelta(before, after);
  let newStack = [...history.undoStack, delta];
  if (newStack.length > history.maxSteps) {
    newStack = newStack.slice(newStack.length - history.maxSteps);
  }
  return {
    undoStack: newStack,
    redoStack: [],
    maxSteps: history.maxSteps
  };
}
function undo(history, currentState) {
  if (history.undoStack.length === 0) return null;
  const undoStack = [...history.undoStack];
  const forwardDelta = undoStack.pop();
  const reverseDelta = reverseStateDelta(forwardDelta);
  const previousState = applyStateDelta(currentState, reverseDelta);
  return {
    state: previousState,
    history: {
      undoStack,
      redoStack: [...history.redoStack, forwardDelta],
      maxSteps: history.maxSteps
    }
  };
}
function redo(history, currentState) {
  if (history.redoStack.length === 0) return null;
  const redoStack = [...history.redoStack];
  const forwardDelta = redoStack.pop();
  const nextState = applyStateDelta(currentState, forwardDelta);
  return {
    state: nextState,
    history: {
      undoStack: [...history.undoStack, forwardDelta],
      redoStack,
      maxSteps: history.maxSteps
    }
  };
}
function reverseStateDelta(d) {
  const objectChanges = /* @__PURE__ */ new Map();
  for (const [objId, objDelta] of d.objectChanges) {
    objectChanges.set(objId, {
      parentChange: objDelta.parentChange,
      // parent reversal handled by applyObjectDelta
      addedAttributes: objDelta.removedAttributes,
      removedAttributes: objDelta.addedAttributes,
      propertyChanges: objDelta.propertyChanges
      // property values are replaced, not diffed
    });
  }
  return {
    turnDelta: d.turnDelta !== null ? -d.turnDelta : null,
    scoreDelta: d.scoreDelta !== null ? -d.scoreDelta : null,
    randomSeedChange: d.randomSeedChange,
    // seed is absolute, not relative
    objectChanges,
    globalChanges: d.globalChanges
    // global values are replaced, not diffed
  };
}
export {
  createGameHistory,
  pushState,
  redo,
  undo
};
