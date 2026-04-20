import { type GameState } from '../state/game-state.js';
import { type InputRequest } from '../io/output-event.js';
import { type OutputEvent } from '../io/output-event.js';
export type InputContext = 'command' | 'disambiguation' | 'char' | 'none';
export interface NavigationExit {
    readonly shortName: string;
    readonly longName: string;
    readonly command: string;
    readonly directionProperty: string;
}
export type TargetLocation = 'room' | 'inventory';
export interface ExaminableTarget {
    readonly objectNumber: number;
    readonly objectId: string;
    readonly shortName: string;
    readonly command: string;
    readonly location: TargetLocation;
}
export interface InventoryItem {
    readonly objectNumber: number;
    readonly objectId: string;
    readonly shortName: string;
}
export interface GameViewModel {
    readonly inputContext: InputContext;
    readonly exits: readonly NavigationExit[];
    readonly targets: readonly ExaminableTarget[];
    readonly takeable: readonly InventoryItem[];
    readonly droppable: readonly InventoryItem[];
}
export declare function deriveGameViewModel(state: GameState, inputRequest: InputRequest, recentOutput: readonly OutputEvent[]): GameViewModel;
