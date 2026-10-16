#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `prettier:check` — runs `prettier` via tool-lib.
 *
 * @module prettier-check
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = [
  "--config",
  "configs/.prettierrc.json",
  "--ignore-path",
  "configs/prettierignore",
  "--check",
  ".",
].concat(forwardedArgs());
process.exitCode = runTool({
  label: "prettier:check",
  bin: "prettier",
  args,
});
