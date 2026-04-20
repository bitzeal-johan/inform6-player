import React from 'react';
interface LineInputProps {
    readonly onSubmit: (input: string) => void;
}
/**
 * Inline text input for line-mode input. Rendered at the end of the
 * transcript so the caret sits immediately after the last line the game
 * printed, mimicking a classic terminal. The caller owns the underlying
 * `<input>` ref via `React.forwardRef` so it can focus the input on
 * container clicks.
 */
export declare const LineInput: React.ForwardRefExoticComponent<LineInputProps & React.RefAttributes<HTMLInputElement>>;
export {};
