import React from 'react';
import { type InputRequest } from '@inform6sharp/game-runner';
import { type TranscriptEntry } from '../hooks/use-game-engine.js';
import { type StyleOverrides } from '../types/style-overrides.js';
interface TranscriptProps {
    readonly entries: readonly TranscriptEntry[];
    readonly inputRequest: InputRequest;
    readonly onSubmitLine: (input: string) => void;
    readonly inputRef: React.RefObject<HTMLInputElement>;
    readonly styleOverrides?: StyleOverrides;
}
/**
 * Scrollable text output area showing game transcript.
 *
 * Each `TranscriptEntry` is a list of `StyledRun`s; we render one `<span>`
 * per run with CSS derived from its `TextStyle`. Input echoes compose a
 * bold overlay on top of each run's base style so the `> command\n` line
 * remains visually distinct.
 *
 * The line input is rendered inline at the end of the transcript when the
 * engine is waiting for line input, so the caret sits on the same visual
 * row as the game's last printed line — just like a classic terminal. When
 * the engine is waiting for a character keypress, an italic hint is shown
 * inline instead; the actual keypress capture happens in `CharInput`
 * through a document-level listener.
 *
 * Auto-scrolls to the bottom on new entries.
 */
export declare function Transcript({ entries, inputRequest, onSubmitLine, inputRef, styleOverrides, }: TranscriptProps): React.ReactElement;
export {};
