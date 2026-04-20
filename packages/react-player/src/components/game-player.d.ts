import React from 'react';
import { type GameModule } from '../types/game-module.js';
import { type TerminalConfig } from '../types/terminal-config.js';
import { type StyleOverrides } from '../types/style-overrides.js';
/**
 * Props for the GamePlayer component.
 */
export interface GamePlayerProps {
    /** The compiled game module. */
    readonly game: GameModule;
    /** Unique identifier for save/load persistence. */
    readonly gameId: string;
    /** Optional terminal breakpoint configuration. */
    readonly terminalConfig?: TerminalConfig;
    /** Optional random seed for deterministic gameplay. */
    readonly seed?: number;
    /** Optional CSS class name for the container. */
    readonly className?: string;
    /**
     * Optional per-game style overrides. When a field is set, the default
     * CSS for the matching Inform6 style flag is replaced entirely by the
     * supplied CSS. Useful when the embedded font lacks a bold variant —
     * e.g. IBM VGA, where `styleOverrides={{ bold: { color: '#0cc' } }}`
     * turns `style bold` into a cyan tint instead of a non-existent weight
     * change.
     */
    readonly styleOverrides?: StyleOverrides;
}
/**
 * Public entry point component for playing Inform6 games.
 *
 * Usage:
 * ```tsx
 * <GamePlayer game={Game} gameId="advent" />
 * ```
 */
export declare function GamePlayer({ game, gameId, terminalConfig, seed, className, styleOverrides, }: GamePlayerProps): React.ReactElement;
