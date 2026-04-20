import { type GameState } from './game-state.js';
/**
 * Populate the Z-machine header bytes (addresses 32-33) with runtime
 * screen dimensions. Required for games that read screen size via the raw
 * byte addresses `0->32` and `0->33` instead of the Glk-aware library
 * helper `ScreenWidth()`.
 *
 * No-op if the memory map already contains an array at address 32 (the
 * game may have allocated its own data there — we never stomp on it).
 *
 * @param rows  Status/upper window height in lines (HDR_SCREENHLINES)
 * @param columns  Screen width in columns (HDR_SCREENWCHARS)
 */
export declare function populateZMachineHeader(state: GameState, rows: number, columns: number): GameState;
