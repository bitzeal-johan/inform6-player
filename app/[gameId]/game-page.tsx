'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  GameScreen,
  StatusBar,
  ActionBar,
  useGameEngine,
  useTerminal,
  type GameModule,
  type TerminalConfig,
  type ResolvedTerminal,
  type StyleOverrides,
} from '@inform6sharp/react-player';
import { findGame } from '../../games/registry';

interface GamePageProps {
  readonly gameId: string;
}

export function GamePage({ gameId }: GamePageProps) {
  const descriptor = findGame(gameId);
  if (!descriptor) throw new Error(`Unknown game: ${gameId}`);

  return (
    <main style={{ display: 'flex', height: '100dvh', margin: '0 auto', maxWidth: '1400px' }}>
      <div style={{ flex: '1 1 0', minWidth: 0, height: '100%' }}>
        <GamePlayerWithState
          game={descriptor.game}
          gameId={descriptor.gameId}
          terminalConfig={descriptor.terminalConfig}
          styleOverrides={descriptor.styleOverrides}
        />
      </div>
    </main>
  );
}

interface GamePlayerWithStateProps {
  readonly game: GameModule;
  readonly gameId: string;
  readonly terminalConfig?: TerminalConfig;
  readonly styleOverrides?: StyleOverrides;
}

function GamePlayerWithState({
  game, gameId, terminalConfig, styleOverrides,
}: GamePlayerWithStateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminal = useTerminal(containerRef, terminalConfig);

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        overflow: 'hidden',
        ...(terminal !== null ? {
          '--if-font-family': terminal.profile.fontFamily,
          '--if-font-size': `${terminal.fontSizePx}px`,
          '--if-line-height': String(terminal.profile.lineHeight),
          '--if-fg': terminal.profile.foregroundColor ?? '#000',
          '--if-bg': terminal.profile.backgroundColor ?? '#fff',
        } as React.CSSProperties : {}),
      }}
    >
      {terminal !== null && (
        <GameInner
          game={game}
          gameId={gameId}
          terminal={terminal}
          styleOverrides={styleOverrides}
        />
      )}
    </div>
  );
}

/**
 * Returns true only when we are certain the device has a precise pointer
 * with hover capability (desktop mouse/trackpad). Defaults to false (show
 * buttons) during SSR and when detection is ambiguous.
 */
function useFinePointerOnly(): boolean {
  const [fineOnly, setFineOnly] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine) and (hover: hover)');
    setFineOnly(mql.matches);
    const handler = (e: MediaQueryListEvent) => setFineOnly(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return fineOnly;
}

interface GameInnerProps {
  readonly game: GameModule;
  readonly gameId: string;
  readonly terminal: ResolvedTerminal;
  readonly styleOverrides?: StyleOverrides;
}

function GameInner({ game, gameId, terminal, styleOverrides }: GameInnerProps) {
  const engine = useGameEngine(game, gameId, terminal);
  const showButtons = !useFinePointerOnly();

  return (
    <div style={{ flex: '1 1 0', minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <GameScreen engine={engine} terminal={terminal} styleOverrides={styleOverrides} hideStatusBar={showButtons} />
      </div>
      {showButtons && (
        <StatusBar grid={engine.statusGrid} rowHeightPx={terminal.rowHeightPx} styleOverrides={styleOverrides} />
      )}
      {showButtons && engine.gameState !== null && engine.status === 'waitingForInput' && (
        <ActionBar
          gameState={engine.gameState}
          inputRequest={engine.inputRequest}
          recentOutput={engine.recentOutput}
          onSubmit={engine.submitLine}
        />
      )}
    </div>
  );
}
