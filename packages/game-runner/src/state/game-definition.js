import { ObjectIdMapper } from "../mappers/object-id-mapper.js";
import { AttributeMapper } from "../mappers/attribute-mapper.js";
import { PropertyMapper } from "../mappers/property-mapper.js";
import { Dictionary } from "../objects/dictionary.js";
function createGameDefinition(partial) {
  return {
    objects: partial.objects ?? /* @__PURE__ */ new Map(),
    objectIds: partial.objectIds ?? ObjectIdMapper.empty,
    attributeMapper: partial.attributeMapper ?? AttributeMapper.empty,
    propertyMapper: partial.propertyMapper ?? PropertyMapper.empty,
    dictionary: partial.dictionary ?? Dictionary.empty,
    classHierarchy: partial.classHierarchy ?? /* @__PURE__ */ new Map(),
    actionsTable: partial.actionsTable ?? []
  };
}
export {
  createGameDefinition
};
