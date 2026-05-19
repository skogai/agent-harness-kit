import { mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

export const write = (cwd: string, relPath: string, content: string, mode?: number) => {
  const abs = join(cwd, relPath)
  mkdirSync(resolve(abs, '..'), { recursive: true })
  writeFileSync(abs, content, { encoding: 'utf8', mode })
}
