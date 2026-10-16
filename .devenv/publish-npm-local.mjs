// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * Interactive, idempotent **first-time** npm name reservation (local only).
 *
 * 💡 Intended for the one-time publish that reserves the scoped package name
 * (e.g. `0.0.0`). Safe to re-run: if the package **name** already exists on
 * the registry, this script exits 0 and never publishes again.
 *
 * - No `--provenance` (provenance is for CI / `publish-npm-worker.mjs`).
 * - Publish path requires a TTY confirmation; non-TTY with a free name fails.
 * - After publish, polls npm for up to 300s before treating reservation as done.
 * - Package-agnostic: reads `../package.json` relative to `.devenv/`.
 *
 * @module publish-npm-local
 */

import {
  askYesNo,
  isInteractive,
  logError,
  logGo,
  logInfo,
  logOk,
  logSkip,
  packageNameExistsOnRegistry,
  readPackageIdentity,
  readPublishedVersion,
  requireNpmWhoami,
  run,
  waitForPackageNameOnRegistry,
} from "./publish-npm-lib.mjs";

/**
 * Reserves the package name on the public npm registry when still free.
 *
 * @returns {Promise<void>} Resolves on success or idempotent skip.
 */
async function main() {
  logGo("publish:npm:local — interactive name reservation");

  const { name, version, spec } = readPackageIdentity();
  logInfo(`Package name: ${name}`);
  logInfo(`Local version: ${version}`);
  logInfo(`Publish spec: ${spec}`);

  const user = requireNpmWhoami();
  logOk(`npm whoami: ${user}`);

  if (packageNameExistsOnRegistry(name)) {
    const published = readPublishedVersion(name);
    logSkip(
      `${name} is already on npm` +
        (published ? ` (latest: ${published})` : "") +
        ". Name reservation is done; no publish.",
    );
    process.exitCode = 0;
    return;
  }

  logInfo(`${name}@${version} is not on the registry yet.`);

  if (!isInteractive()) {
    logError(
      "Refusing to publish without a TTY. Run `npm run publish:npm:local` in an interactive terminal, or skip if the name is already reserved.",
    );
    process.exitCode = 1;
    return;
  }

  const confirmed = await askYesNo(
    `Publish ${name}@${version} (${spec}) with --access public (no provenance) to reserve the name?`,
    false,
  );
  if (!confirmed) {
    logSkip("Publish cancelled by user.");
    process.exitCode = 0;
    return;
  }

  logGo("Building package…");
  run("npm run build");

  logGo(`Publishing ${name}@${version}…`);
  run("npm publish --access public");

  const after = await waitForPackageNameOnRegistry(name, {
    timeoutMs: 300_000,
    intervalMs: 10_000,
  });
  if (!after) {
    logError(
      `Publish finished but npm still does not show "${name}" after 300s. Check https://www.npmjs.com/package/${name} manually.`,
    );
    process.exitCode = 1;
    return;
  }

  logOk(`Reserved ${name} on npm (registry version ${after}; local was ${version}).`);
  process.exitCode = 0;
}

main().catch((error) => {
  logError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
