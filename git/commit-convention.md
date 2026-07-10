# SwarmMachina Commit Convention

We use **Conventional Commits**.

## Format

```text
type(scope): subject
type: subject
type(scope)!: subject
type!: subject
```

Where:

- `type` — required commit type
- `scope` — optional area or module name
- `!` — optional marker for breaking changes
- `subject` — short human-readable description

## Examples

```text
feat: add auto-responder logic
fix(db): incorrect filter in task stats
chore: update eslint config
docs: add API usage to README
refactor(parser): simplify text parsing logic
feat(frontend): admin CRUD for roles and permissions
fix(auth): token refresh and TOTP QR handling
refactor(ui): redesign with Slate & Precision system
feat(api)!: change public auth response format
```

## Allowed types

- `feat` — new feature
- `fix` — bug fix
- `refactor` — code change without changing external behavior
- `chore` — non-functional change, maintenance, config
- `docs` — documentation changes
- `test` — tests
- `ci` — CI/CD changes
- `build` — build system or dependencies
- `perf` — performance improvements
- `style` — formatting or style-only changes without logic changes

## Scope rules

Scope is optional, but recommended for medium and large changes.

Examples of scopes:

- `frontend`
- `backend`
- `auth`
- `db`
- `parser`
- `api`
- `ui`

Use lowercase names with letters, numbers, `_` or `-`.

## Requirement

All commits to main branches must follow this format.

Valid examples:

- `feat: add user role assignment`
- `fix(frontend): avatar reload after update`
- `refactor(ui): simplify modal state handling`
- `feat(api)!: remove legacy auth endpoint`

Invalid examples:

- `update stuff`
- `frontend fix`
- `chore: feat(frontend): add roles`
- `fix : broken login`

## Hook behavior

The `prepare-commit-msg` hook checks the first line of the commit message.

If the message already matches Conventional Commits, it is left unchanged.

If the message does not match, the hook automatically prefixes it with:

```text
chore:
```

Example:

- input: `update eslint rules`
- result: `chore: update eslint rules`

## Supported pattern

```text
^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\([[:alnum:]_-]+\))?!?:[ ]
```

This pattern supports:

- commits with or without scope
- optional breaking change marker `!`
- lowercase scopes with letters, digits, `_` and `-`

## Hook installation

Link the commit hooks manually:

```bash
chmod +x git/hooks/pre-commit
chmod +x git/hooks/prepare-commit-msg

ln -sf ../../git/hooks/pre-commit .git/hooks/pre-commit
ln -sf ../../git/hooks/prepare-commit-msg .git/hooks/prepare-commit-msg
```
