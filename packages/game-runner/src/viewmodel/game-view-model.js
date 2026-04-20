import { getGlobal } from "../state/game-state.js";
import { propToScalarInt } from "../values/property-value.js";
import { DIRECTION_TABLE, buildCompassLongNames } from "./direction-map.js";
function extractOutputText(events) {
  const parts = [];
  for (const ev of events) {
    if (ev.kind === "print" || ev.kind === "printLine") {
      parts.push(ev.text);
    } else if (ev.kind === "printChar") {
      parts.push(String.fromCharCode(ev.charCode));
    }
  }
  return parts.join("");
}
function detectInputContext(inputRequest, recentOutput) {
  if (inputRequest.kind === "char") return "char";
  if (inputRequest.kind === "none") return "none";
  const text = extractOutputText(recentOutput).toLowerCase();
  if (text.includes("which do you mean") || text.includes("who do you mean")) {
    return "disambiguation";
  }
  return "command";
}
function deriveExits(state) {
  const locationNum = getGlobal(state, "location");
  if (locationNum === 0) return [];
  const roomId = state.definition.objectIds.getName(locationNum);
  if (roomId === "nothing") return [];
  const roomDef = state.definition.objects.get(roomId.toLowerCase());
  if (roomDef === void 0) return [];
  const compassNames = buildCompassLongNames(
    state.definition.objects,
    state.definition.propertyMapper
  );
  const exits = [];
  for (const dir of DIRECTION_TABLE) {
    const propName = dir.directionProperty.toLowerCase();
    if (!roomDef.providedProperties.has(propName)) continue;
    const runtimePv = state.treeState.getProperty(roomId, propName);
    if (runtimePv !== null) {
      if (propToScalarInt(runtimePv) === 0) continue;
    } else {
      const initPv = roomDef.initialProperties.get(propName);
      if (initPv === void 0 || propToScalarInt(initPv) === 0) continue;
    }
    const longName = compassNames.get(propName) ?? dir.defaultLongName;
    exits.push({
      shortName: dir.shortName,
      longName,
      command: dir.command,
      directionProperty: dir.directionProperty
    });
  }
  return exits;
}
function collectTargets(state, containerId, location, classHierarchy, playerId) {
  const children = state.treeState.getChildren(containerId);
  const targets = [];
  for (const childId of children) {
    if (childId.toLowerCase() === playerId.toLowerCase()) continue;
    const childDef = state.definition.objects.get(childId.toLowerCase());
    if (childDef === void 0) continue;
    if (childDef.className?.toLowerCase() === "compassdirection") continue;
    if (classHierarchy.has(childId.toLowerCase())) continue;
    if (state.treeState.hasAttribute(childId, "concealed")) continue;
    if (childDef.shortName === "") continue;
    targets.push({
      objectNumber: childDef.number,
      objectId: childDef.id,
      shortName: childDef.shortName,
      command: `examine ${childDef.shortName}`,
      location
    });
  }
  return targets;
}
function deriveTargets(state) {
  const locationNum = getGlobal(state, "location");
  if (locationNum === 0) return [];
  const roomId = state.definition.objectIds.getName(locationNum);
  if (roomId === "nothing") return [];
  const playerNum = getGlobal(state, "player");
  const playerId = playerNum !== 0 ? state.definition.objectIds.getName(playerNum) : "selfobj";
  const classHierarchy = state.definition.classHierarchy;
  const roomTargets = collectTargets(state, roomId, "room", classHierarchy, playerId);
  const inventoryTargets = collectTargets(state, playerId, "inventory", classHierarchy, playerId);
  return [...roomTargets, ...inventoryTargets];
}
function deriveTakeable(state) {
  const locationNum = getGlobal(state, "location");
  if (locationNum === 0) return [];
  const roomId = state.definition.objectIds.getName(locationNum);
  if (roomId === "nothing") return [];
  const playerNum = getGlobal(state, "player");
  const playerId = playerNum !== 0 ? state.definition.objectIds.getName(playerNum) : "selfobj";
  const classHierarchy = state.definition.classHierarchy;
  const children = state.treeState.getChildren(roomId);
  const items = [];
  for (const childId of children) {
    if (childId.toLowerCase() === playerId.toLowerCase()) continue;
    const childDef = state.definition.objects.get(childId.toLowerCase());
    if (childDef === void 0) continue;
    if (childDef.className?.toLowerCase() === "compassdirection") continue;
    if (classHierarchy.has(childId.toLowerCase())) continue;
    if (childDef.shortName === "") continue;
    if (state.treeState.hasAttribute(childId, "static")) continue;
    if (state.treeState.hasAttribute(childId, "scenery")) continue;
    if (childDef.initialAttributes.has("static")) continue;
    if (childDef.initialAttributes.has("scenery")) continue;
    if (state.treeState.hasAttribute(childId, "concealed")) continue;
    items.push({
      objectNumber: childDef.number,
      objectId: childDef.id,
      shortName: childDef.shortName
    });
  }
  return items;
}
function deriveDroppable(state) {
  const playerNum = getGlobal(state, "player");
  const playerId = playerNum !== 0 ? state.definition.objectIds.getName(playerNum) : "selfobj";
  const classHierarchy = state.definition.classHierarchy;
  const children = state.treeState.getChildren(playerId);
  const items = [];
  for (const childId of children) {
    const childDef = state.definition.objects.get(childId.toLowerCase());
    if (childDef === void 0) continue;
    if (classHierarchy.has(childId.toLowerCase())) continue;
    if (childDef.shortName === "") continue;
    items.push({
      objectNumber: childDef.number,
      objectId: childDef.id,
      shortName: childDef.shortName
    });
  }
  return items;
}
function deriveGameViewModel(state, inputRequest, recentOutput) {
  const inputContext = detectInputContext(inputRequest, recentOutput);
  if (inputContext !== "command") {
    return { inputContext, exits: [], targets: [], takeable: [], droppable: [] };
  }
  return {
    inputContext,
    exits: deriveExits(state),
    targets: deriveTargets(state),
    takeable: deriveTakeable(state),
    droppable: deriveDroppable(state)
  };
}
export {
  deriveGameViewModel
};
