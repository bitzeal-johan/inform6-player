import {
  serializeStateToJson,
  deserializeStateFromJson
} from "@inform6sharp/game-runner";
const DB_NAME = "inform6sharp-saves";
const DB_VERSION = 2;
const STORE_NAME = "game-states";
const SLOT_AUTO = "auto";
const SLOT_MANUAL_DEFAULT = "save-1";
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = event.oldVersion;
      if (oldVersion < 1) {
        db.createObjectStore(STORE_NAME, { keyPath: ["gameId", "gameVersion", "slotId"] });
        return;
      }
      if (oldVersion < 2) {
        let maybeMigrate2 = function() {
          if (loaded < 2) return;
          db.deleteObjectStore(STORE_NAME);
          const newStore = db.createObjectStore(STORE_NAME, {
            keyPath: ["gameId", "gameVersion", "slotId"]
          });
          for (let i = 0; i < allKeys.length; i++) {
            const key = allKeys[i];
            const value = allValues[i];
            const gameId = typeof key === "string" ? key : String(key);
            let stateJson;
            let transcript = [];
            if (typeof value === "string") {
              try {
                const parsed = JSON.parse(value);
                if (parsed["version"] === 1) {
                  stateJson = parsed["state"];
                  transcript = parsed["transcript"] ?? [];
                } else {
                  stateJson = value;
                }
              } catch {
                stateJson = value;
              }
            } else {
              continue;
            }
            const record = {
              gameId,
              gameVersion: "unknown",
              slotId: SLOT_AUTO,
              savedAt: (/* @__PURE__ */ new Date()).toISOString(),
              version: 2,
              state: stateJson,
              transcript
            };
            newStore.put(record);
          }
        };
        var maybeMigrate = maybeMigrate2;
        const tx = request.transaction;
        if (tx === null) return;
        const oldStore = tx.objectStore(STORE_NAME);
        const getAllRequest = oldStore.getAll();
        const getAllKeysRequest = oldStore.getAllKeys();
        let allValues = [];
        let allKeys = [];
        let loaded = 0;
        getAllRequest.onsuccess = () => {
          allValues = getAllRequest.result;
          loaded++;
          maybeMigrate2();
        };
        getAllKeysRequest.onsuccess = () => {
          allKeys = getAllKeysRequest.result;
          loaded++;
          maybeMigrate2();
        };
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function withTransaction(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = fn(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function createGameStore() {
  return {
    async saveBundle(gameId, gameVersion, slotId, state, transcript) {
      const record = {
        gameId,
        gameVersion,
        slotId,
        savedAt: (/* @__PURE__ */ new Date()).toISOString(),
        version: 2,
        state: serializeStateToJson(state),
        transcript: [...transcript]
      };
      const db = await openDatabase();
      try {
        await withTransaction(db, "readwrite", (store) => store.put(record));
      } finally {
        db.close();
      }
    },
    async loadBundle(gameId, gameVersion, slotId, definition) {
      const db = await openDatabase();
      try {
        const raw = await withTransaction(
          db,
          "readonly",
          (store) => store.get([gameId, gameVersion, slotId])
        );
        if (raw === void 0) return null;
        const gameState = deserializeStateFromJson(raw.state, definition);
        return {
          state: gameState,
          transcript: raw.transcript,
          savedAt: raw.savedAt
        };
      } finally {
        db.close();
      }
    },
    async deleteSlot(gameId, gameVersion, slotId) {
      const db = await openDatabase();
      try {
        await withTransaction(
          db,
          "readwrite",
          (store) => store.delete([gameId, gameVersion, slotId])
        );
      } finally {
        db.close();
      }
    },
    async deleteAllSlots(gameId, gameVersion) {
      const db = await openDatabase();
      try {
        await new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const request = store.openCursor();
          request.onsuccess = () => {
            const cursor = request.result;
            if (cursor === null) {
              resolve();
              return;
            }
            const record = cursor.value;
            if (record.gameId === gameId && record.gameVersion === gameVersion) {
              cursor.delete();
            }
            cursor.continue();
          };
          request.onerror = () => reject(request.error);
        });
      } finally {
        db.close();
      }
    }
  };
}
export {
  SLOT_AUTO,
  SLOT_MANUAL_DEFAULT,
  createGameStore
};
