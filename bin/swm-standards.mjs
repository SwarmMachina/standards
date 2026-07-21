#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const commands = new Set(['check', 'fix'])
const presetFiles = new Map([
  ['js', 'eslint-js.config.mjs'],
  ['typescript', 'eslint-typescript.config.mjs'],
  ['vue', 'eslint-vue.config.mjs'],
  ['vue-typescript', 'eslint-vue-typescript.config.mjs']
])
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
const prettierConfig = join(packageRoot, 'code-style', 'prettier.config.mjs')
const usage = `Usage: swm-standards <check|fix> [--preset <preset>] [path ...]

Presets:
  js
  typescript
  vue
  vue-typescript

The preset can also be declared in package.json:
  "swmStandards": { "preset": "js" }
`
const fail = (message) => {
  process.stderr.write(`swm-standards: ${message}\n\n${usage}`)
  process.exit(2)
}
const resolvePackageBin = (name) => {
  const manifestPath = fileURLToPath(import.meta.resolve(`${name}/package.json`))
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[name]

  if (!bin) {
    throw new Error(`${name} does not declare a ${name} executable`)
  }

  return resolve(dirname(manifestPath), bin)
}
const readProjectPreset = () => {
  const manifestPath = join(process.cwd(), 'package.json')

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

    return manifest.swmStandards?.preset
  } catch (error) {
    if (error?.code === 'ENOENT') {
      fail('package.json was not found in the current working directory')
    }

    fail(`cannot read package.json: ${error.message}`)
  }
}
const run = (executable, args) => {
  const result = spawnSync(process.execPath, [executable, ...args], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  })

  if (result.error) {
    throw result.error
  }

  return result.status ?? 1
}
const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  process.stdout.write(usage)
  process.exit(args.length === 0 ? 2 : 0)
}

if (args.includes('--version') || args.includes('-v')) {
  process.stdout.write(`${packageJson.version}\n`)
  process.exit(0)
}

const command = args.shift()

if (!commands.has(command)) {
  fail(`unknown command: ${command}`)
}

let preset

const paths = []

for (let index = 0; index < args.length; index += 1) {
  const argument = args[index]

  if (argument === '--preset') {
    preset = args[index + 1]
    index += 1

    if (!preset) {
      fail('--preset requires a value')
    }
  } else if (argument.startsWith('--preset=')) {
    preset = argument.slice('--preset='.length)
  } else if (argument.startsWith('-')) {
    fail(`unknown option: ${argument}`)
  } else {
    paths.push(argument)
  }
}

preset ??= readProjectPreset()

if (!presetFiles.has(preset)) {
  fail(`unknown or missing preset: ${preset ?? '<missing>'}`)
}

const targets = paths.length > 0 ? paths : ['.']
const eslintBin = resolvePackageBin('eslint')
const prettierBin = resolvePackageBin('prettier')
const eslintConfig = join(packageRoot, 'code-style', presetFiles.get(preset))
const eslintArgs = [...targets, '--config', eslintConfig]
const prettierArgs = [...targets, '--config', prettierConfig]

if (command === 'check') {
  const prettierStatus = run(prettierBin, [...prettierArgs, '--check'])

  process.exit(prettierStatus === 0 ? run(eslintBin, eslintArgs) : prettierStatus)
}

const eslintStatus = run(eslintBin, [...eslintArgs, '--fix'])

process.exit(eslintStatus === 0 ? run(prettierBin, [...prettierArgs, '--write']) : eslintStatus)
