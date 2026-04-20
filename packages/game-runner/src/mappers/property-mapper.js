class PropertyMapper {
  idToName;
  constructor(idToName) {
    this.idToName = idToName;
  }
  static empty = new PropertyMapper(/* @__PURE__ */ new Map());
  getPropertyName(id) {
    return this.idToName.get(id) ?? null;
  }
}
export {
  PropertyMapper
};
