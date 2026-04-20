import React from 'react';
import { type StatusGrid } from '../hooks/use-game-engine.js';
import { type StyleOverrides } from '../types/style-overrides.js';
interface StatusBarProps {
    readonly grid: StatusGrid;
    readonly rowHeightPx: number;
    readonly styleOverrides?: StyleOverrides;
}
/**
 * Renders the Glk status window as a fixed-height character grid.
 * Each row is walked cell-by-cell, coalescing adjacent same-style cells
 * into spans so that per-character style metadata (bold / reverse /
 * underline from the Inform6 `style` statement) is preserved.
 */
export declare function StatusBar({ grid, rowHeightPx, styleOverrides }: StatusBarProps): React.ReactElement | null;
export {};
