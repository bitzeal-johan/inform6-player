import {
  setWordInArray,
  setByteAtAddress,
  setWordAtByteOffset,
  glkStyleToInform6StyleName
} from "@inform6sharp/game-runner";
const MAIN_WINDOW_HANDLE = 1;
const STATUS_WINDOW_HANDLE = 2;
const MAIN_STREAM_HANDLE = 100;
class ReactGlk {
  _io;
  _terminal;
  // Pending line input request state
  _pendingWindow = null;
  _pendingBuffer = null;
  _pendingMaxLen = null;
  // Pending char input request state
  _pendingCharWindow = null;
  _pendingCharRequest = false;
  constructor(io, terminal) {
    this._io = io;
    this._terminal = terminal;
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
          this._io.setCurrentGameState(state);
          const charCode = await this._io.readChar();
          let newState = setWordInArray(state, eventAddr, 0, 2);
          newState = setWordInArray(newState, eventAddr, 1, this._pendingCharWindow ?? 0);
          newState = setWordInArray(newState, eventAddr, 2, charCode);
          newState = setWordInArray(newState, eventAddr, 3, 0);
          this._pendingCharRequest = false;
          this._pendingCharWindow = null;
          return [newState, 0];
        }
        if (this._pendingBuffer !== null) {
          this._io.setCurrentGameState(state);
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
        if (rock === 202 && args.length > 2) {
          this._io.splitWindow(args[2]);
        }
        return [state, handle];
      }
      case 38: {
        const size = args.length > 2 ? args[2] : 0;
        this._io.splitWindow(size);
        return [state, 0];
      }
      case 43: {
        const col = args.length > 1 ? args[1] : 0;
        const row = args.length > 2 ? args[2] : 0;
        this._io.setCursor(row, col);
        return [state, 0];
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
        this._io.clear();
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
          sizeState = setWordAtByteOffset(sizeState, args[1], this._terminal.columns);
        }
        if (args.length >= 3 && args[2] > 0) {
          sizeState = setWordAtByteOffset(sizeState, args[2], this._terminal.rows);
        }
        return [sizeState, 0];
      }
      case 4:
      // glk_gestalt
      case 5:
        return [state, 1];
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
      case 98:
        return [state, 999];
      case 99:
        return [state, 0];
      default:
        return [state, 0];
    }
  }
}
export {
  ReactGlk
};
