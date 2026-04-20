import {
  hashString,
  hashNumber,
  hamtGet,
  hamtSet,
  hamtDelete,
  hamtEntries
} from "./hamt-node.js";
class PersistentMap {
  _root;
  _size;
  _hashFn;
  constructor(root, size, hashFn) {
    this._root = root;
    this._size = size;
    this._hashFn = hashFn;
  }
  static empty() {
    return new PersistentMap(null, 0, hashString);
  }
  static emptyNumberKeyed() {
    return new PersistentMap(null, 0, hashNumber);
  }
  static fromEntries(entries) {
    let map = PersistentMap.empty();
    for (const [key, value] of entries) {
      map = map.set(key, value);
    }
    return map;
  }
  static fromNumberEntries(entries) {
    let map = PersistentMap.emptyNumberKeyed();
    for (const [key, value] of entries) {
      map = map.set(key, value);
    }
    return map;
  }
  get size() {
    return this._size;
  }
  get(key) {
    return hamtGet(this._root, this._hashFn(key), key, 0);
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  /** Returns a new PersistentMap with the key set. Returns `this` if value is unchanged. */
  set(key, value) {
    const hash = this._hashFn(key);
    const result = hamtSet(this._root, hash, key, value, 0);
    if (result.node === this._root) return this;
    return new PersistentMap(result.node, this._size + (result.added ? 1 : 0), this._hashFn);
  }
  /** Returns a new PersistentMap with the key removed. Returns `this` if key was not present. */
  delete(key) {
    const hash = this._hashFn(key);
    const result = hamtDelete(this._root, hash, key, 0);
    if (!result.removed) return this;
    return new PersistentMap(result.node, this._size - 1, this._hashFn);
  }
  *entries() {
    yield* hamtEntries(this._root);
  }
  *keys() {
    for (const [key] of this.entries()) {
      yield key;
    }
  }
  *values() {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }
  forEach(callbackfn, thisArg) {
    for (const [key, value] of this.entries()) {
      callbackfn.call(thisArg, value, key, this);
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get [Symbol.toStringTag]() {
    return "PersistentMap";
  }
  /** Cast to ReadonlyMap for use in APIs that expect it. */
  asReadonlyMap() {
    return this;
  }
}
export {
  PersistentMap
};
