#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `eslint:fix` — runs `eslint` via tool-lib.
 *
 * @module eslint-fix
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = [".", "--config", "configs/eslint.config.js", "--fix"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "eslint:fix",
  bin: "eslint",
  args,
});
