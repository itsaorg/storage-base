#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `tsc:emit` — runs `tsc` via tool-lib.
 *
 * @module tsc-emit
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["--project", "tsconfig.json", "--pretty"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "tsc:emit",
  bin: "tsc",
  args,
});
