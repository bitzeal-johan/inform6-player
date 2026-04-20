import type { GameModule, StyleOverrides, TerminalConfig } from '@inform6sharp/react-player';
import { RETRO_TERMINAL_CONFIG } from '@inform6sharp/themes';
import { Game as Advent } from '../app/games/advent.js';
import { Game as Devours } from '../app/games/devours.js';

export interface GameDescriptor {
  readonly gameId: string;
  readonly title: string;
  readonly description: string;
  readonly game: GameModule;
  readonly terminalConfig?: TerminalConfig;
  readonly styleOverrides?: StyleOverrides;
}

// The IBM VGA bitmap font embedded in the Devours profile has no bold variant,
// so Inform6's `style bold` (used heavily for the intro poem and in places by
// the library) would otherwise render visually identical to roman text. Map
// bold to a cyan foreground instead, matching the game's monochromatic
// retro-terminal aesthetic while keeping style runs visually distinct.
const DEVOURS_STYLE_OVERRIDES: StyleOverrides = {
  bold: { color: '#00c0c0' },
};

// Devours's DrawStatusLine (Devours.inf:2921-2943) hardcodes
//   pos = screen_width - 20
// and writes the location name starting at column 2. With the longest room
// name "Dark First Floor Equipment Room" at 31 chars, the breakpoints below
// give: 37 cols (most rooms readable), 53 cols (every room fits), 80 cols
// (comfortable desktop). See ALL_THINGS_DEVOURS analysis in the inform6-react
// project for derivation.
const DEVOURS_TERMINAL_CONFIG: TerminalConfig = [
  {
    // Very small phones, portrait (e.g. iPhone SE 320-375 px).
    minWidthPx: 0,
    profile: {
      fontFamily: '"IBM VGA", monospace',
      columns: 37,
      minFontSizePx: 12,
      maxFontSizePx: 16,
      lineHeight: 1,
      charWidthRatio: 9 / 16,
    },
  },
  {
    // Larger,
    minWidthPx: 375,
    profile: {
      fontFamily: '"IBM VGA", monospace',
      columns: 45,
      minFontSizePx: 12,
      maxFontSizePx: 16,
      lineHeight: 1,
      charWidthRatio: 9 / 16,
    },
  },{
    // Large phones, portrait (e.g. iPhone 13/14/15 = 390-393 px,
    // 15 Plus / Pro Max = 430 px).
    minWidthPx: 430,
    profile: {
      fontFamily: '"IBM VGA", monospace',
      columns: 53,
      minFontSizePx: 12,
      maxFontSizePx: 16,
      lineHeight: 1,
      charWidthRatio: 9 / 16,
    },
  },
  {
    // Tablets and up (iPad mini portrait = 768 px, larger iPads and
    // landscape phones above that).
    minWidthPx: 768,
    profile: {
      fontFamily: '"IBM VGA", monospace',
      columns: 80,
      minFontSizePx: 16,
      maxFontSizePx: 36 ,
      lineHeight: 1,
      charWidthRatio: 9 / 16,
    },
  },
];

const GAMES: readonly GameDescriptor[] = [
  {
    gameId: 'advent',
    title: 'Colossal Cave Adventure',
    description: 'The original text adventure by Will Crowther and Don Woods',
    game: Advent,
    terminalConfig: RETRO_TERMINAL_CONFIG,
  },
  {
    gameId: 'devours',
    title: 'All Things Devours',
    description: 'A time-travel puzzle by half sick of shadows (2004 IF Comp)',
    game: Devours,
    terminalConfig: DEVOURS_TERMINAL_CONFIG,
    styleOverrides: DEVOURS_STYLE_OVERRIDES,
  },
];

export function findGame(gameId: string): GameDescriptor | undefined {
  return GAMES.find(g => g.gameId === gameId);
}

export function getAllGames(): readonly GameDescriptor[] {
  return GAMES;
}
