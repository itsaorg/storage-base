#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `changeset:status` — runs `changeset` via tool-lib.
 *
 * @module changeset-status
 */

import { forwardedArgs, runTool } from "./tool-lib.mjs";

const args = ["status", "--verbose"].concat(forwardedArgs());
process.exitCode = runTool({
  label: "changeset:status",
  bin: "changeset",
  args,
});
