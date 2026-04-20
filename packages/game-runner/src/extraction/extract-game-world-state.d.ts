import { type GameState } from '../state/game-state.js';
import { type GameWorldState } from './game-world-state.js';
/**
 * Extract a structured GameWorldState from a GameState.
 * Reads globals, object tree, and definitions to build a UI-friendly snapshot.
 */
export declare function extractGameWorldState(state: GameState): GameWorldState;
