import { type ImmutableStorage } from './immutable-storage.js';
/**
 * Immutable byte storage using fixed-size chunks.
 * On write, only the affected chunk is copied — O(BYTE_CHUNK_SIZE) instead of O(n).
 */
export declare class ChunkedByteStorage implements ImmutableStorage {
    readonly length: number;
    readonly isByteArray = true;
    private readonly _chunks;
    private constructor();
    static fromUint8Array(data: Uint8Array): ChunkedByteStorage;
    static createEmpty(size: number): ChunkedByteStorage;
    getByte(index: number): number;
    getWord(index: number): number;
    setByte(index: number, value: number): ChunkedByteStorage;
    setWord(index: number, value: number): ChunkedByteStorage;
    /** Exposed for structural sharing tests only. */
    getChunkForTesting(chunkIndex: number): Uint8Array;
}
