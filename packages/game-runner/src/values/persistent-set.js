import { PersistentMap } from "./persistent-map.js";
class PersistentSet {
  _map;
  constructor(map) {
    this._map = map;
  }
  static empty() {
    return new PersistentSet(PersistentMap.empty());
  }
  static fromValues(values) {
    let set = PersistentSet.empty();
    for (const v of values) {
      set = set.add(v);
    }
    return set;
  }
  get size() {
    return this._map.size;
  }
  has(value) {
    return this._map.has(value);
  }
  /** Returns a new PersistentSet with the value added. Returns `this` if already present. */
  add(value) {
    const newMap = this._map.set(value, true);
    if (newMap === this._map) return this;
    return new PersistentSet(newMap);
  }
  /** Returns a new PersistentSet with the value removed. Returns `this` if not present. */
  delete(value) {
    const newMap = this._map.delete(value);
    if (newMap === this._map) return this;
    return new PersistentSet(newMap);
  }
  *values() {
    yield* this._map.keys();
  }
  *keys() {
    yield* this._map.keys();
  }
  *entries() {
    for (const key of this._map.keys()) {
      yield [key, key];
    }
  }
  forEach(callbackfn, thisArg) {
    for (const key of this._map.keys()) {
      callbackfn.call(thisArg, key, key, this);
    }
  }
  [Symbol.iterator]() {
    return this.values();
  }
  get [Symbol.toStringTag]() {
    return "PersistentSet";
  }
  // --- ES2025 ReadonlySet methods ---
  union(other) {
    const result = new Set(this.values());
    iterateSetLike(other, (v) => result.add(v));
    return result;
  }
  intersection(other) {
    const result = /* @__PURE__ */ new Set();
    for (const v of this.values()) {
      if (other.has(v)) result.add(v);
    }
    return result;
  }
  difference(other) {
    const result = new Set(this.values());
    iterateSetLike(other, (v) => result.delete(v));
    return result;
  }
  symmetricDifference(other) {
    const result = new Set(this.values());
    iterateSetLike(other, (v) => {
      if (result.has(v)) {
        result.delete(v);
      } else {
        result.add(v);
      }
    });
    return result;
  }
  isSubsetOf(other) {
    for (const v of this.values()) {
      if (!other.has(v)) return false;
    }
    return true;
  }
  isSupersetOf(other) {
    if (other.size > this.size) return false;
    let allFound = true;
    iterateSetLike(other, (v) => {
      if (!this.has(v)) allFound = false;
    });
    return allFound;
  }
  isDisjointFrom(other) {
    for (const v of this.values()) {
      if (other.has(v)) return false;
    }
    return true;
  }
  /** Cast to ReadonlySet for use in APIs that expect it. */
  asReadonlySet() {
    return this;
  }
}
function iterateSetLike(setLike, fn) {
  const iter = setLike.keys();
  let next = iter.next();
  while (!next.done) {
    fn(next.value);
    next = iter.next();
  }
}
export {
  PersistentSet
};
