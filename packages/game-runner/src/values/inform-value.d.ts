/**
 * Discriminated union representing all Inform value types.
 * Uses 'kind' field for TypeScript narrowing.
 */
export type InformValue = IntInformValue | StringInformValue | ArrayInformValue | ByteArrayInformValue | RoutineInformValue | PropertyAddressInformValue | DictWordInformValue;
export interface IntInformValue {
    readonly kind: 'int';
    readonly value: number;
}
export interface StringInformValue {
    readonly kind: 'string';
    readonly value: string;
}
export interface ArrayInformValue {
    readonly kind: 'array';
    readonly values: readonly number[];
}
export interface ByteArrayInformValue {
    readonly kind: 'byteArray';
    readonly values: Uint8Array;
}
export interface RoutineInformValue {
    readonly kind: 'routine';
    readonly routineName: string;
}
export interface PropertyAddressInformValue {
    readonly kind: 'propertyAddress';
    readonly objectId: string;
    readonly propertyName: string;
    readonly values: readonly InformValue[];
}
export interface DictWordInformValue {
    readonly kind: 'dictWord';
    readonly word: string;
}
/** Create an integer InformValue with 32-bit signed semantics. */
export declare function intValue(n: number): InformValue;
/** Create a string InformValue. */
export declare function stringValue(s: string): InformValue;
/** Create a routine reference InformValue. */
export declare function routineValue(name: string): InformValue;
/** Create a dictionary word InformValue. */
export declare function dictWordValue(word: string): InformValue;
/** Extract integer from any InformValue. Strings and non-int types return 0.
 * PropertyAddress returns a synthetic non-zero address for truthiness checks. */
export declare function toInt(v: InformValue): number;
/** Check if an InformValue is truthy (non-zero for ints, non-empty for strings). */
export declare function isTruthy(v: InformValue): boolean;
/** InformValue arithmetic: addition with 32-bit signed overflow. */
export declare function ivAdd(a: InformValue, b: InformValue): InformValue;
/** InformValue arithmetic: subtraction with 32-bit signed overflow. */
export declare function ivSub(a: InformValue, b: InformValue): InformValue;
/** InformValue arithmetic: multiplication with 32-bit signed overflow. */
export declare function ivMul(a: InformValue, b: InformValue): InformValue;
/** InformValue arithmetic: integer division. */
export declare function ivDiv(a: InformValue, b: InformValue): InformValue;
/** InformValue arithmetic: modulo. */
export declare function ivMod(a: InformValue, b: InformValue): InformValue;
