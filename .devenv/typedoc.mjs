#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `typedoc` — runs `typedoc` via tool-lib.
 *
 * @module typedoc
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["--options", "configs/typedoc.json"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "typedoc",
  bin: "typedoc",
  args,
});
