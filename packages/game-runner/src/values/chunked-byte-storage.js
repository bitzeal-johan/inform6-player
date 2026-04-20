import { BYTE_CHUNK_SIZE } from "./immutable-storage.js";
class ChunkedByteStorage {
  length;
  isByteArray = true;
  _chunks;
  constructor(length, chunks) {
    this.length = length;
    this._chunks = chunks;
  }
  static fromUint8Array(data) {
    const chunkCount = Math.ceil(data.length / BYTE_CHUNK_SIZE);
    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
      const start = i * BYTE_CHUNK_SIZE;
      const end = Math.min(start + BYTE_CHUNK_SIZE, data.length);
      chunks.push(data.slice(start, end));
    }
    return new ChunkedByteStorage(data.length, chunks);
  }
  static createEmpty(size) {
    const chunkCount = Math.ceil(size / BYTE_CHUNK_SIZE);
    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
      const chunkSize = Math.min(BYTE_CHUNK_SIZE, size - i * BYTE_CHUNK_SIZE);
      chunks.push(new Uint8Array(chunkSize));
    }
    return new ChunkedByteStorage(size, chunks);
  }
  getByte(index) {
    if (index < 0 || index >= this.length) return 0;
    const chunkIndex = index / BYTE_CHUNK_SIZE | 0;
    const offset = index - chunkIndex * BYTE_CHUNK_SIZE;
    return this._chunks[chunkIndex][offset];
  }
  getWord(index) {
    const byteIndex = index * 4;
    if (byteIndex < 0 || byteIndex + 3 >= this.length) return 0;
    return this.getByte(byteIndex) << 24 | this.getByte(byteIndex + 1) << 16 | this.getByte(byteIndex + 2) << 8 | this.getByte(byteIndex + 3);
  }
  setByte(index, value) {
    if (index < 0 || index >= this.length) return this;
    const chunkIndex = index / BYTE_CHUNK_SIZE | 0;
    const offset = index - chunkIndex * BYTE_CHUNK_SIZE;
    const newChunk = new Uint8Array(this._chunks[chunkIndex]);
    newChunk[offset] = value & 255;
    const newChunks = [...this._chunks];
    newChunks[chunkIndex] = newChunk;
    return new ChunkedByteStorage(this.length, newChunks);
  }
  setWord(index, value) {
    const byteIndex = index * 4;
    if (byteIndex < 0 || byteIndex + 3 >= this.length) return this;
    const chunkStart = byteIndex / BYTE_CHUNK_SIZE | 0;
    const chunkEnd = (byteIndex + 3) / BYTE_CHUNK_SIZE | 0;
    if (chunkStart === chunkEnd) {
      const offset = byteIndex - chunkStart * BYTE_CHUNK_SIZE;
      const newChunk = new Uint8Array(this._chunks[chunkStart]);
      newChunk[offset] = value >>> 24 & 255;
      newChunk[offset + 1] = value >>> 16 & 255;
      newChunk[offset + 2] = value >>> 8 & 255;
      newChunk[offset + 3] = value & 255;
      const newChunks = [...this._chunks];
      newChunks[chunkStart] = newChunk;
      return new ChunkedByteStorage(this.length, newChunks);
    }
    let result = this;
    result = result.setByte(byteIndex, value >>> 24 & 255);
    result = result.setByte(byteIndex + 1, value >>> 16 & 255);
    result = result.setByte(byteIndex + 2, value >>> 8 & 255);
    result = result.setByte(byteIndex + 3, value & 255);
    return result;
  }
  /** Exposed for structural sharing tests only. */
  getChunkForTesting(chunkIndex) {
    return this._chunks[chunkIndex];
  }
}
export {
  ChunkedByteStorage
};
