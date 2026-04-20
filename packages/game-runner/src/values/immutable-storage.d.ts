/**
 * Interface for immutable chunked array storage.
 * Implementations copy only the affected chunk on write — O(chunk_size) instead of O(n).
 */
export interface ImmutableStorage {
    readonly length: number;
    readonly isByteArray: boolean;
    getByte(index: number): number;
    getWord(index: number): number;
    setByte(index: number, value: number): ImmutableStorage;
    setWord(index: number, value: number): ImmutableStorage;
}
export declare const BYTE_CHUNK_SIZE = 64;
export declare const WORD_CHUNK_SIZE = 16;
/**
 * Zero-copy read-only view into an existing storage at a byte offset.
 * Used for pointer arithmetic (e.g., buf+4) without copying the array.
 */
export declare class OffsetStorage implements ImmutableStorage {
    private readonly _source;
    private readonly _byteOffset;
    readonly isByteArray = true;
    readonly length: number;
    constructor(_source: ImmutableStorage, _byteOffset: number, length: number);
    getByte(index: number): number;
    getWord(index: number): number;
    setByte(_index: number, _value: number): ImmutableStorage;
    setWord(_index: number, _value: number): ImmutableStorage;
}
