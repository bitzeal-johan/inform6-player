import Link from 'next/link';
import { getAllGames } from '../games/registry';

export default function Home() {
  const games = getAllGames();

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Inform6 Web Player</h1>
      <ul style={{ listStyle: 'none' }}>
        {games.map(g => (
          <li key={g.gameId} style={{ marginBottom: '1rem' }}>
            <Link
              href={`/${g.gameId}`}
              style={{
                display: 'block',
                padding: '1rem',
                border: '1px solid #444',
                borderRadius: 4,
                color: '#e0e0e0',
                textDecoration: 'none',
              }}
            >
              <strong>{g.title}</strong>
              <br />
              <span style={{ color: '#999', fontSize: '0.9em' }}>{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
