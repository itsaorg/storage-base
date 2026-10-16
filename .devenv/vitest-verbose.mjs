#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `vitest:verbose` — runs `vitest` via tool-lib.
 *
 * @module vitest-verbose
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["--config", "configs/vitest.config.ts", "--run", "--reporter=verbose"].concat(
  forwardedArgs(),
);
process.exitCode = runTool({
  label: "vitest:verbose",
  bin: "vitest",
  args,
});
