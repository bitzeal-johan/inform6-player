export type ArrayType = 'word' | 'byte' | 'buffer' | 'table';
export declare class InformArray {
    readonly address: number;
    readonly type: ArrayType;
    private readonly _storage;
    private constructor();
    get isWordArray(): boolean;
    get isByteArray(): boolean;
    get length(): number;
    /** Convert array to its address (for Inform6 array-to-int coercion). */
    toInt(): number;
    /** Get word at index. */
    getWord(index: number): number;
    /** Get byte at index. */
    getByte(index: number): number;
    /** Get 16-bit big-endian value at short index (address = base + 2*index). */
    getShort(index: number): number;
    /** Set word at index, returns new array. */
    setWord(index: number, value: number): InformArray;
    /** Set byte at index, returns new array. */
    setByte(index: number, value: number): InformArray;
    /** Create a word array with the given values. */
    static createWordArray(address: number, values: number[]): InformArray;
    /** Create a byte array with the given size. */
    static createByteArray(address: number, size: number): InformArray;
    /** Create a byte array initialized with the given data. */
    static createByteArrayFromData(address: number, data: number[], type?: ArrayType): InformArray;
    /** Create a word array initialized with the given data (for deserialization). */
    static createWordArrayFromData(address: number, data: number[]): InformArray;
    /** Create a table array (word array with count at index 0). */
    static createTableArray(address: number, values: number[]): InformArray;
    /** Create a buffer array (byte array with capacity prefix). */
    static createBufferArray(address: number, data: number[]): InformArray;
    /** Create a zero-copy read-only view into an existing array at a byte offset. */
    static createView(source: InformArray, byteOffset: number, viewAddress: number): InformArray;
}
