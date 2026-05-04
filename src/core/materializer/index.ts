import type { HarnessConfig, Provider, ScaffoldOptions } from '../../types.js'
import { ClaudeCodeMaterializer } from './claude-code.js'
import { OpenCodeMaterializer } from './opencode.js'

export interface Materializer {
  scaffold(config: HarnessConfig, opts: ScaffoldOptions): Promise<void>
  build(config: HarnessConfig, cwd: string): Promise<void>
  migrate(config: HarnessConfig, to: Provider, cwd: string): Promise<void>
}

export function getMaterializer(provider: Provider): Materializer {
  switch (provider) {
    case 'claude-code':
      return new ClaudeCodeMaterializer()
    case 'opencode':
      return new OpenCodeMaterializer()
    default:
      throw new Error(`Unknown provider: ${provider as string}`)
  }
}
