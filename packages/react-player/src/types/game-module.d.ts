import { type GameIO, type GameState, type InformValue } from '@inform6sharp/game-runner';
/**
 * Interface abstracting a compiled Inform6 game module.
 * Generated game code exports a `Game` object conforming to this interface.
 */
export interface GameModule {
    readonly version: string;
    initialize(io: GameIO, randomSeed?: number): Promise<GameState>;
    main(state: GameState, io: GameIO, skipPrologue?: boolean): Promise<[GameState, InformValue]>;
}
