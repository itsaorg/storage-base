# Contributing

Branches follow Git Flow AVH: `main`, `develop`, `feature/`, `bugfix/`, `release/`, `hotfix/`, `support/`, and tag prefix `v`.

Start a feature from `develop`:

```bash
git flow feature start <number>-<slug>
```

Commit messages use Conventional Commits: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Husky hooks

Hooks install via `npm prepare` (`husky`) and live under `.husky/`. Shared helpers are in `.husky/common.sh` (repo root + package name/version from `package.json`).

| Hook          | What it runs                                      |
| ------------- | ------------------------------------------------- |
| `pre-commit`  | `lint-staged` (Prettier + ESLint on staged files) |
| `commit-msg`  | Commitlint (`configs/commitlint.config.js`)       |
| `pre-push`    | `npm test -- --run` (no Vitest watch)             |
| `post-commit` | Local success log (short SHA + package identity)  |

Skip once: `HUSKY=0 git commit …` or `HUSKY=0 git push …`. Do not edit files under `.husky/_/` (managed by the husky package).

## Required checks

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run format:check
```

```bash
npm test -- --run
```

```bash
npm run build
```
