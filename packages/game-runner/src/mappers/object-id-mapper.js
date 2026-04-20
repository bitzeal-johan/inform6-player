class ObjectIdMapper {
  _numToString;
  _stringToNum;
  constructor(mapping) {
    this._numToString = mapping;
    const reverse = /* @__PURE__ */ new Map();
    for (const [num, name] of mapping) {
      reverse.set(name.toLowerCase(), num);
    }
    this._stringToNum = reverse;
  }
  static empty = new ObjectIdMapper(/* @__PURE__ */ new Map());
  getName(objNumber) {
    if (objNumber === 0) return "nothing";
    return this._numToString.get(objNumber) ?? "nothing";
  }
  getNumber(objId) {
    if (objId.toLowerCase() === "nothing") return 0;
    return this._stringToNum.get(objId.toLowerCase()) ?? 0;
  }
  containsNumber(objNumber) {
    return this._numToString.has(objNumber);
  }
  containsName(objId) {
    return this._stringToNum.has(objId.toLowerCase());
  }
}
export {
  ObjectIdMapper
};
