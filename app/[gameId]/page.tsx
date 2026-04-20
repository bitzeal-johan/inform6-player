import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findGame, getAllGames } from '../../games/registry';
import { GamePage } from './game-page';

interface PageParams {
  readonly params: Promise<{ gameId: string }>;
}

export function generateStaticParams() {
  return getAllGames().map(g => ({ gameId: g.gameId }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { gameId } = await params;
  const descriptor = findGame(gameId);
  if (!descriptor) return {};
  return {
    title: descriptor.title,
    description: descriptor.description,
  };
}

export default async function GameRoute({ params }: PageParams) {
  const { gameId } = await params;
  const descriptor = findGame(gameId);
  if (!descriptor) notFound();
  return <GamePage gameId={gameId} />;
}
