/**
 * Maps property IDs to names.
 */
export declare class PropertyMapper {
    readonly idToName: ReadonlyMap<number, string>;
    constructor(idToName: ReadonlyMap<number, string>);
    static readonly empty: PropertyMapper;
    getPropertyName(id: number): string | null;
}
