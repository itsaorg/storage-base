#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `vitest:coverage` — runs `vitest` via tool-lib.
 *
 * @module vitest-coverage
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["--config", "configs/vitest.config.ts", "--run", "--coverage"].concat(
  forwardedArgs(),
);
process.exitCode = runTool({
  label: "vitest:coverage",
  bin: "vitest",
  args,
});
