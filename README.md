# @swarmmachina/standards

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Node.js](https://img.shields.io/badge/node-22.13%2B%20%7C%2024.x-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue)](https://www.typescriptlang.org/)

Shared ESLint, Prettier, TypeScript and Git tooling for SwarmMachina packages.

## Quick start

```sh
pnpm add --save-dev @swarmmachina/standards
```

```json
{
  "scripts": {
    "check": "swm-standards check",
    "fix": "swm-standards fix"
  },
  "swmStandards": {
    "preset": "js"
  }
}
```

Presets: `js`, `typescript`, `vue`, `vue-typescript`. Override the project
setting for one command with `--preset` and optionally pass paths:

```sh
swm-standards check --preset vue src test
```

`check` runs Prettier then ESLint; `fix` runs ESLint fixes then Prettier writes.
The CLI never guesses a preset and does not run the TypeScript compiler.

## Compatibility

| Contour            | Consumer installs                                                         | Notes                                      |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------------------ |
| JavaScript         | `@swarmmachina/standards`                                                 | No TypeScript toolchain                    |
| Vue/JavaScript     | `@swarmmachina/standards`                                                 | `vue-eslint-parser` is bundled             |
| TypeScript compile | standards + `typescript@7.0.2`                                            | Extends the shared `tsconfig`              |
| TypeScript lint    | standards + TS7 native alias + TS6 API alias + `typescript-eslint@8.65.0` | See below                                  |
| Vue/TypeScript     | Same lint sidecar                                                         | TS7 embedded-language type checking varies |

Supported runtime and pinned tools:

- Node.js `^22.13.0 || 24.x`
- pnpm `11.15.1`
- TypeScript compiler `7.0.2`
- ESLint `10.7.0`
- Prettier `3.9.6`

## TypeScript 7

Compiler-only projects can install TypeScript normally:

```sh
pnpm add --save-dev @swarmmachina/standards typescript@7.0.2
```

```json
{
  "extends": "@swarmmachina/standards/tsconfig",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

The config enables strict checking, `NodeNext`, ES2024, declarations and source
maps. Projects own `rootDir`; Node globals require `"types": ["node"]`.

TypeScript 7.0 has no stable programmatic API, while
`typescript-eslint@8.65.0` supports TypeScript `>=4.8.4 <6.1.0`. Linting
therefore uses the official side-by-side layout:

```sh
pnpm add --save-dev \
  @swarmmachina/standards \
  @typescript/native@npm:typescript@7.0.2 \
  typescript@npm:@typescript/typescript6@6.0.2 \
  typescript-eslint@8.65.0
```

Here `tsc` is TS7, `tsc6` is the transition compiler, and
`typescript-eslint` receives the supported TS6 API. Standards does not claim
native TS7 parser support or suppress unsupported-version warnings.

For Vue `<script lang="ts">`, the `vue-typescript` preset composes
`vue-eslint-parser` with this sidecar. Template and TS syntax linting works;
Volar and other embedded-language type tooling may still require TypeScript 6.

## Public API

| Export                    | Contract                      |
| ------------------------- | ----------------------------- |
| `./eslint-js`             | JavaScript                    |
| `./eslint-typescript`     | JavaScript + TypeScript       |
| `./eslint-vue`            | JavaScript + Vue              |
| `./eslint-vue-typescript` | JavaScript + TypeScript + Vue |
| `./prettier`              | Shared Prettier config        |
| `./tsconfig`              | Strict TS7 compiler base      |
| `./setup-hooks.mjs`       | Git hook installer            |
| `swm-standards`           | `check`/`fix` CLI             |

Direct ESLint composition remains supported:

```js
import config from '@swarmmachina/standards/eslint-js'

export default config
```

Prettier can also be referenced without the CLI:

```json
{
  "prettier": "@swarmmachina/standards/prettier"
}
```

Legacy 1.x paths (`./eslint.config.mjs`, `./eslint-ts`,
`./tsconfig.base.json` and their `code-style` forms) remain available. New
projects should use the explicit names above.

## Migration from 1.2.0

1. Move to Node.js 22.13+ or 24 and pnpm 11.15.1.
2. Prefer `swm-standards check|fix` and declare `swmStandards.preset`.
3. For direct composition, replace generic paths with `eslint-js`,
   `eslint-typescript`, `eslint-vue` or `eslint-vue-typescript`.
4. For TS7 linting, install the TS7/TS6 side-by-side dependencies above.
5. Set project-owned `rootDir` and Node `types` where required.
6. Replace `package-lock.json` with `pnpm-lock.yaml` and rerun the full gate.

Consumers still pinned to 1.2.0 may temporarily keep `autoInstallPeers: true`
because that version does not declare `vue-eslint-parser`. Version 2 bundles
it; after upgrading, set `autoInstallPeers: false`.

Version 2 is major because Node.js 20 is removed from the runtime contract and
the canonical lint contours are now explicit. Compatibility aliases remain.

## Git hooks

```sh
node node_modules/@swarmmachina/standards/git/setup-hooks.mjs
```

The installer follows Conventional Commits and never overwrites existing hooks.

## Verification and release

```sh
pnpm install --frozen-lockfile
pnpm run verify
pnpm pack --dry-run
```

Fixtures install the tarball in clean JS, TS7, TS-lint and Vue projects on Node
22 and 24, with automatic peer installation disabled.

Publishing is CI-only. After separate approval, a `v*` tag starts the release
workflow, repeats the gate and runs `pnpm publish` with npm provenance. Local
publish is forbidden.

## License

Apache-2.0 © SwarmMachina
