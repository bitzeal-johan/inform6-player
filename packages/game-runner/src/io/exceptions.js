class GameQuitError extends Error {
  finalState;
  constructor(state) {
    super("Game quit requested");
    this.name = "GameQuitError";
    this.finalState = state ?? null;
  }
}
class GameRestartError extends Error {
  constructor() {
    super("Game restart requested");
    this.name = "GameRestartError";
  }
}
class UndoRestoredError extends Error {
  restoredState;
  constructor(state) {
    super("Undo restored");
    this.name = "UndoRestoredError";
    this.restoredState = state;
  }
}
export {
  GameQuitError,
  GameRestartError,
  UndoRestoredError
};
