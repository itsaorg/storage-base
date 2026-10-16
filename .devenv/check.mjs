#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `check` — CI gate (no vitest:coverage).
 *
 * Order: tsc:typecheck → prettier:check → eslint:lint → layout:check →
 * vitest:run → tsc:build.
 *
 * @module check
 */

import {
  boxBanner,
  boxDone,
  logError,
  logOk,
  readPackageIdentity,
  runNpmScript,
} from "./tool-lib.mjs";

const steps = [
  "tsc:typecheck",
  "prettier:check",
  "eslint:lint",
  "layout:check",
  "vitest:run",
  "tsc:build",
];

const { name, version } = readPackageIdentity();
boxBanner(`▶️  check — ${name}@${version}`);

for (const script of steps) {
  const code = runNpmScript(script);
  if (code !== 0) {
    logError(`check failed at ${script}`);
    process.exitCode = code;
    process.exit(code);
  }
}

logOk(`check passed for ${name}@${version}`);
boxDone("check");
process.exitCode = 0;
