/**
 * Inform6 text style model (DM4 §1.29).
 *
 * The `style` statement toggles four additive attributes on the main and
 * status windows. `style roman` clears every attribute; the other names
 * set their respective flag without touching the others. Styles are sticky
 * until another `style` call runs (or the screen is cleared).
 */
export interface TextStyle {
    readonly bold: boolean;
    readonly underline: boolean;
    readonly reverse: boolean;
    readonly fixed: boolean;
}
export declare const ROMAN_STYLE: TextStyle;
/**
 * A single status-window cell: one printable character plus the style that
 * was active when the character was written.
 */
export interface StyledCell {
    readonly char: string;
    readonly style: TextStyle;
}
export declare const EMPTY_CELL: StyledCell;
/**
 * A contiguous run of transcript text that shares the same style. The event
 * processor opens a new run whenever the active style changes mid-buffer.
 */
export interface StyledRun {
    readonly text: string;
    readonly style: TextStyle;
}
/**
 * Apply an Inform6 style name to a current style. `roman` resets everything;
 * every other known name sets its flag without clearing the others.
 *
 * Throws on unknown names — per CLAUDE.md "fail fast and loud" — so a future
 * Inform6 dialect adding a style surfaces the gap immediately instead of
 * silently dropping formatting.
 */
export declare function applyStyleName(current: TextStyle, name: string): TextStyle;
/** Structural equality for TextStyle — used to coalesce adjacent cells/runs. */
export declare function textStyleEquals(a: TextStyle, b: TextStyle): boolean;
/**
 * Translate a Glk style number (`style_Header` etc.) into an Inform6
 * style name consumed by `setStyle`. The Glulx path of the standard
 * library's `Banner` routine, the `PrintLocation` subheader, the `Input`
 * echo run, and many other library hooks use `glk_set_style(style_X)`
 * rather than the Inform6 `style bold` statement, so without this
 * mapping those runs would render in plain roman even though the game
 * meant them to be emphasised.
 *
 * The mapping is intentionally coarse: Glk has styles for semantic
 * concepts (header, alert, note, block quote, ...) and Inform6 only
 * exposes four rendering flags (bold/underline/reverse/fixed). We
 * collapse semantic emphasis into `bold`, preformatted into `fixed`,
 * notes into `underline`, and normal/user-defined styles into `roman`
 * (which clears every flag). Returns `null` for styles we intentionally
 * ignore, in which case the caller leaves the current style untouched.
 */
export declare function glkStyleToInform6StyleName(styleCode: number): string | null;
