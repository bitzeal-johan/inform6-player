const BYTE_CHUNK_SIZE = 64;
const WORD_CHUNK_SIZE = 16;
class OffsetStorage {
  constructor(_source, _byteOffset, length) {
    this._source = _source;
    this._byteOffset = _byteOffset;
    this.length = length;
  }
  _source;
  _byteOffset;
  isByteArray = true;
  length;
  getByte(index) {
    if (index >= this.length) return 0;
    const sourceIdx = this._byteOffset + index;
    if (sourceIdx < 0 || sourceIdx >= this._source.length) return 0;
    return this._source.getByte(sourceIdx);
  }
  getWord(index) {
    const byteIndex = index * 4;
    if (byteIndex + 3 >= this.length) return 0;
    const sourceStart = this._byteOffset + byteIndex;
    if (sourceStart < 0 || sourceStart + 3 >= this._source.length) return 0;
    return this._source.getByte(sourceStart) << 24 | this._source.getByte(sourceStart + 1) << 16 | this._source.getByte(sourceStart + 2) << 8 | this._source.getByte(sourceStart + 3);
  }
  setByte(_index, _value) {
    throw new Error("OffsetStorage is read-only \u2014 writes must go through the base array");
  }
  setWord(_index, _value) {
    throw new Error("OffsetStorage is read-only \u2014 writes must go through the base array");
  }
}
export {
  BYTE_CHUNK_SIZE,
  OffsetStorage,
  WORD_CHUNK_SIZE
};
