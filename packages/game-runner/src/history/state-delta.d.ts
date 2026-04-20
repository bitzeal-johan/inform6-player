import { type GameState } from '../state/game-state.js';
import { type PropertyValue } from '../values/property-value.js';
/**
 * Represents changes to a single object.
 */
export interface ObjectDelta {
    readonly parentChange: string | null;
    readonly addedAttributes: ReadonlySet<string>;
    readonly removedAttributes: ReadonlySet<string>;
    readonly propertyChanges: ReadonlyMap<string, PropertyValue | null>;
}
/**
 * Represents the difference between two GameState instances.
 * Used for efficient undo/redo. memoryMap/dataStack are NOT diffed
 * (same approach as C# — they share references via structural sharing).
 */
export interface StateDelta {
    readonly turnDelta: number | null;
    readonly scoreDelta: number | null;
    readonly randomSeedChange: number | null;
    readonly objectChanges: ReadonlyMap<string, ObjectDelta>;
    readonly globalChanges: ReadonlyMap<string, PropertyValue | null>;
}
export declare function isStateDeltaEmpty(d: StateDelta): boolean;
/** Compute the delta from one state to another. */
export declare function computeStateDelta(from: GameState, to: GameState): StateDelta;
/** Apply a delta to a state, producing a new state. */
export declare function applyStateDelta(state: GameState, delta: StateDelta): GameState;
