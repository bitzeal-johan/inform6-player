import { type GameDefinition } from './game-definition.js';
import { ObjectTreeState } from './object-tree-state.js';
import { Variables } from './variables.js';
import { type InformValue } from '../values/inform-value.js';
import { type PropertyValue } from '../values/property-value.js';
import { InformArray } from '../values/inform-array.js';
import { PersistentMap } from '../values/persistent-map.js';
import { type GameIO } from '../io/game-io.js';
/** Core game state. All mutations return new instances. */
export interface GameState {
    readonly definition: GameDefinition;
    readonly treeState: ObjectTreeState;
    readonly globals: Variables;
    readonly turn: number;
    readonly score: number;
    readonly randomSeed: number;
    readonly memoryMap: PersistentMap<number, InformArray>;
    readonly dataStack: readonly number[];
}
/** Create an initial game state with defaults. */
export declare function createInitialGameState(definition?: Partial<GameDefinition>, _io?: GameIO, randomSeed?: number): GameState;
/** Set a global variable to an integer value. Returns a new GameState. */
export declare function setGlobal(state: GameState, name: string, value: number): GameState;
/** Get a global variable's integer value. Returns 0 if not set. */
export declare function getGlobal(state: GameState, name: string): number;
/** Set a global variable to a PropertyValue. Returns a new GameState. */
export declare function setGlobalProp(state: GameState, name: string, value: PropertyValue): GameState;
/** Get a global variable's PropertyValue. Returns null if not set. */
export declare function getGlobalProp(state: GameState, name: string): PropertyValue | null;
/** Convert a string object ID to its numeric ID using the definition's objectIds mapper. */
export declare function toStringId(state: GameState, iv: InformValue): string;
/** Get parent object as InformValue. */
export declare function getParent(state: GameState, objIv: InformValue): InformValue;
/** Get first child object as InformValue (lowest object number). */
export declare function getChild(state: GameState, objIv: InformValue): InformValue;
/** Get next sibling object as InformValue (next by object number). */
export declare function getSibling(state: GameState, objIv: InformValue): InformValue;
/** Register an object in the tree (for initialization). Returns new GameState. */
export declare function registerObject(state: GameState, objId: string): GameState;
/** Move an object to a new parent. Returns new GameState. */
export declare function moveObject(state: GameState, objIv: InformValue, destIv: InformValue): GameState;
/** Remove an object from its parent. Returns new GameState. */
export declare function removeFromParent(state: GameState, objIv: InformValue): GameState;
/** Set an attribute on an object. Returns a new GameState. */
export declare function setAttribute(state: GameState, objIv: InformValue, attrName: string): GameState;
/** Remove an attribute from an object. Returns a new GameState. */
export declare function clearAttribute(state: GameState, objIv: InformValue, attrName: string): GameState;
/** Check if an object has an attribute. */
export declare function hasAttribute(state: GameState, objIv: InformValue, attrName: string): boolean;
/** Check if an object has an attribute by numeric index. */
export declare function hasAttributeByIndex(state: GameState, objIv: InformValue, attrIndex: number): boolean;
/** Get a property value as an integer. Returns 0 if not found. */
export declare function safeGetProperty(state: GameState, objIv: InformValue, propName: string): number;
/** Get a property value preserving type (returns as InformValue). */
export declare function getPropertyAsInformValue(state: GameState, objIv: InformValue, propName: string): InformValue;
/** Set a property value on an object. Returns a new GameState. */
export declare function setProperty(state: GameState, objStringId: string, propName: string, value: PropertyValue): GameState;
/** Check if an object provides a property. */
export declare function provides(state: GameState, objIv: InformValue, propName: string): boolean;
/** Check if an object is in a container. */
export declare function isIn(state: GameState, objIv: InformValue, containerIv: InformValue): boolean;
/** Get the property address of an object's property. */
export declare function getPropertyAddress(state: GameState, objIv: InformValue, propName: string): InformValue;
/** Get the length of an object's property (in bytes). */
export declare function getPropertyLength(state: GameState, objIv: InformValue, propName: string): number;
/** Check if an object is an instance of a class (including inherited classes). */
export declare function isOfClass(state: GameState, objIv: InformValue, className: string): boolean;
/**
 * Create a new object instance from a class template (Inform6 Class.create()).
 * Allocates a new object number, copies class properties/attributes, and registers in tree.
 * Returns [new GameState, new object number].
 */
export declare function classCreate(state: GameState, className: string): [GameState, number];
/** Push a value onto the data stack. Returns a new GameState. */
export declare function pushStack(state: GameState, value: number): GameState;
/** Pop a value from the data stack. Returns [new GameState, popped value]. */
export declare function popStack(state: GameState): [GameState, number];
/** Generate a pseudo-random number. Returns [new GameState, random value]. */
export declare function nextRandom(state: GameState, max: number): [GameState, number];
/** Get word value at index from a property's multi-value list. */
export declare function getPropertyWordAt(state: GameState, objIv: InformValue, propName: string, index: number): number;
/** Get byte value at index from a property's multi-value list.
 * Byte access on property addresses indexes values sequentially. */
export declare function getPropertyByteAt(state: GameState, objIv: InformValue, propName: string, index: number): number;
/** Set word value at index in a property's multi-value list. Returns new GameState. */
export declare function setPropertyWordAt(state: GameState, objIv: InformValue, propName: string, index: number, value: number): GameState;
/** Set byte value at index in a property's multi-value list. Returns new GameState. */
export declare function setPropertyByteAt(state: GameState, objIv: InformValue, propName: string, index: number, value: number): GameState;
/** Look up an InformArray by its memory address. */
export declare function getArrayByAddress(state: GameState, address: number): InformArray | undefined;
/**
 * Read a word from a raw memory address with word index.
 * Handles computed addresses like (base+offset)-->idx where the address
 * falls within a known array but doesn't match its base address exactly.
 * Returns undefined if the address doesn't belong to any array.
 */
export declare function getWordAtRawAddress(state: GameState, rawAddr: number, wordIdx: number): number | undefined;
/**
 * Read a byte from a raw memory address with byte index.
 * Handles computed addresses like (base+offset)->idx.
 * Returns undefined if the address doesn't belong to any array.
 */
export declare function getByteAtRawAddress(state: GameState, rawAddr: number, byteIdx: number): number | undefined;
/** Set a byte in an array at the given address and index. Returns a new GameState. */
export declare function setByteInArray(state: GameState, address: number, index: number, value: number): GameState;
/** Set a word in an array at the given address and index. Returns a new GameState. */
export declare function setWordInArray(state: GameState, address: number, index: number, value: number): GameState;
/** Set a byte at an absolute byte address in memory. Returns a new GameState. */
export declare function setByteAtAddress(state: GameState, byteAddress: number, value: number): GameState;
/** Set a word at an absolute byte address in memory. Returns a new GameState. */
export declare function setWordAtByteOffset(state: GameState, byteAddress: number, value: number): GameState;
