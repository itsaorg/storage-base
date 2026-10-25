# `.devenv/scripts`

Every development script is ESM (`.mjs`). Git hooks stay in `.husky`. Call package scripts with `npm run`.

## Layout

```text
.devenv/scripts/lib/tool-lib.mjs
.devenv/scripts/lib/repo-root.mjs
.devenv/scripts/tools/<tool>/<action>.mjs
.devenv/scripts/git/*.mjs
.devenv/scripts/node/check.mjs
.devenv/scripts/gh/*.mjs
.devenv/scripts/changelog/generate.mjs
.devenv/scripts/setup/*.mjs
```

`git/configure.mjs`, `git/setup.mjs`, `git/install.mjs`, `git/uninstall.mjs`, and `git/upgrade.mjs` only log that they are placeholders. They do not change Git.

## Setup

| Command                    | Script                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `npm run setup`            | `setup/setup.mjs` then `setup/devenv-setup.mjs` (`npm ci`, `husky:prepare`, `check`) |
| `npm run setup:post-clone` | `setup/post-clone.mjs` then `setup/post-clone-run.mjs`                               |
| `npm run setup:labels`     | `setup/github-labels.mjs` then `gh/labels-sync.mjs`                                  |

See [POST-CLONE-STEPS.md](POST-CLONE-STEPS.md) for the post-clone order.

## GitHub CLI

| Script                    | What it does                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `gh/check.mjs`            | Logs whether `gh` is on PATH                                                       |
| `gh/auth-setup.mjs`       | Logs `gh auth status`. On a TTY, runs `gh auth login` when logged out. Skips in CI |
| `gh/process-label.mjs`    | Creates or updates one label with `gh label create --force`                        |
| `gh/process-labels.mjs`   | Loops labels from a JSON file                                                      |
| `gh/label-create.mjs`     | Reads a labels JSON path and calls `process-labels.mjs`                            |
| `gh/labels-sync.mjs`      | Syncs `.github/labels.json`                                                        |
| `gh/issue-create.mjs`     | Creates an issue from `.github/ISSUE_BODY.md`                                      |
| `gh/issue-preview.mjs`    | Logs the create command and does not create the issue                              |
| `gh/pr-create.mjs`        | Opens a pull request from `.github/PR_BODY.md`                                     |
| `gh/pr-preview.mjs`       | Logs the create command and does not open the pull request                         |
| `gh/pr-merge.mjs`         | Merges a pull request                                                              |
| `gh/pr-merge-preview.mjs` | Logs the merge command and does not merge                                          |

Preview scripts set `DRY_RUN=true`.
