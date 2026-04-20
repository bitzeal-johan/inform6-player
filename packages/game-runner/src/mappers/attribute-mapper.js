class AttributeMapper {
  idToName;
  aliases;
  constructor(idToName, aliases) {
    this.idToName = idToName;
    this.aliases = aliases ?? /* @__PURE__ */ new Map();
  }
  static empty = new AttributeMapper(/* @__PURE__ */ new Map());
  getAttributeName(id) {
    return this.idToName.get(id) ?? null;
  }
  resolveAlias(attributeName) {
    return this.aliases.get(attributeName.toLowerCase()) ?? attributeName;
  }
}
export {
  AttributeMapper
};
