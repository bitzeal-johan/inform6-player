import React from 'react';
import { type TextStyle, type StyledCell, type StyledRun } from '@inform6sharp/game-runner';
import { type StyleOverrides } from '../types/style-overrides.js';
/**
 * Translate an Inform6 text style into React inline CSS.
 *
 * Default behaviour:
 * - `bold` → `font-weight: bold`
 * - `underline` → `text-decoration: underline`
 * - `reverse` → swap `--if-fg` / `--if-bg`
 * - `fixed` → no-op (our font is already monospace)
 *
 * With `overrides`: for each flag that is both set on the style and has
 * an entry in `overrides`, the override CSS is merged into the result
 * *in place of* that flag's default CSS. Other flags keep their defaults.
 *
 * Reverse video pulls its default colours from two CSS variables which
 * `GamePlayer` sets on the outer container. This lets a run embedded in
 * the transcript (normal-on-page-background) swap to
 * page-background-on-normal, and lets the status bar (which already
 * inverts its own base colours) work uniformly.
 */
export declare function styleToCss(style: TextStyle, overrides?: StyleOverrides): React.CSSProperties;
/**
 * Coalesce adjacent status-grid cells sharing the same style into single
 * styled runs. Keeps the DOM to O(style changes per row) spans instead of
 * O(columns), which matters for an 80-wide grid.
 */
export declare function coalesceCells(row: readonly StyledCell[]): StyledRun[];
/** Compose two styles, ORing their boolean flags. Used for input echo lines
 *  where the engine-supplied style needs an additional bold overlay. */
export declare function composeStyles(base: TextStyle, overlay: TextStyle): TextStyle;
