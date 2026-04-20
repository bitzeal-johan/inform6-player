import React from 'react';
/**
 * Per-game override map for Inform6 text styles.
 *
 * Each field, when present, replaces the default CSS emitted for that flag.
 * This is useful when the embedded font does not offer a bold variant
 * (e.g. IBM VGA) and the game would rather convey `style bold` via a
 * colour swap than via a non-existent weight change.
 *
 * Semantics (per plan: "replace entirely"):
 *
 * - Default behaviour: `styleToCss` emits `font-weight: bold` for bold,
 *   `text-decoration: underline` for underline, and reverse-video background
 *   swaps for reverse.
 * - With an override set for a flag: the override CSS is used *instead of*
 *   the default CSS for that flag. Other flags on the same run still use
 *   their default behaviour unless they also have an override.
 *
 * Example (Devours with IBM VGA + bold-as-cyan):
 * ```ts
 * const devoursOverrides: StyleOverrides = {
 *   bold: { color: '#00c0c0' },
 * };
 * <GamePlayer game={Devours} gameId="devours" styleOverrides={devoursOverrides} />
 * ```
 */
export interface StyleOverrides {
    readonly bold?: React.CSSProperties;
    readonly underline?: React.CSSProperties;
    readonly reverse?: React.CSSProperties;
    readonly fixed?: React.CSSProperties;
}
