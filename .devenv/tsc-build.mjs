#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `tsc:build` — `dist:clean` then `tsc:emit`.
 *
 * @module tsc-build
 */

import { boxBanner, boxDone, logError, readPackageIdentity, runNpmScript } from "./tool-lib.mjs";

const { name, version } = readPackageIdentity();
boxBanner(`▶️  tsc:build — ${name}@${version}`);

let code = runNpmScript("dist:clean");
if (code !== 0) {
  logError("tsc:build failed at dist:clean");
  process.exitCode = code;
  process.exit(code);
}

code = runNpmScript("tsc:emit");
if (code !== 0) {
  logError("tsc:build failed at tsc:emit");
  process.exitCode = code;
  process.exit(code);
}

boxDone("tsc:build");
process.exitCode = 0;
