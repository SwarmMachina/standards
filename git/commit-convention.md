# SwarmMachina Commit Convention

We use **Conventional Commits**

## 💬 Examples

```text
feat: add auto-responder logic
fix(db): incorrect filter in task stats
chore: update eslint config
docs: add API usage to README
refactor(parser): simplify text parsing logic
```

## 📌 Allowed types

- `feat` — new feature
- `fix` — bug fix
- `refactor` — code change without affecting behavior
- `chore` — non-functional change (e.g., config)
- `docs` — documentation
- `test` — test-related changes
- `ci`, `build`, `perf`, `style` — as needed

## ❗ Requirement

All commits to main branches must follow this format.

## 🔧 Hook installation

Link the commit hook manually:

```bash
chmod +x git/hooks/pre-commit
chmod +x git/hooks/prepare-commit-msg

ln -sf ../../git/hooks/pre-commit .git/hooks/pre-commit
ln -sf ../../git/hooks/prepare-commit-msg .git/hooks/prepare-commit-msg
```
