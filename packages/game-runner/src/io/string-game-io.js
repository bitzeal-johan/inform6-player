import { setWordInArray, setByteAtAddress, setWordAtByteOffset } from "../state/game-state.js";
import { GameQuitError, GameRestartError } from "./exceptions.js";
import {
  ROMAN_STYLE,
  EMPTY_CELL,
  applyStyleName,
  textStyleEquals,
  glkStyleToInform6StyleName
} from "./text-style.js";
class StringGameIO {
  _inputQueue = [];
  _charInputQueue = [];
  _output = [];
  _outputRuns = [];
  _fullTranscript = [];
  _currentWindow = 0;
  _currentStyle = ROMAN_STYLE;
  _readLineCallCount = 0;
  _fallbackLookCount = 0;
  _savedState = null;
  _undoStack = [];
  _justRestored = false;
  // Status (upper) window grid tracking — populated by setCursor + print when
  // the current window is the status window (id = 1). Indexes are 0-based,
  // matching the JS array convention used by ReactGlk.glk_window_move_cursor.
  // Default dimensions match the StubGlk hardcoded glk_window_get_size return
  // values (80×25), so games that read screen size via the Glk API see the
  // same numbers as the grid we expose for assertions.
  static DEFAULT_STATUS_GRID_LINES = 25;
  static DEFAULT_STATUS_GRID_COLUMNS = 80;
  _statusGridLines = 0;
  _statusGridColumns = StringGameIO.DEFAULT_STATUS_GRID_COLUMNS;
  _statusGridCells = [];
  _statusCursorRow = 0;
  _statusCursorColumn = 0;
  /** Get current output (cleared by clear() calls). */
  get output() {
    return this._output;
  }
  /** Get current output as a single string. */
  get outputText() {
    return this._output.join("");
  }
  /**
   * Get current output as a sequence of styled runs. Each run carries the
   * text that was printed while a single style was active; the runs are
   * emitted in print order and coalesced when consecutive prints share the
   * same style. Cleared by clear() in lockstep with _output.
   */
  get outputRuns() {
    return this._outputRuns;
  }
  /** Get full transcript (never cleared). */
  get fullTranscript() {
    return this._fullTranscript.join("");
  }
  /** Queue text inputs for readLine(). */
  queueInput(inputs) {
    for (const input of inputs) {
      this._inputQueue.push(input);
    }
  }
  /** Queue character inputs for readChar(). */
  queueCharInput(chars) {
    for (const ch of chars) {
      this._charInputQueue.push(ch);
    }
  }
  /**
   * Process Inform6 text formatting escape sequences.
   * ^ -> newline, ~ -> quote, @@XX -> character code
   */
  static processInform6Text(text) {
    let result = text.replace(
      /@@(\d{2})/g,
      (_match, code) => String.fromCharCode(parseInt(code, 10))
    );
    result = result.replace(/\^/g, "\n");
    result = result.replace(/~/g, '"');
    return result;
  }
  /**
   * Snapshot of the status (upper) window grid as a 2D array of single-character strings.
   * Returns an empty array if @split_window has not yet been called. Cells outside any
   * write target the default ' ' fill.
   *
   * This legacy projection drops the per-cell style metadata; use
   * `styledStatusGrid` when style information matters to the test.
   */
  get statusGrid() {
    return this._statusGridCells.map((row) => row.map((cell) => cell.char));
  }
  /**
   * Snapshot of the status window grid with full per-cell style metadata.
   * Returns an empty array if @split_window has not yet been called.
   */
  get styledStatusGrid() {
    return this._statusGridCells.map((row) => [...row]);
  }
  get statusGridLines() {
    return this._statusGridLines;
  }
  get statusGridColumns() {
    return this._statusGridColumns;
  }
  writeStatusChar(ch) {
    if (ch === "\n") {
      this._statusCursorRow++;
      this._statusCursorColumn = 0;
      return;
    }
    if (this._statusCursorRow >= 0 && this._statusCursorRow < this._statusGridLines && this._statusCursorColumn >= 0 && this._statusCursorColumn < this._statusGridColumns) {
      this._statusGridCells[this._statusCursorRow][this._statusCursorColumn] = {
        char: ch,
        style: this._currentStyle
      };
    }
    this._statusCursorColumn++;
  }
  appendMainRun(text) {
    if (text.length === 0) return;
    this._output.push(text);
    this._fullTranscript.push(text);
    const last = this._outputRuns.length > 0 ? this._outputRuns[this._outputRuns.length - 1] : null;
    if (last !== null && textStyleEquals(last.style, this._currentStyle)) {
      this._outputRuns[this._outputRuns.length - 1] = { text: last.text + text, style: last.style };
    } else {
      this._outputRuns.push({ text, style: this._currentStyle });
    }
  }
  print(text) {
    const processed = StringGameIO.processInform6Text(text);
    if (this._currentWindow === 1) {
      for (const ch of processed) this.writeStatusChar(ch);
      return;
    }
    this.appendMainRun(processed);
  }
  printChar(charCode) {
    const char = String.fromCharCode(charCode);
    if (this._currentWindow === 1) {
      this.writeStatusChar(char);
      return;
    }
    this.appendMainRun(char);
  }
  printLine(text) {
    const processed = StringGameIO.processInform6Text(text);
    if (this._currentWindow === 1) {
      for (const ch of processed) this.writeStatusChar(ch);
      this._statusCursorRow++;
      this._statusCursorColumn = 0;
      return;
    }
    this.appendMainRun(processed + "\n");
  }
  readLine() {
    this._readLineCallCount++;
    if (this._inputQueue.length === 0) {
      this._fallbackLookCount++;
      if (this._fallbackLookCount > 3) {
        throw new Error(
          `StringGameIO fallback "look" returned ${this._fallbackLookCount} times. Parser retry loop detected. ReadLine called ${this._readLineCallCount} times total.`
        );
      }
      return Promise.resolve("look");
    }
    this._fallbackLookCount = 0;
    return Promise.resolve(this._inputQueue.shift());
  }
  clear() {
    this._output.length = 0;
    this._outputRuns.length = 0;
  }
  /**
   * Set the status-window cursor. Coordinates are 0-based — matching the
   * Glk/JS convention used by ReactGlk.glk_window_move_cursor and the React
   * player's status grid. The TypeScript code generator inserts the 1→0
   * conversion when emitting `@set_cursor` opcodes so this method always
   * receives 0-based indices regardless of whether the source uses the raw
   * opcode or the library's MoveCursor helper.
   */
  setCursor(row, column) {
    this._statusCursorRow = row | 0;
    this._statusCursorColumn = column | 0;
  }
  setWindow(windowId) {
    this._currentWindow = windowId;
  }
  splitWindow(lines) {
    const newLines = Math.max(0, lines | 0);
    const newCells = [];
    for (let r = 0; r < newLines; r++) {
      const row = new Array(this._statusGridColumns).fill(EMPTY_CELL);
      if (r < this._statusGridLines) {
        for (let c = 0; c < Math.min(this._statusGridColumns, this._statusGridCells[r].length); c++) {
          row[c] = this._statusGridCells[r][c];
        }
      }
      newCells.push(row);
    }
    this._statusGridLines = newLines;
    this._statusGridCells = newCells;
    this._statusCursorRow = 0;
    this._statusCursorColumn = 0;
  }
  setColor(_foreground, _background) {
  }
  setFont(_fontId) {
  }
  setStyle(styleName) {
    this._currentStyle = applyStyleName(this._currentStyle, styleName);
  }
  readChar() {
    if (this._charInputQueue.length === 0) {
      throw new Error("No char input available. Use queueCharInput() to provide char input.");
    }
    return Promise.resolve(this._charInputQueue.shift());
  }
  requestRestart() {
    throw new GameRestartError();
  }
  requestSave(state) {
    this._savedState = state;
    return true;
  }
  requestRestore() {
    if (this._savedState === null) {
      return [null, false];
    }
    const state = this._savedState;
    this._savedState = null;
    this._fullTranscript.length = 0;
    this._output.length = 0;
    this._outputRuns.length = 0;
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
  setIOSys(_mode, _rock) {
  }
  _glk = new StubGlk(this);
  get glk() {
    return this._glk;
  }
}
const MAIN_WINDOW_HANDLE = 1;
const STATUS_WINDOW_HANDLE = 2;
const MAIN_STREAM_HANDLE = 100;
class StubGlk {
  _io;
  // Pending line input request state
  _pendingWindow = null;
  _pendingBuffer = null;
  _pendingMaxLen = null;
  // Pending char input request state
  _pendingCharWindow = null;
  _pendingCharRequest = false;
  constructor(io) {
    this._io = io;
  }
  async call(selector, args, state) {
    switch (selector) {
      case 208: {
        if (args.length < 3) {
          throw new Error(`glk_request_line_event called with ${args.length} args, need at least 3`);
        }
        this._pendingWindow = args[0];
        this._pendingBuffer = args[1];
        this._pendingMaxLen = args[2];
        if (this._pendingBuffer === 0) {
          throw new Error("glk_request_line_event called with buffer address 0");
        }
        return [state, 0];
      }
      case 210: {
        this._pendingCharWindow = args.length > 0 ? args[0] : MAIN_WINDOW_HANDLE;
        this._pendingCharRequest = true;
        return [state, 0];
      }
      case 211: {
        this._pendingCharRequest = false;
        this._pendingCharWindow = null;
        return [state, 0];
      }
      case 192: {
        const eventAddr = args.length > 0 ? args[0] : 0;
        if (eventAddr <= 0) {
          throw new Error(`glk_select called with invalid event address: ${eventAddr}`);
        }
        if (this._pendingCharRequest) {
          let charCode;
          try {
            charCode = await this._io.readChar();
          } catch {
            const input = await this._io.readLine();
            charCode = input.length > 0 ? input.charCodeAt(0) : 13;
          }
          let newState = setWordInArray(state, eventAddr, 0, 2);
          newState = setWordInArray(newState, eventAddr, 1, this._pendingCharWindow ?? 0);
          newState = setWordInArray(newState, eventAddr, 2, charCode);
          newState = setWordInArray(newState, eventAddr, 3, 0);
          this._pendingCharRequest = false;
          this._pendingCharWindow = null;
          return [newState, 0];
        }
        if (this._pendingBuffer !== null) {
          const input = await this._io.readLine();
          const maxLen = this._pendingMaxLen ?? 255;
          const inputLen = Math.min(input.length, maxLen);
          let newState = setWordInArray(state, eventAddr, 0, 3);
          newState = setWordInArray(newState, eventAddr, 1, this._pendingWindow ?? 0);
          newState = setWordInArray(newState, eventAddr, 2, inputLen);
          newState = setWordInArray(newState, eventAddr, 3, 0);
          for (let i = 0; i < inputLen; i++) {
            newState = setByteAtAddress(newState, this._pendingBuffer + i, input.charCodeAt(i));
          }
          this._pendingBuffer = null;
          this._pendingWindow = null;
          this._pendingMaxLen = null;
          return [newState, 0];
        }
        throw new Error(
          `glk_select called without prior input request! eventAddr=${eventAddr}`
        );
      }
      case 32:
        return [state, 0];
      case 34:
        return [state, MAIN_WINDOW_HANDLE];
      case 35: {
        const rock = args.length > 4 ? args[4] : 0;
        const handle = rock === 202 ? STATUS_WINDOW_HANDLE : MAIN_WINDOW_HANDLE;
        return [state, handle];
      }
      case 64:
        return [state, 0];
      case 66:
        return [state, 998];
      case 68:
        return [state, 0];
      case 44:
        return [state, MAIN_STREAM_HANDLE];
      case 47: {
        const windowHandle = args.length > 0 ? args[0] : MAIN_WINDOW_HANDLE;
        const ioWindowId = windowHandle === STATUS_WINDOW_HANDLE ? 1 : 0;
        this._io.setWindow(ioWindowId);
        return [state, 0];
      }
      case 42:
        return [state, 0];
      case 134: {
        const styleCode = args.length > 0 ? args[0] : 0;
        const styleName = glkStyleToInform6StyleName(styleCode);
        if (styleName !== null) this._io.setStyle(styleName);
        return [state, 0];
      }
      case 135: {
        const styleCode = args.length > 1 ? args[1] : 0;
        const styleName = glkStyleToInform6StyleName(styleCode);
        if (styleName !== null) this._io.setStyle(styleName);
        return [state, 0];
      }
      case 37: {
        let sizeState = state;
        if (args.length >= 2 && args[1] > 0) {
          sizeState = setWordAtByteOffset(sizeState, args[1], 80);
        }
        if (args.length >= 3 && args[2] > 0) {
          sizeState = setWordAtByteOffset(sizeState, args[2], 25);
        }
        return [sizeState, 0];
      }
      case 4:
      // glk_gestalt
      case 5:
        return [state, 1];
      case 98:
        return [state, 999];
      case 99:
        return [state, 0];
      case 100:
        return [state, 0];
      case 160: {
        const ch = args.length > 0 ? args[0] : 0;
        return [state, ch >= 65 && ch <= 90 ? ch + 32 : ch];
      }
      case 161: {
        const ch = args.length > 0 ? args[0] : 0;
        return [state, ch >= 97 && ch <= 122 ? ch - 32 : ch];
      }
      default:
        return [state, 0];
    }
  }
}
export {
  StringGameIO
};
