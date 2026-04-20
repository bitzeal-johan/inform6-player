import { type InformValue } from '../values/inform-value.js';
/**
 * Dictionary word lookup and metadata.
 * Dictionary entries are spaced 16 bytes apart starting at 0x100000.
 */
export declare class Dictionary {
    static readonly DICT_VERB = 1;
    static readonly DICT_META = 2;
    static readonly DICT_PLUR = 4;
    static readonly DICT_NOUN = 128;
    static readonly DICT_WORD_SIZE = 9;
    readonly wordToId: ReadonlyMap<string, number>;
    readonly idToWord: ReadonlyMap<number, string>;
    readonly wordFlags: ReadonlyMap<number, number>;
    readonly verbNumbers: ReadonlyMap<number, number>;
    constructor(wordToId?: ReadonlyMap<string, number>, idToWord?: ReadonlyMap<number, string>, wordFlags?: ReadonlyMap<number, number>, verbNumbers?: ReadonlyMap<number, number>);
    static readonly empty: Dictionary;
    private static truncateWord;
    private static stripPadding;
    /** Look up the ID for a word. Returns 0 if not found. */
    lookupWord(word: string): number;
    /** Get the word for a given ID. */
    getWord(id: number): string | null;
    /** Check if a word exists in the dictionary. */
    containsWord(word: string): boolean;
    /** Get flags for a dictionary word ID. */
    getWordFlags(wordId: number): number;
    /** Get a byte from a dictionary entry at the given offset. */
    getDictionaryByte(wordAddress: InformValue, offset: number): number;
    /** Create a dictionary from a collection of words. */
    static create(words: Iterable<string>): Dictionary;
    /** Create new dictionary with verb flags set. */
    withVerbWords(verbWords: Iterable<string>): Dictionary;
    /** Create new dictionary with meta-verb flags set (score, save, restore, etc.). */
    withMetaVerbWords(metaVerbWords: Iterable<string>): Dictionary;
    /** Create new dictionary with plural flags set (for words with //p marker). */
    withPluralWords(pluralWords: Iterable<string>): Dictionary;
    /** Create new dictionary with noun flags set. */
    withNounWords(nounWords: Iterable<string>): Dictionary;
    /** Create new dictionary with verb numbers assigned. */
    withVerbNumbers(entries: Iterable<[string, number]>): Dictionary;
}
