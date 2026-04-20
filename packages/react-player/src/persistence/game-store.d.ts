import { type GameState } from '@inform6sharp/game-runner';
import { type TranscriptEntry } from '../hooks/use-game-engine.js';
/** Well-known slot identifiers. */
export declare const SLOT_AUTO = "auto";
export declare const SLOT_MANUAL_DEFAULT = "save-1";
/**
 * Returned when loading a save.
 */
export interface SaveBundle {
    readonly state: GameState;
    readonly transcript: TranscriptEntry[];
    readonly savedAt: string;
}
/**
 * Abstraction over IndexedDB for persisting game state and transcript.
 * Use createGameStore() to get a concrete implementation.
 */
export interface GameStore {
    saveBundle(gameId: string, gameVersion: string, slotId: string, state: GameState, transcript: readonly TranscriptEntry[]): Promise<void>;
    loadBundle(gameId: string, gameVersion: string, slotId: string, definition: GameState['definition']): Promise<SaveBundle | null>;
    deleteSlot(gameId: string, gameVersion: string, slotId: string): Promise<void>;
    deleteAllSlots(gameId: string, gameVersion: string): Promise<void>;
}
/**
 * Creates a GameStore backed by IndexedDB.
 */
export declare function createGameStore(): GameStore;
