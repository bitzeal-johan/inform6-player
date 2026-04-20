import { type Glk, type GameState } from '@inform6sharp/game-runner';
import { type ReactGameIO } from './react-game-io.js';
import { type ResolvedTerminal } from '../types/terminal-config.js';
/**
 * Glk implementation for the React player.
 * Mirrors StubGlk from game-runner but uses configurable terminal dimensions
 * and bridges to ReactGameIO for async input.
 */
export declare class ReactGlk implements Glk {
    private readonly _io;
    private readonly _terminal;
    private _pendingWindow;
    private _pendingBuffer;
    private _pendingMaxLen;
    private _pendingCharWindow;
    private _pendingCharRequest;
    constructor(io: ReactGameIO, terminal: ResolvedTerminal);
    call(selector: number, args: number[], state: GameState): Promise<[GameState, number]>;
}
