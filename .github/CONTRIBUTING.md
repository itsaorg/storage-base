# Contributing

Branches follow Git Flow AVH: `main`, `develop`, `feature/`, `bugfix/`, `release/`, `hotfix/`, `support/`, and tag prefix `v`.

Start a feature from `develop`:

```bash
git flow feature start <number>-<slug>
```

Commit messages use Conventional Commits: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Required checks:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```
