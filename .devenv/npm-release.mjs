#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `npm:release` — `tsc:build` then `npm:publish:worker`.
 *
 * @module npm-release
 */

import { boxBanner, boxDone, logError, readPackageIdentity, runNpmScript } from "./tool-lib.mjs";

const { name, version } = readPackageIdentity();
boxBanner(`▶️  npm:release — ${name}@${version}`);

let code = runNpmScript("tsc:build");
if (code !== 0) {
  logError("npm:release failed at tsc:build");
  process.exitCode = code;
  process.exit(code);
}

code = runNpmScript("npm:publish:worker");
if (code !== 0) {
  logError("npm:release failed at npm:publish:worker");
  process.exitCode = code;
  process.exit(code);
}

boxDone("npm:release");
process.exitCode = 0;
