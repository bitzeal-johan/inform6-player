import { type GameState } from '../state/game-state.js';
/**
 * Glk I/O subsystem interface for Glulx games.
 * Dispatches Glk function calls by selector ID.
 */
export interface Glk {
    call(selector: number, args: number[], state: GameState): Promise<[GameState, number]>;
}
/**
 * Game I/O interface. Separates I/O concerns from game logic.
 * Implementations: StringGameIO (testing), ReactGameIO (browser).
 *
 * Blocking methods (readLine, readChar, Glk.call) are async — the game
 * suspends at `await` and the JS runtime preserves the full call stack.
 * For testing, StringGameIO returns resolved promises (instant await).
 */
export interface GameIO {
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
    setIOSys(mode: number, rock: number): void;
    readLine(): Promise<string>;
    readChar(): Promise<number>;
    requestRestart(): boolean;
    requestSave(state: GameState): boolean;
    requestRestore(): [GameState | null, boolean];
    requestQuit(): void;
    saveUndo(currentState: GameState): number;
    restoreUndo(currentState: GameState): [GameState | null, number];
    /** Glk subsystem for Glulx games. Null if not supported. */
    readonly glk: Glk | null;
}
