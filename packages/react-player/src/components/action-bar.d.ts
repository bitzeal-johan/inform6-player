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
 * Derives available actions from GameState via deriveGameViewModel.
 * Hidden when the game is not waiting for a normal command (e.g. during
 * disambiguation, character input, or while the game is running).
 *
 * Primary row: Inv + direction exits + Take + Examine + "..."
 * "Take" expands: "All" + individual takeable room objects
 * "Examine" expands: room objects (Here) + inventory objects (Carrying)
 * "..." expands: Look, Wait, Drop, Save, Restore, Restart
 * "Drop" (inside "...") expands: "All" + individual inventory items
 */
export declare function ActionBar({ gameState, inputRequest, recentOutput, onSubmit }: ActionBarProps): React.ReactElement | null;
export {};
