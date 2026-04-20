import { PersistentMap } from "../values/persistent-map.js";
import { PersistentSet } from "../values/persistent-set.js";
class ObjectTreeState {
  _parents;
  _attributes;
  _properties;
  _children;
  _siblings;
  constructor(parents, attributes, properties, children, siblings) {
    this._parents = parents;
    this._attributes = attributes;
    this._properties = properties;
    this._children = children;
    this._siblings = siblings;
  }
  static empty = new ObjectTreeState(
    PersistentMap.empty(),
    PersistentMap.empty(),
    PersistentMap.empty(),
    PersistentMap.empty(),
    PersistentMap.empty()
  );
  /** Get parent of an object. Returns 'nothing' if no parent. */
  getParent(objId) {
    return this._parents.get(objId.toLowerCase()) ?? "nothing";
  }
  /** Get first child of an object. Returns 'nothing' if no children. */
  getChild(objId) {
    const kids = this._children.get(objId.toLowerCase());
    if (kids === void 0 || kids.length === 0) return "nothing";
    return kids[0];
  }
  /** Get next sibling of an object. Returns 'nothing' if no sibling. */
  getSibling(objId) {
    return this._siblings.get(objId.toLowerCase()) ?? "nothing";
  }
  /** Get all children of an object in order. */
  getChildren(objId) {
    const kids = this._children.get(objId.toLowerCase());
    return kids !== void 0 ? [...kids] : [];
  }
  /** Alias for getChildren. */
  getObjectsIn(parentId) {
    return this.getChildren(parentId);
  }
  /** Get all object IDs that have been registered (have a parent entry). */
  getAllObjectIds() {
    return [...this._parents.keys()];
  }
  /** Check if an object has an attribute. */
  hasAttribute(objId, attrName) {
    const attrs = this._attributes.get(objId.toLowerCase());
    return attrs !== void 0 && attrs.has(attrName.toLowerCase());
  }
  /** Set an attribute on an object. Returns a new ObjectTreeState. */
  setAttribute(objId, attrName) {
    const id = objId.toLowerCase();
    const attr = attrName.toLowerCase();
    const existingAttrs = this._attributes.get(id);
    const newSet = existingAttrs !== void 0 ? existingAttrs.add(attr) : PersistentSet.empty().add(attr);
    if (existingAttrs !== void 0 && newSet === existingAttrs) return this;
    const newAttributes = this._attributes.set(id, newSet);
    return new ObjectTreeState(this._parents, newAttributes, this._properties, this._children, this._siblings);
  }
  /** Remove an attribute from an object. Returns a new ObjectTreeState. */
  removeAttribute(objId, attrName) {
    const id = objId.toLowerCase();
    const existingAttrs = this._attributes.get(id);
    if (existingAttrs === void 0) return this;
    const newSet = existingAttrs.delete(attrName.toLowerCase());
    if (newSet === existingAttrs) return this;
    const newAttributes = this._attributes.set(id, newSet);
    return new ObjectTreeState(this._parents, newAttributes, this._properties, this._children, this._siblings);
  }
  /** Get a property value for an object. */
  getProperty(objId, propName) {
    const props = this._properties.get(objId.toLowerCase());
    return props?.get(propName.toLowerCase()) ?? null;
  }
  /** Set a property value for an object. Returns a new ObjectTreeState. */
  setProperty(objId, propName, value) {
    const id = objId.toLowerCase();
    const prop = propName.toLowerCase();
    const existingProps = this._properties.get(id);
    const newPropMap = existingProps !== void 0 ? existingProps.set(prop, value) : PersistentMap.empty().set(prop, value);
    const newProperties = this._properties.set(id, newPropMap);
    if (newProperties === this._properties) return this;
    return new ObjectTreeState(this._parents, this._attributes, newProperties, this._children, this._siblings);
  }
  /**
   * Move an object to a new parent.
   * Inform6 convention: most recently moved child becomes first child (child(parent)).
   */
  moveObject(objId, newParentId) {
    const id = objId.toLowerCase();
    const newPar = newParentId.toLowerCase();
    let state = this._removeFromCurrentParent(id);
    const newParents = state._parents.set(id, newPar);
    const existingKids = state._children.get(newPar) ?? [];
    const newChildren = state._children.set(newPar, [id, ...existingKids]);
    const newSiblings = existingKids.length > 0 ? state._siblings.set(id, existingKids[0]) : state._siblings.delete(id);
    return new ObjectTreeState(newParents, state._attributes, state._properties, newChildren, newSiblings);
  }
  /** Remove object from its parent. Sets parent to 'nothing'. */
  removeFromParent(objId) {
    const id = objId.toLowerCase();
    const state = this._removeFromCurrentParent(id);
    const newParents = state._parents.set(id, "nothing");
    return new ObjectTreeState(newParents, state._attributes, state._properties, state._children, state._siblings);
  }
  /** Register an object in the tree (for initialization). */
  registerObject(objId) {
    const id = objId.toLowerCase();
    if (this._parents.has(id)) return this;
    const newParents = this._parents.set(id, "nothing");
    return new ObjectTreeState(newParents, this._attributes, this._properties, this._children, this._siblings);
  }
  /** Read-only access to the parents map. */
  get parents() {
    return this._parents.asReadonlyMap();
  }
  /** Read-only access to the attributes map. */
  get attributes() {
    return this._attributes.asReadonlyMap();
  }
  /** Read-only access to the properties map. */
  get properties() {
    return this._properties.asReadonlyMap();
  }
  /** Read-only access to the children map. */
  get childrenMap() {
    return this._children.asReadonlyMap();
  }
  /** Read-only access to the siblings map. */
  get siblingsMap() {
    return this._siblings.asReadonlyMap();
  }
  /** Reconstruct an ObjectTreeState from raw maps (for deserialization / delta apply). */
  static fromData(parents, attributes, properties, children, siblings) {
    return new ObjectTreeState(parents, attributes, properties, children, siblings);
  }
  /** Internal: remove obj from old parent's children list and rebuild sibling chain. */
  _removeFromCurrentParent(objId) {
    const oldParent = this._parents.get(objId);
    if (oldParent === void 0 || oldParent === "nothing") return this;
    const oldKids = this._children.get(oldParent) ?? [];
    const filtered = oldKids.filter((k) => k !== objId);
    const newChildren = this._children.set(oldParent, filtered);
    let newSiblings = this._siblings.delete(objId);
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1) {
        newSiblings = newSiblings.set(filtered[i], filtered[i + 1]);
      } else {
        newSiblings = newSiblings.delete(filtered[i]);
      }
    }
    return new ObjectTreeState(this._parents, this._attributes, this._properties, newChildren, newSiblings);
  }
}
export {
  ObjectTreeState
};
