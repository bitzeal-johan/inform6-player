import { type GameState } from '../state/game-state.js';
import { type StateDelta } from './state-delta.js';
/**
 * Delta-based game history for efficient undo/redo.
 * Stores deltas between consecutive states rather than full snapshots.
 */
export interface GameHistory {
    /** Stack of deltas from earlier states to later states (for undo). */
    readonly undoStack: readonly StateDelta[];
    /** Stack of deltas for redo (cleared when a new action is taken). */
    readonly redoStack: readonly StateDelta[];
    /** Maximum number of undo steps to retain. */
    readonly maxSteps: number;
}
/** Create an empty history. */
export declare function createGameHistory(maxSteps?: number): GameHistory;
/**
 * Record a state transition. Computes the delta from `before` to `after`
 * and pushes it onto the undo stack. Clears the redo stack.
 */
export declare function pushState(history: GameHistory, before: GameState, after: GameState): GameHistory;
/**
 * Undo one step: pop the last delta from the undo stack, compute its reverse,
 * apply the reverse to `currentState`, and push the forward delta to redo.
 * Returns null if there's nothing to undo.
 */
export declare function undo(history: GameHistory, currentState: GameState): {
    state: GameState;
    history: GameHistory;
} | null;
/**
 * Redo one step: pop from redo stack, apply to current state, push to undo.
 * Returns null if there's nothing to redo.
 */
export declare function redo(history: GameHistory, currentState: GameState): {
    state: GameState;
    history: GameHistory;
} | null;
