# Contributing

## 🗂️ Table Of Contents

- [Contributing](#contributing)
  - [🗂️ Table Of Contents](#️-table-of-contents)
  - [Tool scripts](#tool-scripts)
  - [Husky hooks](#husky-hooks)
  - [Required checks](#required-checks)

Branches follow Git Flow AVH: `main`, `develop`, `feature/`, `bugfix/`, `release/`, `hotfix/`, `support/`, and tag prefix `v`.

Start a feature from `develop`:

```bash
git flow feature start <number>-<slug>
```

Commit messages use Conventional Commits: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Tool scripts

Every `package.json` script is tool-prefixed and runs a shebang `.devenv/*.mjs` wrapper (boxed emoji logs). Prefer `npm run <script>` from hooks, CI, and local shells.

| Script                      | Purpose                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run check`             | CI gate: `tsc:typecheck` → `prettier:check` → `eslint:lint` → `layout:check` → `vitest:run` → `tsc:build` |
| `npm run vitest:run`        | Vitest once (no watch, no coverage/)                                                                      |
| `npm run vitest:coverage`   | Opt-in coverage report (not in husky/CI gate)                                                             |
| `npm run changeset:status`  | Changesets status                                                                                         |
| `npm run npm:publish:local` | Interactive name reservation                                                                              |
| `npm run npm:trust`         | Trusted Publishing setup                                                                                  |

## Husky hooks

Hooks install via `npm prepare` → `husky:prepare`. They call **only** `npm run` scripts.

| Hook          | What it runs               |
| ------------- | -------------------------- |
| `pre-commit`  | `lint-staged` then `check` |
| `commit-msg`  | `commitlint -- --edit`     |
| `pre-push`    | `check`                    |
| `post-commit` | Local success log          |

Skip once: `HUSKY=0 git commit …` or `HUSKY=0 git push …`. Do not edit `.husky/_/`.

Trusted Publishing for `@itsaorg/storage-base` is already configured (workflow `release.yml`).

## Required checks

```bash
npm run check
```
