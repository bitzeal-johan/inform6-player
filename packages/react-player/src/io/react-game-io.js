import {
  GameQuitError,
  GameRestartError
} from "@inform6sharp/game-runner";
import { ReactGlk } from "./react-glk.js";
function processInform6Text(text) {
  let result = text.replace(
    /@@(\d{2})/g,
    (_match, code) => String.fromCharCode(parseInt(code, 10))
  );
  result = result.replace(/\^/g, "\n");
  result = result.replace(/~/g, '"');
  return result;
}
class ReactGameIO {
  _eventBuffer = [];
  _pendingInput = null;
  _flushCallback = null;
  _glk;
  // Undo state
  _undoStack = [];
  _justRestored = false;
  // Save/restore state (manual slot)
  _manualSaveState = null;
  _saveToStore = null;
  // Pending restore state — used for auto-restore on startup
  _pendingRestore = null;
  // Most recent game state (set by Glk before readLine/readChar)
  _latestGameState = null;
  // Input queue: pre-loaded commands consumed before blocking for user input
  _inputQueue = [];
  // Output suppression: when true, output methods skip buffering
  _suppressOutput = false;
  constructor(terminal) {
    this._glk = new ReactGlk(this, terminal);
  }
  /** Set the callback invoked on flush (when game needs input). */
  setFlushCallback(callback) {
    this._flushCallback = callback;
  }
  /** Called by the Glk layer to report the current game state before input. */
  setCurrentGameState(state) {
    this._latestGameState = state;
  }
  /** Queue commands to be consumed by readLine before blocking for user input. */
  queueInput(inputs) {
    for (const input of inputs) this._inputQueue.push(input);
  }
  /** Enable or disable output suppression (used during restore init phase). */
  setSuppressOutput(value) {
    this._suppressOutput = value;
  }
  /** Pre-load the manual save slot from IndexedDB (called by the hook on startup). */
  setManualSaveState(state) {
    this._manualSaveState = state;
  }
  /** Set the callback for persisting manual saves to IndexedDB (fire-and-forget). */
  setManualSaveCallback(cb) {
    this._saveToStore = cb;
  }
  /** Set a state for the next requestRestore() call (used for auto-restore on startup). */
  setPendingRestore(state) {
    this._pendingRestore = state;
  }
  // --- Output methods (synchronous, buffer events) ---
  print(text) {
    if (this._suppressOutput) return;
    const processed = processInform6Text(text);
    this._eventBuffer.push({ kind: "print", text: processed });
  }
  printChar(charCode) {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "printChar", charCode });
  }
  printLine(text) {
    if (this._suppressOutput) return;
    const processed = processInform6Text(text);
    this._eventBuffer.push({ kind: "printLine", text: processed });
  }
  clear() {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "clear" });
  }
  setCursor(row, column) {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "setCursor", row, column });
  }
  setWindow(windowId) {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "setWindow", windowId });
  }
  splitWindow(lines) {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "splitWindow", lines });
  }
  setColor(foreground, background) {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "setColor", foreground, background });
  }
  setFont(fontId) {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "setFont", fontId });
  }
  setStyle(styleName) {
    if (this._suppressOutput) return;
    this._eventBuffer.push({ kind: "setStyle", styleName });
  }
  setIOSys(_mode, _rock) {
  }
  // --- Blocking input methods ---
  readLine() {
    if (this._inputQueue.length > 0) {
      return Promise.resolve(this._inputQueue.shift());
    }
    if (this._suppressOutput) {
      this._suppressOutput = false;
      this._eventBuffer = [];
    }
    this.flush({ kind: "line" });
    return new Promise((resolve) => {
      this._pendingInput = { kind: "line", resolve };
    });
  }
  readChar() {
    this.flush({ kind: "char" });
    return new Promise((resolve) => {
      this._pendingInput = { kind: "char", resolve };
    });
  }
  // --- Input submission (called by React components) ---
  submitLine(input) {
    if (this._pendingInput?.kind !== "line") {
      throw new Error("submitLine called without pending line input request");
    }
    const { resolve } = this._pendingInput;
    this._pendingInput = null;
    resolve(input);
  }
  submitChar(charCode) {
    if (this._pendingInput?.kind !== "char") {
      throw new Error("submitChar called without pending char input request");
    }
    const { resolve } = this._pendingInput;
    this._pendingInput = null;
    resolve(charCode);
  }
  // --- Game control ---
  requestRestart() {
    throw new GameRestartError();
  }
  requestSave(state) {
    this._manualSaveState = state;
    this._saveToStore?.(state);
    return true;
  }
  requestRestore() {
    const state = this._pendingRestore ?? this._manualSaveState;
    if (state === null) {
      return [null, false];
    }
    this._pendingRestore = null;
    this._eventBuffer = [];
    return [state, true];
  }
  requestQuit() {
    throw new GameQuitError();
  }
  saveUndo(currentState) {
    if (this._justRestored) {
      this._justRestored = false;
      return -1;
    }
    this._undoStack.push(currentState);
    return 0;
  }
  restoreUndo(_currentState) {
    if (this._undoStack.length === 0) {
      return [null, 1];
    }
    const restored = this._undoStack.pop();
    this._justRestored = true;
    this._inputQueue.unshift("look");
    return [restored, 0];
  }
  // --- Glk subsystem ---
  get glk() {
    return this._glk;
  }
  // --- Internal ---
  /** Flush buffered events to the React callback. */
  flush(inputRequest) {
    const events = this._eventBuffer;
    this._eventBuffer = [];
    this._flushCallback?.(events, inputRequest, this._latestGameState);
  }
}
export {
  ReactGameIO
};
