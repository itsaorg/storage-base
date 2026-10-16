// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * Non-interactive, idempotent npm publish for CI / tag releases (worker).
 *
 * 💡 Used by `npm run release:npm` (and thus `.github/workflows/release.yml` on
 * `v*` tags). Skips when `name@version` is already on the registry. Adds
 * `--provenance` only when `GITHUB_ACTIONS` is set. Does not run `build`
 * (the caller must build first).
 *
 * Package-agnostic: reads `../package.json` relative to `.devenv/`.
 *
 * @module publish-npm-worker
 */

import {
  logError,
  logGo,
  logInfo,
  logOk,
  logSkip,
  packageSpecExistsOnRegistry,
  readPackageIdentity,
  run,
} from "./publish-npm-lib.mjs";

/**
 * Publishes the current `package.json` version when missing from the registry.
 *
 * @returns {void}
 */
function main() {
  logGo("publish:npm:worker — non-interactive publish-if-missing");

  const { spec } = readPackageIdentity();
  logInfo(`Local package: ${spec}`);

  if (packageSpecExistsOnRegistry(spec)) {
    logSkip(`${spec} is already on npm; skipping publish.`);
    process.exitCode = 0;
    return;
  }

  const provenance = process.env.GITHUB_ACTIONS ? " --provenance" : "";
  logGo(`Publishing ${spec}${provenance ? " with provenance" : ""}…`);
  run(`npm publish --access public${provenance}`);
  logOk(`Published ${spec}.`);
  process.exitCode = 0;
}

try {
  main();
} catch (error) {
  logError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
