# Contributing

Branches follow Git Flow AVH: `main`, `develop`, `feature/`, `bugfix/`, `release/`, `hotfix/`, `support/`, and tag prefix `v`.

Start a feature from `develop`:

```bash
git flow feature start <number>-<slug>
```

Commit messages use Conventional Commits: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Husky hooks

Hooks install via `npm prepare` (`husky`) and live under `.husky/`. Shared helpers are in `.husky/common.sh` (repo root + package name/version from `package.json`). Gates call `npm run <script>` so checks stay configurable in `package.json`.

| Hook          | What it runs                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `pre-commit`  | `lint-staged`, then CI gate (`typecheck` → `format:check` → `lint` → `check:layout` → `test:run` → `build`) |
| `commit-msg`  | `npm run commitlint -- --edit`                                                                              |
| `pre-push`    | Same CI gate as pre-commit (no `lint-staged`, no `test:coverage`)                                           |
| `post-commit` | Local success log (short SHA + package identity)                                                            |

Hooks never run `test:coverage` (avoids writing `coverage/`). Use `npm run test:coverage` when you want a coverage report. Skip once: `HUSKY=0 git commit …` or `HUSKY=0 git push …`. Do not edit files under `.husky/_/` (managed by the husky package).

Trusted Publishing for `@itsaorg/storage-base` is already configured (GitHub Actions workflow `release.yml`).

## Required checks

Same as the husky CI gate (or `npm run check`):

```bash
npm run check
```

Optional coverage (not in husky):

```bash
npm run test:coverage
```
