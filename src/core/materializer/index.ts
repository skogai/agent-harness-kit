import { ClaudeCodeMaterializer } from './claude-code'
import { OpenCodeMaterializer } from './opencode'

import type { HarnessConfig, Provider, ScaffoldOptions } from '@/types'

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
