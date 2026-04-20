/**
 * Internal HAMT (Hash Array Mapped Trie) implementation for PersistentMap.
 * Not exported from the package — implementation detail only.
 *
 * Uses 32-bit hashes consumed 5 bits at a time, giving a branching factor of 32
 * and a max depth of 7 (5*7 = 35 > 32). Bitmap compression keeps nodes compact.
 */
/** FNV-1a 32-bit hash for string keys. */
export declare function hashString(key: string): number;
/** Murmur3-style finalizer for number keys (handles sequential integers well). */
export declare function hashNumber(key: number): number;
export declare const enum NodeKind {
    Leaf = 0,
    Branch = 1,
    Collision = 2
}
export interface LeafNode<K, V> {
    readonly kind: NodeKind.Leaf;
    readonly hash: number;
    readonly key: K;
    readonly value: V;
}
export interface BranchNode<K, V> {
    readonly kind: NodeKind.Branch;
    readonly bitmap: number;
    readonly children: ReadonlyArray<HamtNode<K, V>>;
}
export interface CollisionNode<K, V> {
    readonly kind: NodeKind.Collision;
    readonly hash: number;
    readonly entries: ReadonlyArray<readonly [K, V]>;
}
export type HamtNode<K, V> = LeafNode<K, V> | BranchNode<K, V> | CollisionNode<K, V>;
/** Lookup a key in the trie. Returns undefined if not found. */
export declare function hamtGet<K, V>(node: HamtNode<K, V> | null, hash: number, key: K, shift: number): V | undefined;
/**
 * Insert or update a key-value pair. Returns a new root node.
 * Also returns whether the operation was a new insertion (size change).
 */
export declare function hamtSet<K, V>(node: HamtNode<K, V> | null, hash: number, key: K, value: V, shift: number): {
    node: HamtNode<K, V>;
    added: boolean;
};
/** Delete a key from the trie. Returns new root (or null if empty). */
export declare function hamtDelete<K, V>(node: HamtNode<K, V> | null, hash: number, key: K, shift: number): {
    node: HamtNode<K, V> | null;
    removed: boolean;
};
/** Yield all [key, value] pairs in the trie. */
export declare function hamtEntries<K, V>(node: HamtNode<K, V> | null): Generator<[K, V]>;
