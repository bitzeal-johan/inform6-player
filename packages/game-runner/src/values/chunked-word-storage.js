import { WORD_CHUNK_SIZE } from "./immutable-storage.js";
class ChunkedWordStorage {
  length;
  isByteArray = false;
  _chunks;
  constructor(length, chunks) {
    this.length = length;
    this._chunks = chunks;
  }
  static fromArray(values) {
    const chunkCount = Math.ceil(values.length / WORD_CHUNK_SIZE) || 0;
    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
      const start = i * WORD_CHUNK_SIZE;
      const end = Math.min(start + WORD_CHUNK_SIZE, values.length);
      chunks.push(Object.freeze(values.slice(start, end)));
    }
    return new ChunkedWordStorage(values.length, chunks);
  }
  getWord(index) {
    if (index < 0 || index >= this.length) return 0;
    const chunkIndex = index / WORD_CHUNK_SIZE | 0;
    const offset = index - chunkIndex * WORD_CHUNK_SIZE;
    return this._chunks[chunkIndex][offset];
  }
  setWord(index, value) {
    if (index < 0 || index >= this.length) return this;
    const chunkIndex = index / WORD_CHUNK_SIZE | 0;
    const offset = index - chunkIndex * WORD_CHUNK_SIZE;
    const newChunk = [...this._chunks[chunkIndex]];
    newChunk[offset] = value | 0;
    const newChunks = [...this._chunks];
    newChunks[chunkIndex] = Object.freeze(newChunk);
    return new ChunkedWordStorage(this.length, newChunks);
  }
  getByte(index) {
    if (index < 0 || index >= this.length * 4) return 0;
    const wordIndex = index / 4 | 0;
    const byteOffset = index % 4;
    const word = this.getWord(wordIndex);
    return word >> 8 * (3 - byteOffset) & 255;
  }
  /**
   * Set a byte within a word array. In Glulx, byte and word access
   * can be mixed on the same memory region, so this must work.
   */
  setByte(index, value) {
    if (index < 0 || index >= this.length * 4) return this;
    const wordIndex = index / 4 | 0;
    const byteOffset = index % 4;
    const shift = 8 * (3 - byteOffset);
    const mask = ~(255 << shift);
    const oldWord = this.getWord(wordIndex);
    const newWord = oldWord & mask | (value & 255) << shift;
    if (newWord === oldWord) return this;
    return this.setWord(wordIndex, newWord);
  }
  /** Exposed for structural sharing tests only. */
  getChunkForTesting(chunkIndex) {
    return this._chunks[chunkIndex];
  }
}
export {
  ChunkedWordStorage
};
