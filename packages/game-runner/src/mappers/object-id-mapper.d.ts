/**
 * Bidirectional mapping between numeric object IDs and string names.
 */
export declare class ObjectIdMapper {
    private readonly _numToString;
    private readonly _stringToNum;
    constructor(mapping: ReadonlyMap<number, string>);
    static readonly empty: ObjectIdMapper;
    getName(objNumber: number): string;
    getNumber(objId: string): number;
    containsNumber(objNumber: number): boolean;
    containsName(objId: string): boolean;
}
