// Deal Ledger — Black Friday 2026 (Node 22, standard library only).
// The site is app/: plain static files (ES modules, CSS, no build step, no network).
// This program hands it in: it copies app/ and screenshots/ from beside this file
// into the output directory and writes output/dossier.json, the summary the
// scorer reads, using the vendored make.fun library. Leave
// vendor/makefun-frontend.ts untouched: the scorer requires dossier.json to be
// byte for byte what its own copy writes.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output).
// Serve the site:  node serve.ts  ->  http://localhost:8080

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Never delete the output directory itself: the grader may run with a read-only
// parent directory, so removing it would fail with EACCES. Create it if needed
// and clear only its contents. A stale file at that path is a setup error, not
// something to delete around, so fail loudly instead of guessing.
if (existsSync(out) && !statSync(out).isDirectory()) {
  throw new Error(`MAKEFUN_OUTPUT_DIR ${out} exists and is not a directory`);
}
mkdirSync(out, { recursive: true });
for (const child of readdirSync(out)) {
  try {
    rmSync(join(out, child), { recursive: true, force: true });
  } catch (err) {
    // A child that vanished between the listing and the removal is fine.
    if (err?.code !== 'ENOENT') throw err;
  }
}

cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
