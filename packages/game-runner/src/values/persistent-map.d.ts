/**
 * Immutable persistent map backed by a HAMT.
 * O(log32 N) get/set/delete with structural sharing.
 * Structurally compatible with ReadonlyMap<K, V>.
 */
export declare class PersistentMap<K extends string | number, V> {
    private readonly _root;
    private readonly _size;
    private readonly _hashFn;
    private constructor();
    static empty<V>(): PersistentMap<string, V>;
    static emptyNumberKeyed<V>(): PersistentMap<number, V>;
    static fromEntries<V>(entries: Iterable<[string, V]>): PersistentMap<string, V>;
    static fromNumberEntries<V>(entries: Iterable<[number, V]>): PersistentMap<number, V>;
    get size(): number;
    get(key: K): V | undefined;
    has(key: K): boolean;
    /** Returns a new PersistentMap with the key set. Returns `this` if value is unchanged. */
    set(key: K, value: V): PersistentMap<K, V>;
    /** Returns a new PersistentMap with the key removed. Returns `this` if key was not present. */
    delete(key: K): PersistentMap<K, V>;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    forEach(callbackfn: (value: V, key: K, map: PersistentMap<K, V>) => void, thisArg?: unknown): void;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    get [Symbol.toStringTag](): string;
    /** Cast to ReadonlyMap for use in APIs that expect it. */
    asReadonlyMap(): ReadonlyMap<K, V>;
}
