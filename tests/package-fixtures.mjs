import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repository = fileURLToPath(new URL('..', import.meta.url))
const fixtureRoot = mkdtempSync(join(tmpdir(), 'swarmmachina-standards-'))
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const execute = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repository,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
    stdio: ['ignore', 'pipe', 'pipe']
  })

  if (result.status !== 0) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`

    throw new Error(`${command} ${args.join(' ')} failed\n${output}`, { cause: result.error })
  }

  return result
}
const run = (command, args, options = {}) => execute(command, args, options).stdout
const runWithoutCompatibilityWarnings = (command, args, options = {}) => {
  const result = execute(command, args, options)
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`

  assert.doesNotMatch(output, /ERESOLVE|not officially supported|unsupported TypeScript|npm warn peer/i)

  return result.stdout
}
const writeFixture = (name, files, devDependencies) => {
  const directory = join(fixtureRoot, name)
  const packageJson = {
    name: `standards-${name}-fixture`,
    private: true,
    type: 'module',
    scripts: files.scripts,
    ...(files.swmStandards ? { swmStandards: files.swmStandards } : {}),
    devDependencies
  }

  run(process.execPath, ['-e', "require('fs').mkdirSync(process.argv[1], { recursive: true })", directory])
  writeFileSync(join(directory, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
  writeFileSync(join(directory, 'pnpm-workspace.yaml'), 'autoInstallPeers: false\nstrictPeerDependencies: true\n')

  for (const [path, contents] of Object.entries(files.contents)) {
    const target = join(directory, path)

    run(process.execPath, [
      '-e',
      "const fs=require('fs');const path=require('path');fs.mkdirSync(path.dirname(process.argv[1]),{recursive:true})",
      target
    ])
    writeFileSync(target, contents)
  }

  return directory
}
const install = (directory) => {
  runWithoutCompatibilityWarnings(pnpmCommand, ['install', '--ignore-scripts', '--strict-peer-dependencies'], {
    cwd: directory
  })
  run(pnpmCommand, ['list', '--depth', 'Infinity'], { cwd: directory })
}

try {
  const dryRun = JSON.parse(run(pnpmCommand, ['pack', '--dry-run', '--json'], { cwd: repository }))
  const expectedFiles = [
    'README.md',
    'bin/swm-standards.mjs',
    'code-style/eslint-js.config.mjs',
    'code-style/eslint-typescript.config.mjs',
    'code-style/eslint-vue.config.mjs',
    'code-style/eslint-vue-typescript.config.mjs',
    'code-style/prettier.config.mjs',
    'code-style/tsconfig.base.json',
    'git/setup-hooks.mjs'
  ]
  const packedFiles = new Set(dryRun.files.map(({ path }) => path))

  for (const expected of expectedFiles) {
    assert.ok(packedFiles.has(expected), `missing from tarball: ${expected}`)
  }

  const pack = JSON.parse(run(pnpmCommand, ['pack', '--json', '--pack-destination', fixtureRoot], { cwd: repository }))
  const tarball = pack.filename
  const standardsDependency = `file:${tarball}`

  assert.ok(existsSync(tarball))

  const javascript = writeFixture(
    'javascript',
    {
      scripts: {
        lint: 'eslint .',
        format: 'prettier src package.json eslint.config.mjs --check',
        'standards:check': 'swm-standards check src',
        'standards:fix': 'swm-standards fix src'
      },
      swmStandards: { preset: 'js' },
      contents: {
        'eslint.config.mjs': "import config from '@swarmmachina/standards/eslint-js'\n\nexport default config\n",
        'src/index.js': 'export const answer = 42\n'
      }
    },
    { '@swarmmachina/standards': standardsDependency }
  )
  const javascriptPackage = JSON.parse(readFileSync(join(javascript, 'package.json'), 'utf8'))

  javascriptPackage.prettier = '@swarmmachina/standards/prettier'
  writeFileSync(join(javascript, 'package.json'), `${JSON.stringify(javascriptPackage, null, 2)}\n`)
  install(javascript)
  run(pnpmCommand, ['run', 'lint'], { cwd: javascript })
  run(pnpmCommand, ['run', 'format'], { cwd: javascript })
  run(pnpmCommand, ['run', 'standards:check'], { cwd: javascript })
  writeFileSync(join(javascript, 'src/fix.js'), 'export const fixed={answer:42}\n')
  assert.throws(() => run(pnpmCommand, ['run', 'standards:check'], { cwd: javascript }))
  run(pnpmCommand, ['run', 'standards:fix'], { cwd: javascript })
  run(pnpmCommand, ['run', 'standards:check'], { cwd: javascript })
  assert.equal(readFileSync(join(javascript, 'src/fix.js'), 'utf8'), 'export const fixed = { answer: 42 }\n')
  assert.throws(() => run(process.execPath, ['-e', "require.resolve('typescript')"], { cwd: javascript }))
  assert.throws(() => run(process.execPath, ['-e', "require.resolve('typescript-eslint')"], { cwd: javascript }))

  const typeScript = writeFixture(
    'typescript7',
    {
      scripts: {
        build: 'tsc -p tsconfig.json',
        check: 'tsc --noEmit -p tsconfig.json'
      },
      contents: {
        'tsconfig.json': `${JSON.stringify(
          {
            extends: '@swarmmachina/standards/tsconfig',
            compilerOptions: { outDir: 'dist', rootDir: 'src' },
            include: ['src']
          },
          null,
          2
        )}\n`,
        'src/index.ts': 'export const add = (left: number, right: number): number => left + right\n'
      }
    },
    {
      '@swarmmachina/standards': standardsDependency,
      typescript: '7.0.2'
    }
  )

  install(typeScript)
  assert.match(run(pnpmCommand, ['exec', 'tsc', '--version'], { cwd: typeScript }), /Version 7\.0\.2/)
  run(pnpmCommand, ['run', 'check'], { cwd: typeScript })
  run(pnpmCommand, ['run', 'build'], { cwd: typeScript })

  for (const output of ['index.js', 'index.js.map', 'index.d.ts', 'index.d.ts.map']) {
    assert.ok(existsSync(join(typeScript, 'dist', output)), `TypeScript build did not emit dist/${output}`)
  }

  const typeScriptLint = writeFixture(
    'typescript-lint',
    {
      scripts: { lint: 'eslint .', 'standards:check': 'swm-standards check src' },
      swmStandards: { preset: 'typescript' },
      contents: {
        'eslint.config.mjs':
          "import config from '@swarmmachina/standards/eslint-typescript'\n\nexport default config\n",
        'src/index.ts': 'export const add = (left: number, right: number): number => left + right\n'
      }
    },
    {
      '@swarmmachina/standards': standardsDependency,
      '@typescript/native': 'npm:typescript@7.0.2',
      typescript: 'npm:@typescript/typescript6@6.0.2',
      'typescript-eslint': '8.65.0'
    }
  )

  install(typeScriptLint)
  assert.match(run(pnpmCommand, ['exec', 'tsc', '--version'], { cwd: typeScriptLint }), /Version 7\.0\.2/)
  assert.match(run(pnpmCommand, ['exec', 'tsc6', '--version'], { cwd: typeScriptLint }), /Version 6\.0\./)
  runWithoutCompatibilityWarnings(pnpmCommand, ['run', 'lint'], { cwd: typeScriptLint })
  runWithoutCompatibilityWarnings(pnpmCommand, ['run', 'standards:check'], { cwd: typeScriptLint })
  const typeScriptExports = join(typeScriptLint, 'exports.mjs')

  writeFileSync(
    typeScriptExports,
    `for (const module of [
  '@swarmmachina/standards/eslint-typescript',
  '@swarmmachina/standards/eslint-vue-typescript',
  '@swarmmachina/standards/eslint-ts',
  '@swarmmachina/standards/code-style/eslint-ts.config.mjs',
  '@swarmmachina/standards/code-style/eslint-typescript.config.mjs',
  '@swarmmachina/standards/code-style/eslint-vue-typescript.config.mjs'
]) await import(module)
`
  )
  run(process.execPath, [typeScriptExports], { cwd: typeScriptLint })

  const vueJavaScript = writeFixture(
    'vue-javascript',
    {
      scripts: { lint: 'eslint .', 'standards:check': 'swm-standards check src' },
      swmStandards: { preset: 'vue' },
      contents: {
        'eslint.config.mjs': "import config from '@swarmmachina/standards/eslint-vue'\n\nexport default config\n",
        'src/App.vue':
          "<script setup>\nconst message = 'hello'\n</script>\n\n<template>\n  <p>{{ message }}</p>\n</template>\n"
      }
    },
    { '@swarmmachina/standards': standardsDependency }
  )

  install(vueJavaScript)
  run(pnpmCommand, ['run', 'lint'], { cwd: vueJavaScript })
  run(pnpmCommand, ['run', 'standards:check'], { cwd: vueJavaScript })
  assert.throws(() => run(process.execPath, ['-e', "require.resolve('typescript')"], { cwd: vueJavaScript }))

  const vueTypeScript = writeFixture(
    'vue-typescript-lint',
    {
      scripts: { lint: 'eslint .', 'standards:check': 'swm-standards check src' },
      swmStandards: { preset: 'vue-typescript' },
      contents: {
        'eslint.config.mjs':
          "import config from '@swarmmachina/standards/eslint-vue-typescript'\n\nexport default config\n",
        'src/App.vue':
          '<script setup lang="ts">\nconst message: string = \'hello\'\n</script>\n\n<template>\n  <p>{{ message }}</p>\n</template>\n'
      }
    },
    {
      '@swarmmachina/standards': standardsDependency,
      '@typescript/native': 'npm:typescript@7.0.2',
      typescript: 'npm:@typescript/typescript6@6.0.2',
      'typescript-eslint': '8.65.0'
    }
  )

  install(vueTypeScript)
  runWithoutCompatibilityWarnings(pnpmCommand, ['run', 'lint'], { cwd: vueTypeScript })
  runWithoutCompatibilityWarnings(pnpmCommand, ['run', 'standards:check'], { cwd: vueTypeScript })

  const exportsFixture = join(javascript, 'exports.mjs')

  writeFileSync(
    exportsFixture,
    `import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const modules = [
  '@swarmmachina/standards/eslint-js',
  '@swarmmachina/standards/eslint-vue',
  '@swarmmachina/standards/prettier',
  '@swarmmachina/standards/eslint.config.mjs',
  '@swarmmachina/standards/code-style/eslint-js.config.mjs',
  '@swarmmachina/standards/code-style/eslint-vue.config.mjs',
  '@swarmmachina/standards/code-style/eslint.config.mjs',
  '@swarmmachina/standards/code-style/prettier.config.mjs'
]

for (const module of modules) await import(module)
for (const resource of [
  '@swarmmachina/standards/tsconfig',
  '@swarmmachina/standards/tsconfig.base.json',
  '@swarmmachina/standards/setup-hooks.mjs',
  '@swarmmachina/standards/git/setup-hooks.mjs'
]) {
  const url = import.meta.resolve(resource)
  assert.ok((await readFile(new URL(url))).byteLength > 0)
}
`
  )
  run(process.execPath, [exportsFixture], { cwd: javascript })

  console.log(`fixture matrix passed on ${process.version}`)
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true })
}
