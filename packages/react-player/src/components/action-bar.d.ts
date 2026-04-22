import React from 'react';
import { type GameState, type InputRequest, type OutputEvent } from '@inform6sharp/game-runner';
export interface ActionBarRef {
    dismiss(): void;
}
interface ActionBarProps {
    readonly gameState: GameState;
    readonly inputRequest: InputRequest;
    readonly recentOutput: readonly OutputEvent[];
    readonly onSubmit: (command: string) => void;
}
/**
 * Quick-action bar for tap-based interaction.
 *
 * **Default view:** Two blocks side-by-side — action buttons (left)
 * and compass rose (right) — pushed apart with space-between.
 * Both blocks share the same cell size and gap.
 *
 * **Panel view:** When a toggle is tapped, both blocks are replaced
 * by a full-width vertical item list.  Dismissed by tapping transcript.
 */
export declare const ActionBar: React.ForwardRefExoticComponent<ActionBarProps & React.RefAttributes<ActionBarRef>>;
export {};
