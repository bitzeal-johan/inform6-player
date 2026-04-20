import { type GameState } from '../state/game-state.js';
/**
 * Serializable representation of game state.
 * GameDefinition is NOT serialized — it's static and reconstructed from the game code.
 * Only mutable state is saved.
 */
export interface SerializedGameState {
    readonly turn: number;
    readonly score: number;
    readonly randomSeed: number;
    readonly globals: Record<string, SerializedPropertyValue>;
    readonly treeState: SerializedTreeState;
    readonly memoryMap: SerializedMemoryMap;
    readonly dataStack: readonly number[];
}
type SerializedPropertyValue = {
    kind: 'int';
    value: number;
} | {
    kind: 'string';
    value: string;
} | {
    kind: 'dictWord';
    word: string;
} | {
    kind: 'routine';
    routineName: string;
} | {
    kind: 'list';
    values: SerializedPropertyValue[];
};
interface SerializedTreeState {
    readonly parents: Record<string, string>;
    readonly attributes: Record<string, string[]>;
    readonly properties: Record<string, Record<string, SerializedPropertyValue>>;
}
type SerializedMemoryMap = Array<{
    address: number;
    isByte: boolean;
    data: number[];
}>;
/** Serialize mutable game state to a JSON-compatible object. */
export declare function serializeState(state: GameState): SerializedGameState;
/**
 * Deserialize mutable game state, re-attaching the static GameDefinition.
 * The definition must come from the same game code that produced the save.
 */
export declare function deserializeState(data: SerializedGameState, definition: GameState['definition']): GameState;
/** Serialize to JSON string. */
export declare function serializeStateToJson(state: GameState): string;
/** Deserialize from JSON string. */
export declare function deserializeStateFromJson(json: string, definition: GameState['definition']): GameState;
export {};
