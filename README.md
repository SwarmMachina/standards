# @swarmmachina/standards

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Node.js Version](https://img.shields.io/badge/node-22.13%2B%20%7C%2024.x-brightgreen)](https://nodejs.org/)
[![TypeScript Compiler](https://img.shields.io/badge/TypeScript-7.0.2-blue)](https://www.typescriptlang.org/)

Shared ESLint presets, TypeScript compiler defaults, Prettier configuration and
Git conventions for SwarmMachina packages.

## Tooling contours

The package has separate entry points so consumers load only the tooling their
source type needs:

| Project             | ESLint preset                                   | Compiler           | Additional consumer dependencies                                           |
| ------------------- | ----------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| JavaScript          | `@swarmmachina/standards/eslint-js`             | None               | None                                                                       |
| TypeScript          | `@swarmmachina/standards/eslint-typescript`     | TypeScript 7       | TS7 plus the TS6 lint sidecar described below                              |
| Vue with JavaScript | `@swarmmachina/standards/eslint-vue`            | None               | None                                                                       |
| Vue with TypeScript | `@swarmmachina/standards/eslint-vue-typescript` | Framework-specific | TS6 lint sidecar; TS7 embedded-language type checking is not supported yet |

All presets use ESLint flat config. The JavaScript and JavaScript/Vue entry
points do not import or install `typescript` or `typescript-eslint`.
`vue-eslint-parser` is a pinned direct dependency of standards; Vue consumers
do not rely on pnpm's automatic peer installation.

## Runtime

- Node.js 22.13 or newer within the 22.x line
- Node.js 24.x
- pnpm 11.15.1
- ESLint 10.7.0
- Prettier 3.9.6

Node.js 20 is not supported. `eslint-plugin-jsdoc` 63.x itself requires Node.js
22.13 or 24+, so declaring Node.js 20 here would create a false compatibility
contract.

## Installation

### JavaScript

```sh
pnpm add --save-dev @swarmmachina/standards
```

```js
// eslint.config.mjs
import config from '@swarmmachina/standards/eslint-js'

export default config
```

No TypeScript package is installed by this contour.

### TypeScript 7 compiler

For compilation without TypeScript ESLint, install the native compiler under
its ordinary package name:

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

`rootDir` is intentionally project-owned. TypeScript 7 defaults it to the
directory containing `tsconfig.json`; packages that want `dist/index.js`
instead of `dist/src/index.js` should set it to `src`.

The shared config enables strict checking, `NodeNext`, ES2024,
`noUncheckedIndexedAccess`, declaration files, declaration maps and JavaScript
source maps. It also enables `erasableSyntaxOnly` and `verbatimModuleSyntax`.

TypeScript 7 turns the TypeScript 6 deprecations into hard errors. The shared
config therefore does not use removed targets or module modes (`es5`, `amd`,
`umd`, `system`, `none`), legacy `node`/`node10`/`classic` resolution,
`baseUrl`, or `downlevelIteration`. TS7 also defaults `types` to an empty list;
Node packages that use global `process`, `Buffer` or `NodeJS` declarations must
set `"types": ["node"]` in their project config.

### TypeScript 7 compiler with TypeScript ESLint

TypeScript 7.0 does not expose a stable programmatic API. The current
`typescript-eslint@8.65.0` manifest supports TypeScript `>=4.8.4 <6.1.0`, not
TypeScript 7. Do not alias TS7 to the `typescript` dependency used by the
parser.

Use the side-by-side layout recommended by the TypeScript team:

```sh
pnpm add --save-dev \
  @swarmmachina/standards \
  @typescript/native@npm:typescript@7.0.2 \
  typescript@npm:@typescript/typescript6@6.0.2 \
  typescript-eslint@8.65.0
```

The equivalent `package.json` section is:

```json
{
  "devDependencies": {
    "@swarmmachina/standards": "^2.0.0",
    "@typescript/native": "npm:typescript@7.0.2",
    "typescript": "npm:@typescript/typescript6@6.0.2",
    "typescript-eslint": "8.65.0"
  }
}
```

```js
// eslint.config.mjs
import config from '@swarmmachina/standards/eslint-typescript'

export default config
```

In this layout:

- `tsc` is the TypeScript 7 native compiler;
- `tsc6` is available for diagnostics and transition checks;
- `typescript-eslint` resolves the supported TypeScript 6 API from the
  `typescript` alias;
- ESLint runs without unsupported-version or peer-dependency warnings.

The preset uses syntax-aware recommended rules. It does not enable typed lint
rules that create a TypeScript project service.

### Vue

JavaScript Vue SFCs need only the package itself:

```js
// eslint.config.mjs
import config from '@swarmmachina/standards/eslint-vue'

export default config
```

For `<script lang="ts">`, install the TS6 lint sidecar shown above and use:

```js
// eslint.config.mjs
import config from '@swarmmachina/standards/eslint-vue-typescript'

export default config
```

This preset composes `vue-eslint-parser` with the supported
`typescript-eslint` parser. It validates Vue templates and TypeScript syntax,
but it does not make TS7 a Vue type checker. Volar and similar embedded-language
tools still need a stable compiler API; the TypeScript team currently recommends
TypeScript 6 for Vue, MDX, Astro and Svelte embedded-language workflows.

## Prettier

The shared configuration is a public module, so repositories do not need to
copy `.prettierrc` from `node_modules`:

```json
{
  "prettier": "@swarmmachina/standards/prettier"
}
```

Prettier is bundled by `@swarmmachina/standards`. A project may import and
extend the configuration when it has a justified local override:

```js
import config from '@swarmmachina/standards/prettier'

export default { ...config, printWidth: 100 }
```

## Public exports

| Export                    | Contract                                                        |
| ------------------------- | --------------------------------------------------------------- |
| `./eslint-js`             | JavaScript only                                                 |
| `./eslint-typescript`     | JavaScript + TypeScript lint                                    |
| `./eslint-vue`            | JavaScript + Vue lint                                           |
| `./eslint-vue-typescript` | JavaScript + TypeScript + Vue lint using the TS6 parser sidecar |
| `./prettier`              | Shared Prettier configuration object                            |
| `./tsconfig`              | Strict TypeScript compiler base                                 |
| `./setup-hooks.mjs`       | Git hook installer                                              |

The 1.x paths `./eslint.config.mjs`, `./code-style/eslint.config.mjs`,
`./eslint-ts` and `./tsconfig.base.json` remain available. The old JavaScript
entry point keeps its historical JavaScript + Vue composition, and the old
TypeScript entry point keeps its JavaScript + Vue + TypeScript composition.
New projects should use the explicit contour names.

## Migration from 1.2.0

1. Upgrade the runtime to Node.js 22.13+ or 24.x.
2. Replace `@swarmmachina/standards/eslint.config.mjs` with `eslint-js` for a
   JavaScript-only project or `eslint-vue` for a Vue project.
3. Replace `@swarmmachina/standards/eslint-ts` with `eslint-typescript` for a
   non-Vue TypeScript project.
4. Replace the copied `.prettierrc` with the `prettier` key shown above.
5. For a TS7 build plus ESLint, install TS7 as `@typescript/native` and the TS6
   API package as the `typescript` alias. Do not widen or suppress the parser's
   unsupported-version check.
6. Add `rootDir` to package `tsconfig.json` files when their emitted directory
   structure must start at `src`.
7. Replace `package-lock.json` with `pnpm-lock.yaml` and use pnpm 11.15.1 for
   frozen local and CI installs.

Consumers still pinned to standards 1.2.0 may temporarily keep
`autoInstallPeers: true`, because that release does not declare the
`vue-eslint-parser` peer required by `eslint-plugin-vue`. Standards 2 declares
the parser directly. After upgrading, set `autoInstallPeers: false` and repeat
the full package gate.

The release is major because the declared Node.js contract changes from
`>=20.19.0` to Node.js 22/24 and the canonical lint contracts are split into
explicit contours. Compatibility aliases reduce migration work but do not make
the Node.js engine change semver-compatible.

## Git convention

The Conventional Commits convention is documented in
[`git/commit-convention.md`](git/commit-convention.md). Install the shared hooks
from a repository root with:

```sh
node node_modules/@swarmmachina/standards/git/setup-hooks.mjs
```

Existing hooks are never overwritten.

## Verification

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm test
pnpm run test:fixtures
pnpm pack --dry-run
```

The fixture suite packs the package, installs that tarball into clean
JavaScript, TypeScript 7, TypeScript-lint, JavaScript/Vue and TypeScript/Vue
projects, and checks every public contour.

## Release policy

Publishing to npm is CI-only. A maintainer first approves the prepared commit
and push to `master`, then separately approves the release version and tag. The
`v*` tag starts the GitHub Actions workflow that runs a frozen pnpm install, the
verification suite and `pnpm publish`. The publish job grants only read access
to repository contents plus OIDC token minting, and enables npm provenance for
the pnpm publish command. Do not publish from a developer workstation.

## Compatibility sources

- [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [typescript-eslint dependency versions](https://typescript-eslint.io/users/dependency-versions/)
- [eslint-plugin-vue TypeScript parser composition](https://eslint.vuejs.org/user-guide/)
- [Prettier shared configuration](https://prettier.io/docs/sharing-configurations/)
- [npm provenance statements](https://docs.npmjs.com/generating-provenance-statements/)

## License

Licensed under the Apache-2.0 License. Copyright © 2025 SwarmMachina.
