// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * Deprecates the name-reservation version (`0.0.0`) after a real release exists.
 *
 * 💡 Run only after `0.1.0` (or later) is on the registry (R2 Task 20). Refuses
 * when latest is still `0.0.0`. Package-agnostic: reads `../package.json`.
 *
 * @module deprecate-npm-reservation
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
  packageSpecExistsOnRegistry,
  readPackageIdentity,
  readPublishedVersion,
  requireNpmWhoami,
  run,
} from "./publish-npm-lib.mjs";

/** @type {string} Semver used only to reserve the scoped name. */
const RESERVATION_VERSION = "0.0.0";

/** @type {string} Message installers see for the deprecated reservation. */
const DEPRECATE_REASON =
  "Name-reservation scaffold only. Install a released version (>=0.1.0), not 0.0.0.";

/**
 * Deprecates `${name}@0.0.0` when a newer release is already published.
 *
 * @returns {Promise<void>}
 */
async function main() {
  logGo("deprecate:npm:reservation — deprecate name-reservation 0.0.0");

  const { name, version } = readPackageIdentity();
  logInfo(`Package name: ${name}`);
  logInfo(`Local version: ${version}`);
  logInfo(`Reservation target: ${name}@${RESERVATION_VERSION}`);

  const user = requireNpmWhoami();
  logOk(`npm whoami: ${user}`);

  const reservationSpec = `${name}@${RESERVATION_VERSION}`;
  if (!packageSpecExistsOnRegistry(reservationSpec)) {
    logSkip(`${reservationSpec} is not on npm; nothing to deprecate.`);
    process.exitCode = 0;
    return;
  }

  const latest = readPublishedVersion(name);
  if (!latest) {
    logError(`Could not read latest version for ${name}.`);
    process.exitCode = 1;
    return;
  }
  logInfo(`Registry latest: ${latest}`);

  if (latest === RESERVATION_VERSION) {
    logError(
      `Latest on npm is still ${RESERVATION_VERSION}. Publish a real release (>=0.1.0) first (Task 20), then re-run.`,
    );
    process.exitCode = 1;
    return;
  }

  const autoYes = hasYesFlag();
  if (!autoYes) {
    if (!isInteractive()) {
      logError("Refusing without a TTY. Re-run interactively or pass -y.");
      process.exitCode = 1;
      return;
    }
    const confirmed = await askYesNo(
      `Deprecate ${reservationSpec} with reason: "${DEPRECATE_REASON}"?`,
      false,
    );
    if (!confirmed) {
      logSkip("Deprecate cancelled by user.");
      process.exitCode = 0;
      return;
    }
  }

  logGo(`Deprecating ${reservationSpec}…`);
  run(`npm deprecate "${reservationSpec}" "${DEPRECATE_REASON}"`);
  logOk(`Deprecated ${reservationSpec}.`);
  logInfo(`Verify: npm view ${reservationSpec} deprecated`);
  process.exitCode = 0;
}

main().catch((error) => {
  logError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
