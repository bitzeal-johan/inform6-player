#!/usr/bin/env node
/**
 * Vendor script: compiles the three @inform6sharp packages from source
 * into packages/ so this repo is self-contained (no source .ts).
 *
 * Uses esbuild for JS transpilation (fast, no type-checking errors)
 * and tsc --emitDeclarationOnly for .d.ts files where possible.
 *
 * Usage: npm run vendor
 * Requires: the inform6-react worktree at ../inform6-react
 * (private toolchain — the committed packages/ output works without it)
 */
import { execSync } from 'node:child_process';
import { rmSync, mkdirSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const sourceRoot = resolve(root, '../inform6-react/src/typescript');
const packagesDir = resolve(root, 'packages');

const packages = [
  {
    name: '@inform6sharp/game-runner',
    dir: 'game-runner',
    sourceDir: resolve(sourceRoot, 'game-runner'),
    deps: {},
  },
  {
    name: '@inform6sharp/react-player',
    dir: 'react-player',
    sourceDir: resolve(sourceRoot, 'react-player'),
    deps: { '@inform6sharp/game-runner': 'file:../game-runner' },
    peerDeps: { react: '>=18', 'react-dom': '>=18' },
  },
  {
    name: '@inform6sharp/themes',
    dir: 'themes',
    sourceDir: resolve(sourceRoot, 'themes'),
    deps: {},
    peerDeps: { '@inform6sharp/react-player': '>=0.1.0' },
  },
];

/** Recursively find all .ts/.tsx files under a directory. */
function findTsFiles(dir, base) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = join(base, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findTsFiles(full, rel));
    } else if (/\.tsx?$/.test(entry) && !entry.endsWith('.d.ts')) {
      results.push(full);
    }
  }
  return results;
}

// Clean
console.log('Cleaning packages/...');
rmSync(packagesDir, { recursive: true, force: true });
mkdirSync(packagesDir, { recursive: true });

for (const pkg of packages) {
  const outDir = resolve(packagesDir, pkg.dir);
  const srcDir = resolve(pkg.sourceDir, 'src');
  console.log(`\nBuilding ${pkg.name}...`);

  // 1. Transpile .ts → .js with esbuild (no type checking)
  const tsFiles = findTsFiles(srcDir, '');
  const entryPoints = tsFiles.map(f => relative(pkg.sourceDir, f));

  execSync(
    `npx esbuild ${entryPoints.join(' ')} --outdir="${outDir}" --outbase=. --format=esm --platform=neutral --target=es2022`,
    { cwd: pkg.sourceDir, stdio: 'inherit' }
  );

  // 2. Generate .d.ts files (--noCheck skips type checking but still emits declarations)
  try {
    execSync(
      `npx tsc --emitDeclarationOnly --noCheck --declaration --declarationMap false --outDir "${outDir}" --rootDir .`,
      { cwd: pkg.sourceDir, stdio: 'inherit' }
    );
  } catch {
    console.log('  (types generated with warnings)');
  }

  // 3. Write minimal package.json
  const pkgJson = {
    name: pkg.name,
    version: '0.1.0',
    type: 'module',
    main: './src/index.js',
    types: './src/index.d.ts',
    ...(Object.keys(pkg.deps ?? {}).length > 0 ? { dependencies: pkg.deps } : {}),
    ...(pkg.peerDeps ? { peerDependencies: pkg.peerDeps } : {}),
  };
  writeFileSync(resolve(outDir, 'package.json'), JSON.stringify(pkgJson, null, 2) + '\n');

  console.log(`  -> ${outDir}`);
}

console.log('\nDone. Run `npm install` to update symlinks.');
