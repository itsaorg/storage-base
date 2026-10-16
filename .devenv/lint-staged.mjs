#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `lint-staged` — runs `lint-staged` via tool-lib.
 *
 * @module lint-staged
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = [].concat(forwardedArgs());
process.exitCode = runTool({
  label: "lint-staged",
  bin: "lint-staged",
  args,
});
