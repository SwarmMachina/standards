import { existsSync, lstatSync, symlinkSync } from 'fs'
import { dirname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'

const root = process.cwd()
const hooksDir = resolve(root, '.git/hooks')
const standards = resolve(dirname(fileURLToPath(import.meta.url)), 'hooks')

const hooks = ['pre-commit', 'prepare-commit-msg']

if (!existsSync(hooksDir)) {
  console.error(`Git hooks directory not found: ${hooksDir}`)
  process.exitCode = 1
} else {
  let failed = false

  for (const hook of hooks) {
    console.log('Setup hook:', hook)
    const target = resolve(hooksDir, hook)
    const source = resolve(standards, hook)

    if (!existsSync(source)) {
      console.error(`Hook not found: ${source}`)
      failed = true
      continue
    }

    try {
      if (lstatSync(target, { throwIfNoEntry: false })) {
        console.warn(`Skipped existing hook: ${target}`)
        continue
      }

      symlinkSync(relative(hooksDir, source), target)
      console.log(`Linked ${hook} hook`)
    } catch (err) {
      failed = true
      console.error(`Failed to link ${hook}:`, err.message)
    }
  }

  process.exitCode = failed ? 1 : 0
}
