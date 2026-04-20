import { type PropertyValue } from '../values/property-value.js';
/**
 * Compile-time object definition.
 * Contains the object's metadata and initial state.
 */
export interface ObjectDefinition {
    readonly id: string;
    readonly number: number;
    readonly shortName: string;
    readonly className: string | null;
    readonly initialProperties: ReadonlyMap<string, PropertyValue>;
    readonly initialAttributes: ReadonlySet<string>;
    readonly providedProperties: ReadonlySet<string>;
    readonly functionPropertyNames: ReadonlySet<string>;
}
