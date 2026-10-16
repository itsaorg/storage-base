// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * Configures npm Trusted Publishing for GitHub Actions (package-agnostic).
 *
 * 💡 Wraps `npm trust github` using the local `package.json` name and the
 * `origin` GitHub remote. Binds the Trusted Publisher to workflow filename
 * `release.yml` under `.github/workflows/` (npm wants the filename only).
 *
 * Requires npm CLI with `npm trust` support (npm 11+). Interactive TTY confirm
 * unless `-y` / `--yes` is passed.
 *
 * @module trust-npm-github
 */

import {
  askYesNo,
  hasYesFlag,
  isInteractive,
  logError,
  logGo,
  logInfo,
  logOk,
  logSkip,
  readPackageIdentity,
  requireGithubOwnerRepo,
  requireNpmWhoami,
  run,
} from "./publish-npm-lib.mjs";

/** @type {string} Workflow filename Trusted Publishing must match. */
const WORKFLOW_FILE = "release.yml";

/**
 * Links the package to GitHub Actions OIDC publishing.
 *
 * @returns {Promise<void>}
 */
async function main() {
  logGo("trust:npm — configure npm Trusted Publishing for GitHub Actions");

  const { name, version } = readPackageIdentity();
  logInfo(`Package name: ${name}`);
  logInfo(`Local version: ${version}`);

  const user = requireNpmWhoami();
  logOk(`npm whoami: ${user}`);

  const ownerRepo = requireGithubOwnerRepo();
  logInfo(`GitHub repository: ${ownerRepo}`);
  logInfo(`Workflow filename: ${WORKFLOW_FILE}`);

  const autoYes = hasYesFlag();
  if (!autoYes) {
    if (!isInteractive()) {
      logError("Refusing without a TTY. Re-run interactively or pass -y.");
      process.exitCode = 1;
      return;
    }
    const confirmed = await askYesNo(
      `Add Trusted Publisher: GitHub Actions → ${ownerRepo} → ${WORKFLOW_FILE} for ${name}?`,
      false,
    );
    if (!confirmed) {
      logSkip("Trusted Publishing setup cancelled by user.");
      process.exitCode = 0;
      return;
    }
  }

  logGo("Running npm trust github…");
  run(`npm trust github "${name}" --file ${WORKFLOW_FILE} --repo ${ownerRepo} --allow-publish -y`);

  logOk(`Trusted Publishing configured for ${name} ← ${ownerRepo} / ${WORKFLOW_FILE}.`);
  logInfo(
    `Verify in the browser: https://www.npmjs.com/package/${name}/access (Trusted Publisher section).`,
  );
  process.exitCode = 0;
}

main().catch((error) => {
  logError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
