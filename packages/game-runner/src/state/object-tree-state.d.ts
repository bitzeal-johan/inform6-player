import { type PropertyValue } from '../values/property-value.js';
import { PersistentMap } from '../values/persistent-map.js';
import { PersistentSet } from '../values/persistent-set.js';
/**
 * Manages object tree state: parent/child/sibling relationships, attributes, and property values.
 * All mutations return new instances.
 */
export declare class ObjectTreeState {
    private readonly _parents;
    private readonly _attributes;
    private readonly _properties;
    private readonly _children;
    private readonly _siblings;
    private constructor();
    static readonly empty: ObjectTreeState;
    /** Get parent of an object. Returns 'nothing' if no parent. */
    getParent(objId: string): string;
    /** Get first child of an object. Returns 'nothing' if no children. */
    getChild(objId: string): string;
    /** Get next sibling of an object. Returns 'nothing' if no sibling. */
    getSibling(objId: string): string;
    /** Get all children of an object in order. */
    getChildren(objId: string): string[];
    /** Alias for getChildren. */
    getObjectsIn(parentId: string): string[];
    /** Get all object IDs that have been registered (have a parent entry). */
    getAllObjectIds(): string[];
    /** Check if an object has an attribute. */
    hasAttribute(objId: string, attrName: string): boolean;
    /** Set an attribute on an object. Returns a new ObjectTreeState. */
    setAttribute(objId: string, attrName: string): ObjectTreeState;
    /** Remove an attribute from an object. Returns a new ObjectTreeState. */
    removeAttribute(objId: string, attrName: string): ObjectTreeState;
    /** Get a property value for an object. */
    getProperty(objId: string, propName: string): PropertyValue | null;
    /** Set a property value for an object. Returns a new ObjectTreeState. */
    setProperty(objId: string, propName: string, value: PropertyValue): ObjectTreeState;
    /**
     * Move an object to a new parent.
     * Inform6 convention: most recently moved child becomes first child (child(parent)).
     */
    moveObject(objId: string, newParentId: string): ObjectTreeState;
    /** Remove object from its parent. Sets parent to 'nothing'. */
    removeFromParent(objId: string): ObjectTreeState;
    /** Register an object in the tree (for initialization). */
    registerObject(objId: string): ObjectTreeState;
    /** Read-only access to the parents map. */
    get parents(): ReadonlyMap<string, string>;
    /** Read-only access to the attributes map. */
    get attributes(): ReadonlyMap<string, ReadonlySet<string>>;
    /** Read-only access to the properties map. */
    get properties(): ReadonlyMap<string, ReadonlyMap<string, PropertyValue>>;
    /** Read-only access to the children map. */
    get childrenMap(): ReadonlyMap<string, readonly string[]>;
    /** Read-only access to the siblings map. */
    get siblingsMap(): ReadonlyMap<string, string>;
    /** Reconstruct an ObjectTreeState from raw maps (for deserialization / delta apply). */
    static fromData(parents: PersistentMap<string, string>, attributes: PersistentMap<string, PersistentSet<string>>, properties: PersistentMap<string, PersistentMap<string, PropertyValue>>, children: PersistentMap<string, readonly string[]>, siblings: PersistentMap<string, string>): ObjectTreeState;
    /** Internal: remove obj from old parent's children list and rebuild sibling chain. */
    private _removeFromCurrentParent;
}
