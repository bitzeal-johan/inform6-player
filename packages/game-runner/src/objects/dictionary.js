import { toInt } from "../values/inform-value.js";
class Dictionary {
  static DICT_VERB = 1;
  static DICT_META = 2;
  static DICT_PLUR = 4;
  static DICT_NOUN = 128;
  static DICT_WORD_SIZE = 9;
  wordToId;
  idToWord;
  wordFlags;
  verbNumbers;
  constructor(wordToId, idToWord, wordFlags, verbNumbers) {
    this.wordToId = wordToId ?? /* @__PURE__ */ new Map();
    this.idToWord = idToWord ?? /* @__PURE__ */ new Map();
    this.wordFlags = wordFlags ?? /* @__PURE__ */ new Map();
    this.verbNumbers = verbNumbers ?? /* @__PURE__ */ new Map();
  }
  static empty = new Dictionary();
  static truncateWord(word) {
    return word.length > Dictionary.DICT_WORD_SIZE ? word.substring(0, Dictionary.DICT_WORD_SIZE) : word;
  }
  static stripPadding(word) {
    const idx = word.indexOf("//");
    return idx >= 0 ? word.substring(0, idx) : word;
  }
  /** Look up the ID for a word. Returns 0 if not found. */
  lookupWord(word) {
    const normalized = Dictionary.truncateWord(
      Dictionary.stripPadding(word.toLowerCase())
    );
    return this.wordToId.get(normalized) ?? 0;
  }
  /** Get the word for a given ID. */
  getWord(id) {
    return this.idToWord.get(id) ?? null;
  }
  /** Check if a word exists in the dictionary. */
  containsWord(word) {
    return this.wordToId.has(Dictionary.truncateWord(word.toLowerCase()));
  }
  /** Get flags for a dictionary word ID. */
  getWordFlags(wordId) {
    return this.wordFlags.get(wordId) ?? 0;
  }
  /** Get a byte from a dictionary entry at the given offset. */
  getDictionaryByte(wordAddress, offset) {
    const wordId = toInt(wordAddress);
    if (wordId < 1048576) return 0;
    if (offset === Dictionary.DICT_WORD_SIZE + 1) return 0;
    if (offset === Dictionary.DICT_WORD_SIZE + 2) {
      return this.getWordFlags(wordId);
    }
    if (offset === Dictionary.DICT_WORD_SIZE + 3) {
      const encoded = this.verbNumbers.get(wordId);
      return encoded !== void 0 ? encoded >> 8 & 255 : 0;
    }
    if (offset === Dictionary.DICT_WORD_SIZE + 4) {
      const encoded = this.verbNumbers.get(wordId);
      return encoded !== void 0 ? encoded & 255 : 0;
    }
    return 0;
  }
  /** Create a dictionary from a collection of words. */
  static create(words) {
    const wordToIdMap = /* @__PURE__ */ new Map();
    const idToWordMap = /* @__PURE__ */ new Map();
    let nextId = 1048576;
    const processed = [...new Set(
      [...words].map((w) => w.trim()).map((w) => Dictionary.truncateWord(w)).map((w) => w.toLowerCase())
    )].sort();
    for (const word of processed) {
      wordToIdMap.set(word, nextId);
      idToWordMap.set(nextId, word);
      nextId += 16;
    }
    return new Dictionary(wordToIdMap, idToWordMap);
  }
  /** Create new dictionary with verb flags set. */
  withVerbWords(verbWords) {
    const newFlags = new Map(this.wordFlags);
    for (const word of verbWords) {
      const normalized = Dictionary.truncateWord(word.toLowerCase());
      const wordId = this.wordToId.get(normalized);
      if (wordId !== void 0) {
        newFlags.set(wordId, (newFlags.get(wordId) ?? 0) | Dictionary.DICT_VERB);
      }
    }
    return new Dictionary(this.wordToId, this.idToWord, newFlags, this.verbNumbers);
  }
  /** Create new dictionary with meta-verb flags set (score, save, restore, etc.). */
  withMetaVerbWords(metaVerbWords) {
    const newFlags = new Map(this.wordFlags);
    for (const word of metaVerbWords) {
      const normalized = Dictionary.truncateWord(word.toLowerCase());
      const wordId = this.wordToId.get(normalized);
      if (wordId !== void 0) {
        newFlags.set(wordId, (newFlags.get(wordId) ?? 0) | Dictionary.DICT_VERB | Dictionary.DICT_META);
      }
    }
    return new Dictionary(this.wordToId, this.idToWord, newFlags, this.verbNumbers);
  }
  /** Create new dictionary with plural flags set (for words with //p marker). */
  withPluralWords(pluralWords) {
    const newFlags = new Map(this.wordFlags);
    for (const word of pluralWords) {
      const normalized = Dictionary.truncateWord(word.toLowerCase());
      const wordId = this.wordToId.get(normalized);
      if (wordId !== void 0) {
        newFlags.set(wordId, (newFlags.get(wordId) ?? 0) | Dictionary.DICT_PLUR);
      }
    }
    return new Dictionary(this.wordToId, this.idToWord, newFlags, this.verbNumbers);
  }
  /** Create new dictionary with noun flags set. */
  withNounWords(nounWords) {
    const newFlags = new Map(this.wordFlags);
    for (const word of nounWords) {
      const normalized = Dictionary.truncateWord(word.toLowerCase());
      const wordId = this.wordToId.get(normalized);
      if (wordId !== void 0) {
        newFlags.set(wordId, (newFlags.get(wordId) ?? 0) | Dictionary.DICT_NOUN);
      }
    }
    return new Dictionary(this.wordToId, this.idToWord, newFlags, this.verbNumbers);
  }
  /** Create new dictionary with verb numbers assigned. */
  withVerbNumbers(entries) {
    const newVerbNumbers = new Map(this.verbNumbers);
    for (const [word, verbNumber] of entries) {
      const normalized = Dictionary.truncateWord(word.toLowerCase());
      const wordId = this.wordToId.get(normalized);
      if (wordId !== void 0) {
        newVerbNumbers.set(wordId, 65535 - verbNumber);
      }
    }
    return new Dictionary(this.wordToId, this.idToWord, this.wordFlags, newVerbNumbers);
  }
}
export {
  Dictionary
};
