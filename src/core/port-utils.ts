import { createServer } from 'node:net'

export function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })
    server.listen(port, '127.0.0.1')
  })
}

export async function findFreePort(start: number, maxAttempts = 10): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = start + i
    if (await isPortFree(port)) return port
  }
  throw new Error(
    `Could not find a free port after ${maxAttempts} attempts (tried ${start}-${start + maxAttempts - 1}). Please free a port and try again.`
  )
}
