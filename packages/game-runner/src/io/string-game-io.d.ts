import { type GameIO, type Glk } from './game-io.js';
import { type GameState } from '../state/game-state.js';
import { type StyledCell, type StyledRun } from './text-style.js';
/**
 * In-memory I/O implementation for testing.
 * Queue-based input, captured output.
 */
export declare class StringGameIO implements GameIO {
    private readonly _inputQueue;
    private readonly _charInputQueue;
    private readonly _output;
    private readonly _outputRuns;
    private readonly _fullTranscript;
    private _currentWindow;
    private _currentStyle;
    private _readLineCallCount;
    private _fallbackLookCount;
    private _savedState;
    private readonly _undoStack;
    private _justRestored;
    private static readonly DEFAULT_STATUS_GRID_LINES;
    private static readonly DEFAULT_STATUS_GRID_COLUMNS;
    private _statusGridLines;
    private _statusGridColumns;
    private _statusGridCells;
    private _statusCursorRow;
    private _statusCursorColumn;
    /** Get current output (cleared by clear() calls). */
    get output(): readonly string[];
    /** Get current output as a single string. */
    get outputText(): string;
    /**
     * Get current output as a sequence of styled runs. Each run carries the
     * text that was printed while a single style was active; the runs are
     * emitted in print order and coalesced when consecutive prints share the
     * same style. Cleared by clear() in lockstep with _output.
     */
    get outputRuns(): readonly StyledRun[];
    /** Get full transcript (never cleared). */
    get fullTranscript(): string;
    /** Queue text inputs for readLine(). */
    queueInput(inputs: string[]): void;
    /** Queue character inputs for readChar(). */
    queueCharInput(chars: number[]): void;
    /**
     * Process Inform6 text formatting escape sequences.
     * ^ -> newline, ~ -> quote, @@XX -> character code
     */
    private static processInform6Text;
    /**
     * Snapshot of the status (upper) window grid as a 2D array of single-character strings.
     * Returns an empty array if @split_window has not yet been called. Cells outside any
     * write target the default ' ' fill.
     *
     * This legacy projection drops the per-cell style metadata; use
     * `styledStatusGrid` when style information matters to the test.
     */
    get statusGrid(): readonly (readonly string[])[];
    /**
     * Snapshot of the status window grid with full per-cell style metadata.
     * Returns an empty array if @split_window has not yet been called.
     */
    get styledStatusGrid(): readonly (readonly StyledCell[])[];
    get statusGridLines(): number;
    get statusGridColumns(): number;
    private writeStatusChar;
    private appendMainRun;
    print(text: string): void;
    printChar(charCode: number): void;
    printLine(text: string): void;
    readLine(): Promise<string>;
    clear(): void;
    /**
     * Set the status-window cursor. Coordinates are 0-based — matching the
     * Glk/JS convention used by ReactGlk.glk_window_move_cursor and the React
     * player's status grid. The TypeScript code generator inserts the 1→0
     * conversion when emitting `@set_cursor` opcodes so this method always
     * receives 0-based indices regardless of whether the source uses the raw
     * opcode or the library's MoveCursor helper.
     */
    setCursor(row: number, column: number): void;
    setWindow(windowId: number): void;
    splitWindow(lines: number): void;
    setColor(_foreground: number, _background: number): void;
    setFont(_fontId: number): void;
    setStyle(styleName: string): void;
    readChar(): Promise<number>;
    requestRestart(): boolean;
    requestSave(state: GameState): boolean;
    requestRestore(): [GameState | null, boolean];
    requestQuit(): void;
    saveUndo(currentState: GameState): number;
    restoreUndo(_currentState: GameState): [GameState | null, number];
    setIOSys(_mode: number, _rock: number): void;
    private readonly _glk;
    get glk(): Glk;
}
