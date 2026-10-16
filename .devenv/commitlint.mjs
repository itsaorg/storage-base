#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `commitlint` — runs `commitlint` via tool-lib.
 *
 * @module commitlint
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["--config", "configs/commitlint.config.js"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "commitlint",
  bin: "commitlint",
  args,
});
