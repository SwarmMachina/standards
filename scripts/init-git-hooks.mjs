import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { exit } from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const root = process.cwd()

if (!resolve(root).startsWith(resolve(__dirname, '..'))) {
  exit(0)
}

try {
  // eslint-disable-next-line import/no-unresolved
  await import('@swarmmachina/standards/setup-hooks.mjs')
} catch (err) {
  console.warn('⚠ Failed to run hook setup:', err.message)
}
