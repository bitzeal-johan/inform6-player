import { type ImmutableStorage } from './immutable-storage.js';
/**
 * Immutable word storage using fixed-size chunks.
 * On write, only the affected chunk is copied — O(WORD_CHUNK_SIZE) instead of O(n).
 */
export declare class ChunkedWordStorage implements ImmutableStorage {
    readonly length: number;
    readonly isByteArray = false;
    private readonly _chunks;
    private constructor();
    static fromArray(values: number[]): ChunkedWordStorage;
    getWord(index: number): number;
    setWord(index: number, value: number): ChunkedWordStorage;
    getByte(index: number): number;
    /**
     * Set a byte within a word array. In Glulx, byte and word access
     * can be mixed on the same memory region, so this must work.
     */
    setByte(index: number, value: number): ChunkedWordStorage;
    /** Exposed for structural sharing tests only. */
    getChunkForTesting(chunkIndex: number): readonly number[];
}
