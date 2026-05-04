#!/usr/bin/env node
// copy-assets.mjs — copies non-TS assets from src/ to dist/ after tsc build
import { readdirSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'src/core/materializer/agent-templates'
const DEST = 'dist/core/materializer/agent-templates'

mkdirSync(DEST, { recursive: true })

for (const file of readdirSync(SRC)) {
  const dest = join(DEST, file)
  const content = readFileSync(join(SRC, file))

  // Try to remove first (handles locked/0-byte files from stale builds)
  try { unlinkSync(dest) } catch { /* file didn't exist or can't unlink — try write anyway */ }

  try {
    writeFileSync(dest, content)
    console.log(`copied: ${file}`)
  } catch (err) {
    console.warn(`warning: could not copy ${file} — ${err.message}`)
    console.warn('  → run "npm run build" from your local terminal to complete asset copy')
  }
}
