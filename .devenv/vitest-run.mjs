#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `vitest:run` — runs `vitest` via tool-lib.
 *
 * @module vitest-run
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["--config", "configs/vitest.config.ts", "--run"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "vitest:run",
  bin: "vitest",
  args,
});
