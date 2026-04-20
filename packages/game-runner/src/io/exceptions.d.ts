/**
 * Thrown when the game requests a quit.
 * Carries the final game state so callers can serialize it.
 */
export declare class GameQuitError extends Error {
    readonly finalState: unknown;
    constructor(state?: unknown);
}
/**
 * Thrown when the game requests a restart.
 */
export declare class GameRestartError extends Error {
    constructor();
}
/**
 * Thrown when @restoreundo succeeds.
 * In real Glulx, successful @restoreundo transfers execution back to the
 * @saveundo point (it never continues past @restoreundo). We simulate this
 * by throwing an exception that unwinds the call stack back to the main
 * game loop, which then re-enters Game.main with the restored state.
 * The next call to @saveundo (via io.saveUndo) will return -1 to signal
 * that an undo just occurred, letting the library print "Previous turn undone."
 */
export declare class UndoRestoredError extends Error {
    readonly restoredState: unknown;
    constructor(state: unknown);
}
