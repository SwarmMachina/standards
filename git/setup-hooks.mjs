import { chmodSync, existsSync, symlinkSync } from 'fs'
import { resolve } from 'path'

const root = process.cwd()
const hooksDir = resolve(root, '.git/hooks')
const standards = resolve(root, 'node_modules/@swarmmachina/standards/git/hooks')

const hooks = ['pre-commit', 'prepare-commit-msg']

for (const hook of hooks) {
  console.log('Setup hook:', hook)
  const target = resolve(hooksDir, hook)
  const source = resolve(standards, hook)

  if (!existsSync(source)) {
    console.warn(`Hook not found: ${source}`)
    continue
  }

  try {
    if (!existsSync(target)) {
      symlinkSync(source, target)
    }

    chmodSync(target, 0o755)
    console.log(`Linked ${hook} hook`)
  } catch (err) {
    console.error(`Failed to link ${hook}:`, err.message)
  }
}
