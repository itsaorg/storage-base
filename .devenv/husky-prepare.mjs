#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `husky:prepare` — runs `husky` via tool-lib.
 *
 * @module husky-prepare
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = [].concat(forwardedArgs());
process.exitCode = runTool({
  label: "husky:prepare",
  bin: "husky",
  args,
});
