/**
 * Configuration for a terminal display profile at a given breakpoint.
 */
export interface TerminalProfile {
    readonly fontFamily: string;
    readonly columns: number;
    readonly minFontSizePx: number;
    readonly maxFontSizePx: number;
    readonly lineHeight: number;
    /** Character width as ratio of font size. null = measure at runtime. */
    readonly charWidthRatio: number | null;
    /**
     * Foreground (text) colour for the main transcript window. Used as
     * `--if-fg` so that `style reverse` runs in the transcript can swap to
     * `bg` text on `fg` background. Optional — defaults to '#000' if unset.
     */
    readonly foregroundColor?: string;
    /**
     * Background colour for the main transcript window. Used as `--if-bg`
     * for the same reason as `foregroundColor`. Optional — defaults to '#fff'.
     */
    readonly backgroundColor?: string;
}
/**
 * A breakpoint that activates a terminal profile at a minimum viewport width.
 */
export interface TerminalBreakpoint {
    readonly minWidthPx: number;
    readonly profile: TerminalProfile;
}
/**
 * Ordered list of breakpoints (ascending by minWidthPx).
 * The last breakpoint where minWidthPx <= containerWidth is selected.
 */
export type TerminalConfig = readonly TerminalBreakpoint[];
/**
 * Fully resolved terminal dimensions after breakpoint selection and font measurement.
 */
export interface ResolvedTerminal {
    readonly profile: TerminalProfile;
    readonly fontSizePx: number;
    readonly charWidthPx: number;
    readonly rowHeightPx: number;
    readonly columns: number;
    readonly rows: number;
}
