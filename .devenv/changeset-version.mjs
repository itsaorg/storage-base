#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `changeset:version` — runs `changeset` via tool-lib.
 *
 * @module changeset-version
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["version"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "changeset:version",
  bin: "changeset",
  args,
});
