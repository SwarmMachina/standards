# @swarmmachina/standards

Shared code style, linting rules, git conventions and project standards for all SwarmMachina projects.

## Includes

- ESLint flat config with:
  - JavaScript + Vue 3 support
  - JSDoc rules
  - Prettier integration
- Prettier formatting rules
- Git commit message convention (Conventional Commits)
- Git hook for auto-formatting commit messages
- Editor & tool configs: `.editorconfig`, `.prettierignore`, `.gitignore`

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

Lint your code:

```bash
npm run check   # check style
npm run fix     # auto-fix and format
```

---

### Prettier

Uses built-in `.prettierrc`, `.prettierignore`, and `.editorconfig`.

You can override them in your project if needed.

---

### Git commit convention

See [`git/commit-convention.md`](./git/commit-convention.md) for the format.

To enable automatic commit prefixing, link the hook:

```bash
chmod +x git/hooks/pre-commit
chmod +x git/hooks/prepare-commit-msg

ln -sf ../../git/hooks/pre-commit .git/hooks/pre-commit
ln -sf ../../git/hooks/prepare-commit-msg .git/hooks/prepare-commit-msg
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
│   └── eslint.mjs
├── git/
│   ├── .gitignore
│   ├── commit-convention.md
│   └── hooks/
│       ├── pre-commit
│       └── prepare-commit-msg
```

---

## License

Licensed under the Apache-2.0 License.
Copyright © 2025 SwarmMachina
