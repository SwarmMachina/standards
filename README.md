# @swarmmachina/standards

Shared code style, linting rules, git conventions and project standards for all SwarmMachina projects.

## Includes

- ESLint flat config with:
  - JavaScript + Vue 3 support
  - A separate TypeScript preset based on typescript-eslint
  - JSDoc rules
  - Prettier integration
- A strict reusable TypeScript base config
- Prettier formatting rules
- Git commit message convention (Conventional Commits)
- Git hook for auto-formatting commit messages
- Editor and tool configs: `.editorconfig`, `.prettierignore`, `.prettierrc`, `.gitignore`

---

## Installation

Install as a dev dependency:

```bash
npm i -D @swarmmachina/standards
```

---

## Usage

### ESLint (flat config)

In your project root, create `eslint.config.js`:

```js
import config from '@swarmmachina/standards/eslint.config.mjs'

export default config
```

For TypeScript projects, install the peer tooling and use the separate preset:

```bash
npm i -D typescript typescript-eslint
```

```js
import config from '@swarmmachina/standards/eslint-ts'

export default config
```

The JavaScript preset remains available at
`@swarmmachina/standards/eslint.config.mjs`.

Lint your code:

```bash
npm run check
npm run fix
```

### TypeScript

Extend the strict base config and keep project-specific paths local:

```json
{
  "extends": "@swarmmachina/standards/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

The base config targets NodeNext/ES2023, emits declarations and source maps,
and limits source code to erasable TypeScript syntax.

---

### Prettier

Copy the shared files into your project root:

```bash
cp node_modules/@swarmmachina/standards/code-style/.editorconfig .editorconfig
cp node_modules/@swarmmachina/standards/code-style/.prettierrc .prettierrc
cp node_modules/@swarmmachina/standards/code-style/.prettierignore .prettierignore
```

You can override them in your project if needed.

The shared Git ignore file is available at:

```bash
node_modules/@swarmmachina/standards/git/.gitignore
```

---

### Git commit convention

See [`git/commit-convention.md`](./git/commit-convention.md) for the format.

To install the shared hooks, run:

```bash
node node_modules/@swarmmachina/standards/git/setup-hooks.mjs
```

If commit doesn't match the convention, `chore:` will be auto-prepended.

---

## Directory structure

```
standards/
├── code-style/
│   ├── .editorconfig
│   ├── .prettierrc
│   ├── .prettierignore
│   ├── eslint.config.mjs
│   ├── eslint-ts.config.mjs
│   └── tsconfig.base.json
├── git/
│   ├── .gitignore
│   ├── commit-convention.md
│   └── hooks/
│       ├── pre-commit
│       └── prepare-commit-msg
└── git/setup-hooks.mjs
```

---

## License

Licensed under the Apache-2.0 License.
Copyright © 2025 SwarmMachina
