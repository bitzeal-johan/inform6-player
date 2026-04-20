/**
 * Strongly-typed game world state extracted from a GameState.
 * Used by UI layers (terminal-player, React) to render game information.
 */
export type GameStatus = {
    readonly kind: 'playing';
} | {
    readonly kind: 'dead';
} | {
    readonly kind: 'won';
} | {
    readonly kind: 'ended';
    readonly endingNumber: number;
};
export type Direction = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest' | 'up' | 'down' | 'in' | 'out';
export interface RoomInfo {
    readonly id: string;
    readonly objectNumber: number;
    readonly shortName: string;
    readonly visited: boolean;
    readonly lit: boolean;
}
export interface ExitInfo {
    readonly direction: Direction;
    readonly kind: 'room' | 'door' | 'routine' | 'string';
    readonly destination: RoomInfo | null;
    readonly command: string;
}
export interface ObjectAttributes {
    readonly container: boolean;
    readonly open: boolean;
    readonly openable: boolean;
    readonly locked: boolean;
    readonly lockable: boolean;
    readonly supporter: boolean;
    readonly clothing: boolean;
    readonly worn: boolean;
    readonly edible: boolean;
    readonly switchable: boolean;
    readonly on: boolean;
    readonly scenery: boolean;
    readonly static: boolean;
    readonly transparent: boolean;
    readonly enterable: boolean;
}
export interface ObjectInfo {
    readonly id: string;
    readonly objectNumber: number;
    readonly shortName: string;
    readonly takeable: boolean;
    readonly hasDescription: boolean;
    readonly attributes: ObjectAttributes;
}
export interface NpcInfo {
    readonly id: string;
    readonly objectNumber: number;
    readonly shortName: string;
    readonly talkable: boolean;
}
export interface GameWorldState {
    readonly status: GameStatus;
    readonly score: number;
    readonly turns: number;
    readonly room: RoomInfo;
    readonly exits: readonly ExitInfo[];
    readonly roomContents: readonly ObjectInfo[];
    readonly examinables: readonly ObjectInfo[];
    readonly npcs: readonly NpcInfo[];
    readonly inventory: readonly ObjectInfo[];
}
