import { type GameState } from '../state/game-state.js';
/**
 * Discriminated union for all I/O output actions emitted during a turn.
 * Used by turn-based frontends (React) to render game output.
 */
export type OutputEvent = PrintEvent | PrintCharEvent | PrintLineEvent | ClearEvent | SetCursorEvent | SetWindowEvent | SplitWindowEvent | SetColorEvent | SetFontEvent | SetStyleEvent;
export interface PrintEvent {
    readonly kind: 'print';
    readonly text: string;
}
export interface PrintCharEvent {
    readonly kind: 'printChar';
    readonly charCode: number;
}
export interface PrintLineEvent {
    readonly kind: 'printLine';
    readonly text: string;
}
export interface ClearEvent {
    readonly kind: 'clear';
}
export interface SetCursorEvent {
    readonly kind: 'setCursor';
    readonly row: number;
    readonly column: number;
}
export interface SetWindowEvent {
    readonly kind: 'setWindow';
    readonly windowId: number;
}
export interface SplitWindowEvent {
    readonly kind: 'splitWindow';
    readonly lines: number;
}
export interface SetColorEvent {
    readonly kind: 'setColor';
    readonly foreground: number;
    readonly background: number;
}
export interface SetFontEvent {
    readonly kind: 'setFont';
    readonly fontId: number;
}
export interface SetStyleEvent {
    readonly kind: 'setStyle';
    readonly styleName: string;
}
/**
 * What kind of input the game is waiting for.
 */
export type InputRequest = LineInputRequest | CharInputRequest | NoInputRequest;
export interface LineInputRequest {
    readonly kind: 'line';
}
export interface CharInputRequest {
    readonly kind: 'char';
}
export interface NoInputRequest {
    readonly kind: 'none';
}
/**
 * Result of running one game turn.
 * Contains the output events produced and what input (if any) the game needs next.
 */
export interface TurnResult {
    readonly events: readonly OutputEvent[];
    readonly inputRequest: InputRequest;
    readonly state: GameState;
}
