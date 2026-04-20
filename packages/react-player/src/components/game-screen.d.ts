import React from 'react';
import { type GameEngineState } from '../hooks/use-game-engine.js';
import { type ResolvedTerminal } from '../types/terminal-config.js';
import { type StyleOverrides } from '../types/style-overrides.js';
interface GameScreenProps {
    readonly engine: GameEngineState;
    readonly terminal: ResolvedTerminal;
    readonly styleOverrides?: StyleOverrides;
    readonly hideStatusBar?: boolean;
}
/**
 * Layout composition: status bar (top) + transcript (fills remaining).
 * The line input is rendered inline at the end of the transcript so the
 * cursor sits directly under the game's last printed line, mimicking a
 * classic terminal.
 *
 * Clicking anywhere in the game view focuses the inline input, unless the
 * user is in the middle of selecting text (collapsed-selection check).
 */
export declare function GameScreen({ engine, terminal, styleOverrides, hideStatusBar }: GameScreenProps): React.ReactElement;
export {};
