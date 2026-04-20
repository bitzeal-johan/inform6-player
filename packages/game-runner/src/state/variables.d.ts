import { type PropertyValue } from '../values/property-value.js';
/**
 * Immutable container for game variables (globals).
 * All mutations return new instances.
 */
export declare class Variables {
    private readonly _values;
    private constructor();
    static readonly empty: Variables;
    /** Create a new Variables instance from key-value entries. */
    static fromEntries(entries: Iterable<[string, PropertyValue]>): Variables;
    /** Get a variable's PropertyValue, or null if not set. */
    get(name: string): PropertyValue | null;
    /** Get a variable's integer value, or 0 if not set. */
    getInt(name: string): number;
    /** Set a variable. Returns a new Variables instance. */
    set(name: string, value: PropertyValue): Variables;
    /** Set a variable to an integer value. Returns a new Variables instance. */
    setInt(name: string, value: number): Variables;
    /** Check if a variable exists. */
    contains(name: string): boolean;
    /** Iterate over all [name, value] entries. */
    entries(): IterableIterator<[string, PropertyValue]>;
    /** Iterate over all variable names. */
    keys(): IterableIterator<string>;
    /** Number of variables. */
    get size(): number;
}
