#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `eslint:lint` — runs `eslint` via tool-lib.
 *
 * @module eslint-lint
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = [".", "--config", "configs/eslint.config.js"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "eslint:lint",
  bin: "eslint",
  args,
});
