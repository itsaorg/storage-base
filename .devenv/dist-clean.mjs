#!/usr/bin/env node
// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * npm script `dist:clean` — remove the `dist/` output directory.
 *
 * @module dist-clean
 */

import { rmSync } from "node:fs";
import path from "node:path";
import { boxBanner, boxDone, logOk, readPackageIdentity, repoRoot } from "./tool-lib.mjs";

const { name, version } = readPackageIdentity();
boxBanner(`▶️  dist:clean — ${name}@${version}`);
rmSync(path.join(repoRoot, "dist"), { recursive: true, force: true });
logOk("removed dist/");
boxDone("dist:clean");
