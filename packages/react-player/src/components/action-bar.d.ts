import React from 'react';
import { type GameState, type InputRequest, type OutputEvent } from '@inform6sharp/game-runner';
interface ActionBarProps {
    readonly gameState: GameState;
    readonly inputRequest: InputRequest;
    readonly recentOutput: readonly OutputEvent[];
    readonly onSubmit: (command: string) => void;
}
/**
 * Quick-action bar for tap-based interaction.
 *
 * Layout: action buttons on the left, 3x3 compass rose + vertical
 * directions on the right. Inactive compass directions are always
 * shown but dimmed. The center cell is a Look button (eye icon).
 *
 * Toggle buttons expand panels below: Take, Examine, and "..." (more).
 */
export declare function ActionBar({ gameState, inputRequest, recentOutput, onSubmit }: ActionBarProps): React.ReactElement | null;
export {};
