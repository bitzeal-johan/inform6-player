import { type ObjectDefinition } from '../objects/object-definition.js';
import { ObjectIdMapper } from '../mappers/object-id-mapper.js';
import { AttributeMapper } from '../mappers/attribute-mapper.js';
import { PropertyMapper } from '../mappers/property-mapper.js';
import { Dictionary } from '../objects/dictionary.js';
import { type InformValue } from '../values/inform-value.js';
/**
 * Compile-time game data shared across all GameState snapshots.
 * Immutable - never changes after initialization.
 */
export interface GameDefinition {
    readonly objects: ReadonlyMap<string, ObjectDefinition>;
    readonly objectIds: ObjectIdMapper;
    readonly attributeMapper: AttributeMapper;
    readonly propertyMapper: PropertyMapper;
    readonly dictionary: Dictionary;
    readonly classHierarchy: ReadonlyMap<string, string | null>;
    readonly actionsTable: readonly (InformValue | null)[];
}
/** Create a GameDefinition with defaults for unspecified fields. */
export declare function createGameDefinition(partial: Partial<GameDefinition>): GameDefinition;
