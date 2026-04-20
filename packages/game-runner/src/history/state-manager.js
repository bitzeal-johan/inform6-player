import { createGameHistory, pushState, undo } from "./game-history.js";
function createStateManager(maxSteps) {
  return {
    history: createGameHistory(maxSteps),
    savedState: null
  };
}
function saveUndo(manager, currentState) {
  let newHistory = manager.history;
  if (manager.savedState !== null) {
    newHistory = pushState(newHistory, manager.savedState, currentState);
  }
  return [
    { history: newHistory, savedState: currentState },
    0
  ];
}
function restoreUndo(manager, currentState) {
  if (manager.savedState === null) {
    return [null, manager, 1];
  }
  const historyWithCurrent = pushState(manager.history, manager.savedState, currentState);
  const undoResult = undo(historyWithCurrent, currentState);
  if (undoResult === null) {
    return [null, manager, 1];
  }
  return [
    undoResult.state,
    { history: undoResult.history, savedState: undoResult.state },
    -1
  ];
}
export {
  createStateManager,
  restoreUndo,
  saveUndo
};
