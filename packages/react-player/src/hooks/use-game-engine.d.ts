import { type GameState, type OutputEvent, type InputRequest, type StyledCell, type StyledRun } from '@inform6sharp/game-runner';
import { type GameModule } from '../types/game-module.js';
import { type ResolvedTerminal } from '../types/terminal-config.js';
export type EngineStatus = 'loading' | 'running' | 'waitingForInput' | 'finished' | 'error';
export interface TranscriptEntry {
    readonly kind: 'text' | 'input';
    readonly runs: readonly StyledRun[];
}
export interface StatusGrid {
    readonly lines: number;
    readonly columns: number;
    readonly cells: StyledCell[][];
}
export interface GameEngineState {
    readonly status: EngineStatus;
    readonly transcript: readonly TranscriptEntry[];
    readonly statusGrid: StatusGrid;
    readonly inputRequest: InputRequest;
    readonly recentOutput: readonly OutputEvent[];
    readonly error: string | null;
    readonly gameState: GameState | null;
    readonly submitLine: (input: string) => void;
    readonly submitChar: (charCode: number) => void;
}
/**
 * React hook managing the full game lifecycle.
 * Creates ReactGameIO, runs initialize + main loop, processes events,
 * and persists state to IndexedDB.
 */
export declare function useGameEngine(game: GameModule, gameId: string, terminal: ResolvedTerminal, seed?: number): GameEngineState;
