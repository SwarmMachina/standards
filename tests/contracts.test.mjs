import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

import javascriptConfig from '../code-style/eslint-js.config.mjs'
import legacyConfig from '../code-style/eslint.config.mjs'
import legacyTypeScriptConfig from '../code-style/eslint-ts.config.mjs'
import prettierConfig from '../code-style/prettier.config.mjs'
import typeScriptConfig from '../code-style/eslint-typescript.config.mjs'
import vueConfig from '../code-style/eslint-vue.config.mjs'
import vueTypeScriptConfig from '../code-style/eslint-vue-typescript.config.mjs'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const tsconfig = JSON.parse(await readFile(new URL('../code-style/tsconfig.base.json', import.meta.url), 'utf8'))
const legacyPrettierConfig = JSON.parse(await readFile(new URL('../code-style/.prettierrc', import.meta.url), 'utf8'))
const releaseWorkflow = await readFile(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8')

test('canonical ESLint presets are flat config arrays', () => {
  for (const config of [javascriptConfig, typeScriptConfig, vueConfig, vueTypeScriptConfig]) {
    assert.ok(Array.isArray(config))
    assert.ok(config.length > 0)
  }
})

test('standards 1.x ESLint entry points remain compatible', () => {
  assert.strictEqual(legacyConfig, vueConfig)
  assert.ok(legacyTypeScriptConfig.some((entry) => entry.plugins?.vue))
  assert.ok(legacyTypeScriptConfig.some((entry) => entry.plugins?.['@typescript-eslint']))
})

test('JavaScript preset does not load TypeScript or Vue parsers', () => {
  assert.ok(!javascriptConfig.some((entry) => entry.plugins?.vue))
  assert.ok(!javascriptConfig.some((entry) => entry.plugins?.['@typescript-eslint']))
})

test('shared Prettier export matches the legacy config', () => {
  assert.deepEqual(prettierConfig, legacyPrettierConfig)
})

test('strict tsconfig is compatible with the TS7 compiler contract', () => {
  assert.equal(tsconfig.compilerOptions.strict, true)
  assert.equal(tsconfig.compilerOptions.module, 'nodenext')
  assert.equal(tsconfig.compilerOptions.moduleResolution, 'nodenext')
  assert.equal(tsconfig.compilerOptions.target, 'es2024')
  assert.equal(tsconfig.compilerOptions.declaration, true)
  assert.equal(tsconfig.compilerOptions.declarationMap, true)
  assert.equal(tsconfig.compilerOptions.sourceMap, true)
  assert.equal(tsconfig.compilerOptions.erasableSyntaxOnly, true)
  assert.equal(tsconfig.compilerOptions.verbatimModuleSyntax, true)
})

test('all explicit public export targets exist in the packed source tree', async () => {
  const explicitTargets = Object.values(packageJson.exports).filter((target) => !target.includes('*'))

  for (const target of explicitTargets) {
    await assert.doesNotReject(readFile(new URL(`..${target.slice(1)}`, import.meta.url)))
  }
})

test('package contracts pin the supported runtime and honest lint peer range', () => {
  assert.equal(packageJson.engines.node, '^22.13.0 || 24.x')
  assert.equal(packageJson.packageManager, 'pnpm@11.15.1')
  assert.equal(packageJson.peerDependencies.typescript, undefined)
  assert.equal(packageJson.peerDependencies['typescript-eslint'], '^8.65.0')
  assert.equal(packageJson.devDependencies['@typescript/native'], 'npm:typescript@7.0.2')
  assert.equal(packageJson.devDependencies.typescript, 'npm:@typescript/typescript6@6.0.2')
  assert.equal(packageJson.dependencies['vue-eslint-parser'], '10.4.1')
  assert.equal(packageJson.bin['swm-standards'], './bin/swm-standards.mjs')
})

test('release publishing requests an OIDC token and enables npm provenance', () => {
  assert.match(releaseWorkflow, /^\s+id-token: write$/m)
  assert.match(releaseWorkflow, /^\s+NPM_CONFIG_PROVENANCE: true$/m)
})
