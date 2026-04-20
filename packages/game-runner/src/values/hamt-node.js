function hashString(key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function hashNumber(key) {
  let h = key | 0;
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}
var NodeKind = /* @__PURE__ */ ((NodeKind2) => {
  NodeKind2[NodeKind2["Leaf"] = 0] = "Leaf";
  NodeKind2[NodeKind2["Branch"] = 1] = "Branch";
  NodeKind2[NodeKind2["Collision"] = 2] = "Collision";
  return NodeKind2;
})(NodeKind || {});
const BITS_PER_LEVEL = 5;
const MASK = 31;
function popcount(x) {
  x = x - (x >>> 1 & 1431655765);
  x = (x & 858993459) + (x >>> 2 & 858993459);
  return (x + (x >>> 4) & 252645135) * 16843009 >>> 24;
}
function fragment(hash, shift) {
  return hash >>> shift & MASK;
}
function compactIndex(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}
function hamtGet(node, hash, key, shift) {
  if (node === null) return void 0;
  switch (node.kind) {
    case 0 /* Leaf */:
      return node.key === key ? node.value : void 0;
    case 1 /* Branch */: {
      const frag = fragment(hash, shift);
      const bit = 1 << frag;
      if ((node.bitmap & bit) === 0) return void 0;
      const idx = compactIndex(node.bitmap, bit);
      return hamtGet(node.children[idx], hash, key, shift + BITS_PER_LEVEL);
    }
    case 2 /* Collision */: {
      for (const entry of node.entries) {
        if (entry[0] === key) return entry[1];
      }
      return void 0;
    }
  }
}
function hamtSet(node, hash, key, value, shift) {
  if (node === null) {
    return {
      node: { kind: 0 /* Leaf */, hash, key, value },
      added: true
    };
  }
  switch (node.kind) {
    case 0 /* Leaf */: {
      if (node.key === key) {
        if (node.value === value) return { node, added: false };
        return {
          node: { kind: 0 /* Leaf */, hash, key, value },
          added: false
        };
      }
      if (node.hash === hash) {
        return {
          node: {
            kind: 2 /* Collision */,
            hash,
            entries: [[node.key, node.value], [key, value]]
          },
          added: true
        };
      }
      return splitLeaves(node, hash, key, value, shift);
    }
    case 1 /* Branch */: {
      const frag = fragment(hash, shift);
      const bit = 1 << frag;
      const idx = compactIndex(node.bitmap, bit);
      if ((node.bitmap & bit) === 0) {
        const newChild = { kind: 0 /* Leaf */, hash, key, value };
        const newChildren2 = arrayInsert(node.children, idx, newChild);
        return {
          node: { kind: 1 /* Branch */, bitmap: node.bitmap | bit, children: newChildren2 },
          added: true
        };
      }
      const result = hamtSet(node.children[idx], hash, key, value, shift + BITS_PER_LEVEL);
      if (result.node === node.children[idx]) return { node, added: false };
      const newChildren = arrayReplace(node.children, idx, result.node);
      return {
        node: { kind: 1 /* Branch */, bitmap: node.bitmap, children: newChildren },
        added: result.added
      };
    }
    case 2 /* Collision */: {
      if (hash !== node.hash) {
        const result = hamtSet(
          { kind: 1 /* Branch */, bitmap: 0, children: [] },
          node.hash,
          null,
          null,
          shift
        );
        const collisionFrag = fragment(node.hash, shift);
        const collisionBit = 1 << collisionFrag;
        const branch = {
          kind: 1 /* Branch */,
          bitmap: collisionBit,
          children: [node]
        };
        return hamtSet(branch, hash, key, value, shift);
      }
      for (let i = 0; i < node.entries.length; i++) {
        if (node.entries[i][0] === key) {
          if (node.entries[i][1] === value) return { node, added: false };
          const newEntries = [...node.entries];
          newEntries[i] = [key, value];
          return {
            node: { kind: 2 /* Collision */, hash, entries: newEntries },
            added: false
          };
        }
      }
      return {
        node: { kind: 2 /* Collision */, hash, entries: [...node.entries, [key, value]] },
        added: true
      };
    }
  }
}
function hamtDelete(node, hash, key, shift) {
  if (node === null) return { node: null, removed: false };
  switch (node.kind) {
    case 0 /* Leaf */:
      if (node.key === key) return { node: null, removed: true };
      return { node, removed: false };
    case 1 /* Branch */: {
      const frag = fragment(hash, shift);
      const bit = 1 << frag;
      if ((node.bitmap & bit) === 0) return { node, removed: false };
      const idx = compactIndex(node.bitmap, bit);
      const result = hamtDelete(node.children[idx], hash, key, shift + BITS_PER_LEVEL);
      if (!result.removed) return { node, removed: false };
      if (result.node === null) {
        const newBitmap = node.bitmap ^ bit;
        if (newBitmap === 0) return { node: null, removed: true };
        const newChildren2 = arrayRemove(node.children, idx);
        if (newChildren2.length === 1 && newChildren2[0].kind === 0 /* Leaf */) {
          return { node: newChildren2[0], removed: true };
        }
        return {
          node: { kind: 1 /* Branch */, bitmap: newBitmap, children: newChildren2 },
          removed: true
        };
      }
      const newChildren = arrayReplace(node.children, idx, result.node);
      return {
        node: { kind: 1 /* Branch */, bitmap: node.bitmap, children: newChildren },
        removed: true
      };
    }
    case 2 /* Collision */: {
      const idx = node.entries.findIndex((e) => e[0] === key);
      if (idx === -1) return { node, removed: false };
      if (node.entries.length === 2) {
        const remaining = node.entries[1 - idx];
        return {
          node: { kind: 0 /* Leaf */, hash: node.hash, key: remaining[0], value: remaining[1] },
          removed: true
        };
      }
      const newEntries = [...node.entries];
      newEntries.splice(idx, 1);
      return {
        node: { kind: 2 /* Collision */, hash: node.hash, entries: newEntries },
        removed: true
      };
    }
  }
}
function* hamtEntries(node) {
  if (node === null) return;
  switch (node.kind) {
    case 0 /* Leaf */:
      yield [node.key, node.value];
      break;
    case 1 /* Branch */:
      for (const child of node.children) {
        yield* hamtEntries(child);
      }
      break;
    case 2 /* Collision */:
      for (const entry of node.entries) {
        yield [entry[0], entry[1]];
      }
      break;
  }
}
function arrayInsert(arr, idx, value) {
  const result = new Array(arr.length + 1);
  for (let i = 0; i < idx; i++) result[i] = arr[i];
  result[idx] = value;
  for (let i = idx; i < arr.length; i++) result[i + 1] = arr[i];
  return result;
}
function arrayReplace(arr, idx, value) {
  const result = arr.slice();
  result[idx] = value;
  return result;
}
function arrayRemove(arr, idx) {
  const result = new Array(arr.length - 1);
  for (let i = 0; i < idx; i++) result[i] = arr[i];
  for (let i = idx + 1; i < arr.length; i++) result[i - 1] = arr[i];
  return result;
}
function splitLeaves(existing, newHash, newKey, newValue, shift) {
  const existingFrag = fragment(existing.hash, shift);
  const newFrag = fragment(newHash, shift);
  if (existingFrag === newFrag) {
    const deeper = splitLeaves(existing, newHash, newKey, newValue, shift + BITS_PER_LEVEL);
    const bit = 1 << existingFrag;
    return {
      node: { kind: 1 /* Branch */, bitmap: bit, children: [deeper.node] },
      added: true
    };
  }
  const newLeaf = { kind: 0 /* Leaf */, hash: newHash, key: newKey, value: newValue };
  const bit1 = 1 << existingFrag;
  const bit2 = 1 << newFrag;
  const children = existingFrag < newFrag ? [existing, newLeaf] : [newLeaf, existing];
  return {
    node: { kind: 1 /* Branch */, bitmap: bit1 | bit2, children },
    added: true
  };
}
export {
  NodeKind,
  hamtDelete,
  hamtEntries,
  hamtGet,
  hamtSet,
  hashNumber,
  hashString
};
