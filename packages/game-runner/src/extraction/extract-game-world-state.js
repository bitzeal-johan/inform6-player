const DIRECTION_PROPS = /* @__PURE__ */ new Map([
  ["north", "n_to"],
  ["south", "s_to"],
  ["east", "e_to"],
  ["west", "w_to"],
  ["northeast", "ne_to"],
  ["northwest", "nw_to"],
  ["southeast", "se_to"],
  ["southwest", "sw_to"],
  ["up", "u_to"],
  ["down", "d_to"],
  ["in", "in_to"],
  ["out", "out_to"]
]);
function extractStatus(state) {
  const deadflag = state.globals.getInt("deadflag");
  if (deadflag === 0) return { kind: "playing" };
  if (deadflag === 1) return { kind: "dead" };
  if (deadflag === 2) return { kind: "won" };
  return { kind: "ended", endingNumber: deadflag };
}
function lookupProperty(state, objId, propName) {
  const treeProp = state.treeState.getProperty(objId, propName);
  if (treeProp !== null) return treeProp;
  const objDef = state.definition.objects.get(objId);
  if (objDef === void 0) return null;
  return objDef.initialProperties.get(propName) ?? null;
}
function buildRoomInfo(state, objId) {
  const objDef = state.definition.objects.get(objId);
  return {
    id: objId,
    objectNumber: objDef?.number ?? 0,
    shortName: objDef?.shortName ?? "",
    visited: state.treeState.hasAttribute(objId, "visited"),
    lit: state.treeState.hasAttribute(objId, "light")
  };
}
function buildObjectAttributes(state, objId) {
  const has = (attr) => state.treeState.hasAttribute(objId, attr);
  return {
    container: has("container"),
    open: has("open"),
    openable: has("openable"),
    locked: has("locked"),
    lockable: has("lockable"),
    supporter: has("supporter"),
    clothing: has("clothing"),
    worn: has("worn"),
    edible: has("edible"),
    switchable: has("switchable"),
    on: has("on"),
    scenery: has("scenery"),
    static: has("static"),
    transparent: has("transparent"),
    enterable: has("enterable")
  };
}
function hasDescription(state, objId) {
  return lookupProperty(state, objId, "description") !== null;
}
function buildObjectInfo(state, objId) {
  const objDef = state.definition.objects.get(objId);
  const isStatic = state.treeState.hasAttribute(objId, "static");
  const isScenery = state.treeState.hasAttribute(objId, "scenery");
  const isAnimate = state.treeState.hasAttribute(objId, "animate");
  return {
    id: objId,
    objectNumber: objDef?.number ?? 0,
    shortName: objDef?.shortName ?? "",
    takeable: !isStatic && !isScenery && !isAnimate,
    hasDescription: hasDescription(state, objId),
    attributes: buildObjectAttributes(state, objId)
  };
}
function buildNpcInfo(state, objId) {
  const objDef = state.definition.objects.get(objId);
  return {
    id: objId,
    objectNumber: objDef?.number ?? 0,
    shortName: objDef?.shortName ?? "",
    talkable: state.treeState.hasAttribute(objId, "talkable")
  };
}
function classifyExitKind(state, prop) {
  if (prop.kind === "routine") return { kind: "routine", destinationId: null };
  if (prop.kind === "string") return { kind: "string", destinationId: null };
  if (prop.kind === "int") {
    const destId = state.definition.objectIds.getName(prop.value);
    if (destId === "nothing") return { kind: "room", destinationId: null };
    if (state.treeState.hasAttribute(destId, "door")) {
      return { kind: "door", destinationId: destId };
    }
    return { kind: "room", destinationId: destId };
  }
  return { kind: "room", destinationId: null };
}
function extractExits(state, roomId) {
  const exits = [];
  for (const [direction, propName] of DIRECTION_PROPS) {
    const prop = lookupProperty(state, roomId, propName);
    if (prop === null) continue;
    if (prop.kind === "int" && prop.value === 0) continue;
    const { kind, destinationId } = classifyExitKind(state, prop);
    const destination = destinationId !== null ? buildRoomInfo(state, destinationId) : null;
    exits.push({
      direction,
      kind,
      destination,
      command: `go ${direction}`
    });
  }
  return exits;
}
function extractRoomContents(state, roomId, playerId) {
  const children = state.treeState.getChildren(roomId);
  return children.filter((id) => {
    if (id === playerId) return false;
    if (state.treeState.hasAttribute(id, "scenery")) return false;
    if (state.treeState.hasAttribute(id, "animate")) return false;
    if (state.treeState.hasAttribute(id, "concealed")) return false;
    return true;
  }).map((id) => buildObjectInfo(state, id));
}
function extractExaminables(state, roomId, playerId) {
  const children = state.treeState.getChildren(roomId);
  return children.filter((id) => {
    if (id === playerId) return false;
    if (state.treeState.hasAttribute(id, "concealed")) return false;
    return hasDescription(state, id);
  }).map((id) => buildObjectInfo(state, id));
}
function extractNpcs(state, roomId, playerId) {
  const children = state.treeState.getChildren(roomId);
  return children.filter((id) => {
    if (id === playerId) return false;
    return state.treeState.hasAttribute(id, "animate");
  }).map((id) => buildNpcInfo(state, id));
}
function extractInventory(state, playerId) {
  const children = state.treeState.getChildren(playerId);
  return children.map((id) => buildObjectInfo(state, id));
}
function extractGameWorldState(state) {
  const locationNum = state.globals.getInt("location");
  const roomId = state.definition.objectIds.getName(locationNum);
  const playerNum = state.globals.getInt("player");
  const playerId = state.definition.objectIds.getName(playerNum);
  return {
    status: extractStatus(state),
    score: state.globals.getInt("score"),
    turns: state.globals.getInt("turns"),
    room: buildRoomInfo(state, roomId),
    exits: extractExits(state, roomId),
    roomContents: extractRoomContents(state, roomId, playerId),
    examinables: extractExaminables(state, roomId, playerId),
    npcs: extractNpcs(state, roomId, playerId),
    inventory: extractInventory(state, playerId)
  };
}
export {
  extractGameWorldState
};
