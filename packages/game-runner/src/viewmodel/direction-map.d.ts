import { type ObjectDefinition } from '../objects/object-definition.js';
import { type PropertyMapper } from '../mappers/property-mapper.js';
export interface DirectionInfo {
    readonly shortName: string;
    readonly defaultLongName: string;
    readonly command: string;
    readonly directionProperty: string;
}
/**
 * Hardcoded compass rose: 12 directions in clockwise order,
 * then vertical (up/down) and in/out.
 */
export declare const DIRECTION_TABLE: readonly DirectionInfo[];
/**
 * Scan game objects for CompassDirection instances and build a map
 * from direction property name (e.g. "n_to") to the compass object's shortName.
 *
 * In the Inform6 library, each CompassDirection object (n_obj, s_obj, etc.)
 * has a `door_dir` initial property whose int value is the property ID for
 * the direction (e.g. n_to). We reverse that mapping here so the UI can
 * display localized direction names.
 */
export declare function buildCompassLongNames(objects: ReadonlyMap<string, ObjectDefinition>, propertyMapper: PropertyMapper): ReadonlyMap<string, string>;
