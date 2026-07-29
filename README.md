# Inform 6 Player

A web player for Inform 6 interactive fiction, built with Next.js and React.
Games are compiled from Inform 6 source to TypeScript ahead of time and run
entirely in the browser — no interpreter or server-side execution.

Included games:

- **Adventure** (Colossal Cave) — `/advent`
- **All Things Devours** — `/devours`

## Running

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Repo layout

- `app/` — Next.js app; `app/games/*.ts` are the compiled games (generated code)
- `games/registry.ts` — game metadata, terminal config, and styling
- `packages/` — vendored builds of `@inform6sharp/game-runner`,
  `@inform6sharp/react-player`, and `@inform6sharp/themes` (generated code)
- `scripts/vendor.mjs` — rebuilds `packages/` from source

## Regenerating games and packages

The generated code is committed, so the app builds and runs as-is.
Regenerating it (`npm run vendor`, `npm run compile:game`) requires the
Inform6Sharp compiler toolchain checked out at `../inform6-react`, which is
not public. Without it, edit the player via the vendored sources in
`packages/` at your own risk — changes there are overwritten by the next
vendor run.
