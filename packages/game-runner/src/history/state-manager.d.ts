import { type GameState } from '../state/game-state.js';
import { type GameHistory } from './game-history.js';
/**
 * Glulx-compliant SaveUndo/RestoreUndo manager.
 *
 * SaveUndo: Snapshots the current state for later undo.
 *   Returns 0 on success (Glulx: "save succeeded").
 *
 * RestoreUndo: Restores to the last saved undo point.
 *   Returns [restoredState, -1] on success (Glulx: "restore succeeded").
 *   Returns [null, 1] on failure (no undo available).
 */
export interface StateManager {
    readonly history: GameHistory;
    /** The state at the point saveUndo was last called, if any. */
    readonly savedState: GameState | null;
}
/** Create a new StateManager with optional max undo steps. */
export declare function createStateManager(maxSteps?: number): StateManager;
/**
 * Save the current state for undo. Call this at the start of each turn.
 * Returns [updatedManager, resultCode].
 * resultCode: 0 = save succeeded (Glulx spec).
 */
export declare function saveUndo(manager: StateManager, currentState: GameState): [StateManager, number];
/**
 * Restore to the last undo point.
 * Returns [restoredState, updatedManager, resultCode].
 * resultCode: -1 = restore succeeded, 1 = failed (no undo available).
 */
export declare function restoreUndo(manager: StateManager, currentState: GameState): [GameState | null, StateManager, number];
