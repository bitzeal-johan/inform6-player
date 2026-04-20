interface CharInputProps {
    readonly active: boolean;
    readonly onChar: (charCode: number) => void;
}
/**
 * Keypress listener for character-mode input. Pure effect component with
 * no visible DOM — the visible "(press any key)" hint is rendered inline
 * by `Transcript`. When active, this subscribes to `document.keydown` and
 * converts the next printable keypress to a character code.
 */
export declare function CharInput({ active, onChar }: CharInputProps): null;
export {};
