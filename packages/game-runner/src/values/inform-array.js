import { OffsetStorage } from "./immutable-storage.js";
import { ChunkedByteStorage } from "./chunked-byte-storage.js";
import { ChunkedWordStorage } from "./chunked-word-storage.js";
class InformArray {
  address;
  type;
  _storage;
  constructor(address, type, storage) {
    this.address = address;
    this.type = type;
    this._storage = storage;
  }
  get isWordArray() {
    return !this._storage.isByteArray;
  }
  get isByteArray() {
    return this._storage.isByteArray;
  }
  get length() {
    return this._storage.length;
  }
  /** Convert array to its address (for Inform6 array-to-int coercion). */
  toInt() {
    return this.address;
  }
  /** Get word at index. */
  getWord(index) {
    return this._storage.getWord(index);
  }
  /** Get byte at index. */
  getByte(index) {
    return this._storage.getByte(index);
  }
  /** Get 16-bit big-endian value at short index (address = base + 2*index). */
  getShort(index) {
    const byteIndex = index * 2;
    return this._storage.getByte(byteIndex) << 8 | this._storage.getByte(byteIndex + 1);
  }
  /** Set word at index, returns new array. */
  setWord(index, value) {
    const newStorage = this._storage.setWord(index, value);
    if (newStorage === this._storage) return this;
    return new InformArray(this.address, this.type, newStorage);
  }
  /** Set byte at index, returns new array. */
  setByte(index, value) {
    const newStorage = this._storage.setByte(index, value);
    if (newStorage === this._storage) return this;
    return new InformArray(this.address, this.type, newStorage);
  }
  /** Create a word array with the given values. */
  static createWordArray(address, values) {
    return new InformArray(address, "word", ChunkedWordStorage.fromArray(values));
  }
  /** Create a byte array with the given size. */
  static createByteArray(address, size) {
    return new InformArray(address, "byte", ChunkedByteStorage.createEmpty(size));
  }
  /** Create a byte array initialized with the given data. */
  static createByteArrayFromData(address, data, type = "byte") {
    return new InformArray(address, type, ChunkedByteStorage.fromUint8Array(new Uint8Array(data)));
  }
  /** Create a word array initialized with the given data (for deserialization). */
  static createWordArrayFromData(address, data) {
    return new InformArray(address, "word", ChunkedWordStorage.fromArray(data));
  }
  /** Create a table array (word array with count at index 0). */
  static createTableArray(address, values) {
    return new InformArray(address, "table", ChunkedWordStorage.fromArray(values));
  }
  /** Create a buffer array (byte array with capacity prefix). */
  static createBufferArray(address, data) {
    return new InformArray(address, "buffer", ChunkedByteStorage.fromUint8Array(new Uint8Array(data)));
  }
  /** Create a zero-copy read-only view into an existing array at a byte offset. */
  static createView(source, byteOffset, viewAddress) {
    const totalBytes = source.isByteArray ? source.length : source.length * 4;
    const remaining = totalBytes - byteOffset;
    return new InformArray(viewAddress, "byte", new OffsetStorage(source._storage, byteOffset, remaining));
  }
}
export {
  InformArray
};
