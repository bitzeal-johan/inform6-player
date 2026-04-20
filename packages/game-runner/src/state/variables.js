import { intPropValue, propToScalarInt } from "../values/property-value.js";
import { PersistentMap } from "../values/persistent-map.js";
class Variables {
  _values;
  constructor(values) {
    this._values = values;
  }
  static empty = new Variables(PersistentMap.empty());
  /** Create a new Variables instance from key-value entries. */
  static fromEntries(entries) {
    return new Variables(PersistentMap.fromEntries(entries));
  }
  /** Get a variable's PropertyValue, or null if not set. */
  get(name) {
    return this._values.get(name.toLowerCase()) ?? null;
  }
  /** Get a variable's integer value, or 0 if not set. */
  getInt(name) {
    const pv = this.get(name);
    return pv !== null ? propToScalarInt(pv) : 0;
  }
  /** Set a variable. Returns a new Variables instance. */
  set(name, value) {
    const newValues = this._values.set(name.toLowerCase(), value);
    if (newValues === this._values) return this;
    return new Variables(newValues);
  }
  /** Set a variable to an integer value. Returns a new Variables instance. */
  setInt(name, value) {
    return this.set(name, intPropValue(value));
  }
  /** Check if a variable exists. */
  contains(name) {
    return this._values.has(name.toLowerCase());
  }
  /** Iterate over all [name, value] entries. */
  entries() {
    return this._values.entries();
  }
  /** Iterate over all variable names. */
  keys() {
    return this._values.keys();
  }
  /** Number of variables. */
  get size() {
    return this._values.size;
  }
}
export {
  Variables
};
