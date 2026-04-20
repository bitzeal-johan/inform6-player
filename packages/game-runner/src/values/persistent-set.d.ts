/**
 * Immutable persistent set backed by PersistentMap<V, true>.
 * O(log32 N) add/delete/has with structural sharing.
 * Structurally compatible with ReadonlySet<V>.
 */
export declare class PersistentSet<V extends string | number> {
    private readonly _map;
    private constructor();
    static empty<V extends string>(): PersistentSet<V>;
    static fromValues<V extends string>(values: Iterable<V>): PersistentSet<V>;
    get size(): number;
    has(value: V): boolean;
    /** Returns a new PersistentSet with the value added. Returns `this` if already present. */
    add(value: V): PersistentSet<V>;
    /** Returns a new PersistentSet with the value removed. Returns `this` if not present. */
    delete(value: V): PersistentSet<V>;
    values(): IterableIterator<V>;
    keys(): IterableIterator<V>;
    entries(): IterableIterator<[V, V]>;
    forEach(callbackfn: (value: V, value2: V, set: PersistentSet<V>) => void, thisArg?: unknown): void;
    [Symbol.iterator](): IterableIterator<V>;
    get [Symbol.toStringTag](): string;
    union<U>(other: ReadonlySetLike<U>): Set<V | U>;
    intersection<U>(other: ReadonlySetLike<U>): Set<V & U>;
    difference<U>(other: ReadonlySetLike<U>): Set<V>;
    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<V | U>;
    isSubsetOf(other: ReadonlySetLike<unknown>): boolean;
    isSupersetOf(other: ReadonlySetLike<unknown>): boolean;
    isDisjointFrom(other: ReadonlySetLike<unknown>): boolean;
    /** Cast to ReadonlySet for use in APIs that expect it. */
    asReadonlySet(): ReadonlySet<V>;
}
