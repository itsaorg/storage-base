#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `vitest` — runs `vitest` via tool-lib.
 *
 * @module vitest
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["--config", "configs/vitest.config.ts"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "vitest",
  bin: "vitest",
  args,
});
