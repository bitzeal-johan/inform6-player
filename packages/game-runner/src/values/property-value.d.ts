import { type InformValue } from './inform-value.js';
/**
 * Discriminated union for stored property data.
 * PropertyValue is what gets stored in object properties and global variables.
 */
export type PropertyValue = IntPropertyValue | StringPropertyValue | ListPropertyValue | DictWordPropertyValue | RoutinePropertyValue;
export interface IntPropertyValue {
    readonly kind: 'int';
    readonly value: number;
}
export interface StringPropertyValue {
    readonly kind: 'string';
    readonly value: string;
}
export interface ListPropertyValue {
    readonly kind: 'list';
    readonly values: readonly PropertyValue[];
}
export interface DictWordPropertyValue {
    readonly kind: 'dictWord';
    readonly word: string;
}
export interface RoutinePropertyValue {
    readonly kind: 'routine';
    readonly routineName: string;
}
/** Create an integer PropertyValue. */
export declare function intPropValue(n: number): PropertyValue;
/** Create a string PropertyValue. */
export declare function stringPropValue(s: string): PropertyValue;
/** Extract scalar int from a PropertyValue. Lists return first element's int. */
export declare function propToScalarInt(pv: PropertyValue): number;
/** Convert PropertyValue to InformValue. */
export declare function propToInformValue(pv: PropertyValue): InformValue;
/** Convert InformValue to PropertyValue. */
export declare function informValueToProp(iv: InformValue): PropertyValue;
/** Deep equality check for PropertyValue. */
export declare function propertyValueEquals(a: PropertyValue, b: PropertyValue): boolean;
