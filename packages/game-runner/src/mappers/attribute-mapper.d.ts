/**
 * Maps attribute IDs to names and resolves aliases.
 */
export declare class AttributeMapper {
    readonly idToName: ReadonlyMap<number, string>;
    readonly aliases: ReadonlyMap<string, string>;
    constructor(idToName: ReadonlyMap<number, string>, aliases?: ReadonlyMap<string, string>);
    static readonly empty: AttributeMapper;
    getAttributeName(id: number): string | null;
    resolveAlias(attributeName: string): string;
}
