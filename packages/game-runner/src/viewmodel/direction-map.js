import { propToScalarInt } from "../values/property-value.js";
const DIRECTION_TABLE = [
  { shortName: "n", defaultLongName: "north", command: "north", directionProperty: "n_to" },
  { shortName: "ne", defaultLongName: "northeast", command: "northeast", directionProperty: "ne_to" },
  { shortName: "e", defaultLongName: "east", command: "east", directionProperty: "e_to" },
  { shortName: "se", defaultLongName: "southeast", command: "southeast", directionProperty: "se_to" },
  { shortName: "s", defaultLongName: "south", command: "south", directionProperty: "s_to" },
  { shortName: "sw", defaultLongName: "southwest", command: "southwest", directionProperty: "sw_to" },
  { shortName: "w", defaultLongName: "west", command: "west", directionProperty: "w_to" },
  { shortName: "nw", defaultLongName: "northwest", command: "northwest", directionProperty: "nw_to" },
  { shortName: "u", defaultLongName: "up", command: "up", directionProperty: "u_to" },
  { shortName: "d", defaultLongName: "down", command: "down", directionProperty: "d_to" },
  { shortName: "in", defaultLongName: "in", command: "in", directionProperty: "in_to" },
  { shortName: "out", defaultLongName: "out", command: "out", directionProperty: "out_to" }
];
function buildCompassLongNames(objects, propertyMapper) {
  const result = /* @__PURE__ */ new Map();
  for (const [, objDef] of objects) {
    if (objDef.className?.toLowerCase() !== "compassdirection") continue;
    const doorDirPv = objDef.initialProperties.get("door_dir");
    if (doorDirPv === void 0) continue;
    const propId = propToScalarInt(doorDirPv);
    if (propId === 0) continue;
    const propName = propertyMapper.getPropertyName(propId);
    if (propName === null) continue;
    result.set(propName.toLowerCase(), objDef.shortName);
  }
  return result;
}
export {
  DIRECTION_TABLE,
  buildCompassLongNames
};
