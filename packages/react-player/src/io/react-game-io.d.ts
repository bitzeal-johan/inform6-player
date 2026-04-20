import { type GameIO, type Glk, type GameState, type OutputEvent, type InputRequest } from '@inform6sharp/game-runner';
import { type ResolvedTerminal } from '../types/terminal-config.js';
/**
 * Callback invoked when the game produces output and needs input.
 * The React hook uses this to update component state.
 * The optional gameState is the most recent state passed to saveUndo.
 */
export type FlushCallback = (events: readonly OutputEvent[], inputRequest: InputRequest, gameState: GameState | null) => void;
/**
 * GameIO implementation for the React player.
 *
 * Output methods collect OutputEvent[] into a buffer.
 * When readLine() or readChar() is called, the buffer is flushed via the
 * FlushCallback and an unresolved Promise is returned, truly suspending the game.
 * The React component resolves the Promise via submitLine() or submitChar().
 */
export declare class ReactGameIO implements GameIO {
    private _eventBuffer;
    private _pendingInput;
    private _flushCallback;
    private readonly _glk;
    private readonly _undoStack;
    private _justRestored;
    private _manualSaveState;
    private _saveToStore;
    private _pendingRestore;
    private _latestGameState;
    private readonly _inputQueue;
    private _suppressOutput;
    constructor(terminal: ResolvedTerminal);
    /** Set the callback invoked on flush (when game needs input). */
    setFlushCallback(callback: FlushCallback): void;
    /** Called by the Glk layer to report the current game state before input. */
    setCurrentGameState(state: GameState): void;
    /** Queue commands to be consumed by readLine before blocking for user input. */
    queueInput(inputs: string[]): void;
    /** Enable or disable output suppression (used during restore init phase). */
    setSuppressOutput(value: boolean): void;
    /** Pre-load the manual save slot from IndexedDB (called by the hook on startup). */
    setManualSaveState(state: GameState | null): void;
    /** Set the callback for persisting manual saves to IndexedDB (fire-and-forget). */
    setManualSaveCallback(cb: (state: GameState) => void): void;
    /** Set a state for the next requestRestore() call (used for auto-restore on startup). */
    setPendingRestore(state: GameState): void;
    print(text: string): void;
    printChar(charCode: number): void;
    printLine(text: string): void;
    clear(): void;
    setCursor(row: number, column: number): void;
    setWindow(windowId: number): void;
    splitWindow(lines: number): void;
    setColor(foreground: number, background: number): void;
    setFont(fontId: number): void;
    setStyle(styleName: string): void;
    setIOSys(_mode: number, _rock: number): void;
    readLine(): Promise<string>;
    readChar(): Promise<number>;
    submitLine(input: string): void;
    submitChar(charCode: number): void;
    requestRestart(): boolean;
    requestSave(state: GameState): boolean;
    requestRestore(): [GameState | null, boolean];
    requestQuit(): void;
    saveUndo(currentState: GameState): number;
    restoreUndo(_currentState: GameState): [GameState | null, number];
    get glk(): Glk;
    /** Flush buffered events to the React callback. */
    private flush;
}
