import { type RefObject } from 'react';
import { type TerminalConfig, type ResolvedTerminal } from '../types/terminal-config.js';
/**
 * Resolve terminal configuration for a container element.
 * Selects a profile based on container width, measures font if needed,
 * and computes final dimensions.
 */
export declare function resolveTerminal(containerWidth: number, containerHeight: number, config: TerminalConfig): ResolvedTerminal;
/**
 * React hook that resolves terminal configuration from a container element.
 * Measures the container on mount and returns resolved terminal dimensions.
 */
export declare function useTerminal(containerRef: RefObject<HTMLDivElement | null>, config?: TerminalConfig): ResolvedTerminal | null;
