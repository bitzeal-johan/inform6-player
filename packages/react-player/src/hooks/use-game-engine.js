import { useState, useEffect, useCallback, useRef } from "react";
import {
  ROMAN_STYLE,
  EMPTY_CELL,
  applyStyleName,
  textStyleEquals,
  GameQuitError,
  GameRestartError,
  UndoRestoredError,
  populateZMachineHeader
} from "@inform6sharp/game-runner";
import { ReactGameIO } from "../io/react-game-io.js";
import { createGameStore, SLOT_AUTO, SLOT_MANUAL_DEFAULT } from "../persistence/game-store.js";
function createEmptyGrid(lines, columns) {
  const cells = [];
  for (let row = 0; row < lines; row++) {
    cells.push(new Array(columns).fill(EMPTY_CELL));
  }
  return cells;
}
function appendToBuffer(state, text) {
  if (text.length === 0) return;
  const last = state.textBuffer.length > 0 ? state.textBuffer[state.textBuffer.length - 1] : null;
  if (last !== null && textStyleEquals(last.style, state.currentStyle)) {
    state.textBuffer[state.textBuffer.length - 1] = { text: last.text + text, style: last.style };
  } else {
    state.textBuffer.push({ text, style: state.currentStyle });
  }
}
function flushTextBuffer(state) {
  if (state.textBuffer.length > 0) {
    state.transcript.push({ kind: "text", runs: state.textBuffer });
    state.textBuffer = [];
  }
}
function processEvents(events, prevTranscript, prevGrid, prevStyle) {
  const state = {
    currentWindow: 0,
    cursorRow: 0,
    cursorColumn: 0,
    currentStyle: prevStyle,
    transcript: [...prevTranscript],
    statusGrid: prevGrid,
    textBuffer: []
  };
  for (const event of events) {
    switch (event.kind) {
      case "setWindow":
        if (state.currentWindow === 0) flushTextBuffer(state);
        state.currentWindow = event.windowId;
        break;
      case "splitWindow": {
        const newCells = createEmptyGrid(event.lines, state.statusGrid.columns);
        for (let r = 0; r < Math.min(event.lines, state.statusGrid.lines); r++) {
          for (let c = 0; c < state.statusGrid.columns; c++) {
            newCells[r][c] = state.statusGrid.cells[r][c];
          }
        }
        state.statusGrid = { lines: event.lines, columns: state.statusGrid.columns, cells: newCells };
        break;
      }
      case "setCursor":
        state.cursorRow = event.row;
        state.cursorColumn = event.column;
        break;
      case "clear":
        if (state.currentWindow === 0) {
          flushTextBuffer(state);
        } else {
          state.statusGrid = {
            lines: state.statusGrid.lines,
            columns: state.statusGrid.columns,
            cells: createEmptyGrid(state.statusGrid.lines, state.statusGrid.columns)
          };
          state.cursorRow = 0;
          state.cursorColumn = 0;
        }
        state.currentStyle = ROMAN_STYLE;
        break;
      case "print":
        if (state.currentWindow === 0) {
          appendToBuffer(state, event.text);
        } else {
          writeToStatusGrid(state, event.text);
        }
        break;
      case "printChar":
        if (state.currentWindow === 0) {
          appendToBuffer(state, String.fromCharCode(event.charCode));
        } else {
          writeToStatusGrid(state, String.fromCharCode(event.charCode));
        }
        break;
      case "printLine":
        if (state.currentWindow === 0) {
          appendToBuffer(state, event.text + "\n");
        } else {
          writeToStatusGrid(state, event.text);
          state.cursorRow++;
          state.cursorColumn = 0;
        }
        break;
      case "setStyle":
        flushTextBuffer(state);
        state.currentStyle = applyStyleName(state.currentStyle, event.styleName);
        break;
      // Color/font events — ignored for now (Devours doesn't use them,
      // and Inform6 doesn't expose them through the `style` statement).
      case "setColor":
      case "setFont":
        break;
    }
  }
  flushTextBuffer(state);
  return {
    transcript: state.transcript,
    statusGrid: state.statusGrid,
    currentStyle: state.currentStyle
  };
}
function writeToStatusGrid(state, text) {
  const { cells, lines, columns } = state.statusGrid;
  for (const ch of text) {
    if (ch === "\n") {
      state.cursorRow++;
      state.cursorColumn = 0;
      continue;
    }
    if (state.cursorRow >= 0 && state.cursorRow < lines && state.cursorColumn >= 0 && state.cursorColumn < columns) {
      cells[state.cursorRow][state.cursorColumn] = { char: ch, style: state.currentStyle };
    }
    state.cursorColumn++;
  }
}
function useGameEngine(game, gameId, terminal, seed) {
  const [status, setStatus] = useState("loading");
  const [transcript, setTranscript] = useState([]);
  const [statusGrid, setStatusGrid] = useState({
    lines: 0,
    columns: terminal.columns,
    cells: []
  });
  const [inputRequest, setInputRequest] = useState({ kind: "none" });
  const [recentOutput, setRecentOutput] = useState([]);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState(null);
  const ioRef = useRef(null);
  const stateRef = useRef(null);
  const storeRef = useRef(null);
  const startedRef = useRef(false);
  const statusGridRef = useRef(statusGrid);
  const currentStyleRef = useRef(ROMAN_STYLE);
  const transcriptRef = useRef([]);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const io = new ReactGameIO(terminal);
    ioRef.current = io;
    const store = createGameStore();
    storeRef.current = store;
    io.setFlushCallback((events, request, latestState) => {
      setTranscript((prev) => {
        const result = processEvents(events, prev, statusGridRef.current, currentStyleRef.current);
        statusGridRef.current = result.statusGrid;
        currentStyleRef.current = result.currentStyle;
        setStatusGrid(result.statusGrid);
        if (latestState !== null && request.kind === "line") {
          const maxTranscriptEntries = 50;
          const trimmed = result.transcript.length > maxTranscriptEntries ? result.transcript.slice(-maxTranscriptEntries) : result.transcript;
          storeRef.current?.saveBundle(gameId, game.version, SLOT_AUTO, latestState, trimmed).catch(() => {
          });
        }
        transcriptRef.current = result.transcript;
        return result.transcript;
      });
      setInputRequest(request);
      setRecentOutput(events);
      setStatus(request.kind === "none" ? "running" : "waitingForInput");
      if (latestState !== null) {
        stateRef.current = latestState;
      }
      setGameState(stateRef.current);
    });
    runGameLoop(game, io, store, gameId, seed);
    async function runGameLoop(gameModule, gameIo, gameStore, id, randomSeed) {
      try {
        let state = await gameModule.initialize(gameIo, randomSeed);
        stateRef.current = state;
        gameIo.setManualSaveCallback((savedState) => {
          const currentTranscript = transcriptRef.current;
          const maxTranscriptEntries = 50;
          const trimmed = currentTranscript.length > maxTranscriptEntries ? currentTranscript.slice(-maxTranscriptEntries) : [...currentTranscript];
          gameStore.saveBundle(id, gameModule.version, SLOT_MANUAL_DEFAULT, savedState, trimmed).catch(() => {
          });
        });
        try {
          try {
            const manualBundle = await gameStore.loadBundle(id, gameModule.version, SLOT_MANUAL_DEFAULT, state.definition);
            if (manualBundle !== null) {
              gameIo.setManualSaveState(manualBundle.state);
            }
          } catch {
          }
          const bundle = await gameStore.loadBundle(id, gameModule.version, SLOT_AUTO, state.definition);
          if (bundle !== null) {
            gameIo.setPendingRestore(bundle.state);
            gameIo.queueInput(["restore"]);
            gameIo.setSuppressOutput(true);
            if (bundle.transcript.length > 0) {
              transcriptRef.current = bundle.transcript;
              setTranscript(bundle.transcript);
            }
          }
        } catch {
        }
        state = populateZMachineHeader(state, terminal.rows, terminal.columns);
        stateRef.current = state;
        setStatus("running");
        await executeGameLoop(state, gameModule, gameIo);
      } catch (err) {
        if (err instanceof GameQuitError) {
          setStatus("finished");
        } else if (err instanceof GameRestartError) {
          handleRestart(gameModule, gameIo, gameStore, id, randomSeed);
        } else {
          setError(err instanceof Error ? err.message : String(err));
          setStatus("error");
        }
      }
    }
    async function executeGameLoop(initialState, gameModule, gameIo) {
      let state = initialState;
      let skipPrologue = false;
      while (true) {
        try {
          while (true) {
            const [newState] = await gameModule.main(state, gameIo, skipPrologue);
            skipPrologue = false;
            state = newState;
            stateRef.current = state;
          }
        } catch (e) {
          if (e instanceof UndoRestoredError) {
            state = e.restoredState;
            stateRef.current = state;
            skipPrologue = true;
            continue;
          }
          throw e;
        }
      }
    }
    function handleRestart(gameModule, gameIo, gameStore, id, randomSeed) {
      startedRef.current = false;
      transcriptRef.current = [];
      setTranscript([]);
      setStatusGrid({ lines: 0, columns: terminal.columns, cells: [] });
      currentStyleRef.current = ROMAN_STYLE;
      setStatus("loading");
      gameStore.deleteAllSlots(id, gameModule.version).catch(() => {
      });
      runGameLoop(gameModule, gameIo, gameStore, id, randomSeed);
    }
  }, [game, gameId, terminal, seed]);
  const submitLine = useCallback((input) => {
    const io = ioRef.current;
    if (io === null) return;
    setTranscript((prev) => {
      const updated = [
        ...prev,
        { kind: "input", runs: [{ text: input, style: ROMAN_STYLE }] }
      ];
      transcriptRef.current = updated;
      return updated;
    });
    setInputRequest({ kind: "none" });
    setStatus("running");
    io.submitLine(input);
  }, []);
  const submitChar = useCallback((charCode) => {
    const io = ioRef.current;
    if (io === null) return;
    setInputRequest({ kind: "none" });
    setStatus("running");
    io.submitChar(charCode);
  }, []);
  return {
    status,
    transcript,
    statusGrid,
    inputRequest,
    recentOutput,
    error,
    gameState,
    submitLine,
    submitChar
  };
}
export {
  useGameEngine
};
