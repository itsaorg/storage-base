// Copyright 2026 Astitv Singh <https://github.com/astitvsingh>.
// SPDX-License-Identifier: Apache-2.0

/**
 * Shared helpers for package-agnostic npm publish scripts under `.devenv/`.
 *
 * 💡 Used by `publish-npm-local.mjs` (interactive name reservation) and
 * `publish-npm-worker.mjs` (non-interactive tag / CI publish). Safe to copy
 * into any repo that keeps `package.json` one level above `.devenv/`.
 *
 * @module publish-npm-lib
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

/**
 * Absolute path to the repository root (parent of `.devenv/`).
 *
 * @type {string}
 */
export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * @typedef {object} PackageIdentity
 * @property {string} name - npm package name from `package.json`.
 * @property {string} version - Semver version from `package.json`.
 * @property {string} spec - Combined `name@version` publish specifier.
 */

/**
 * Reads and parses the root `package.json`.
 *
 * @returns {PackageIdentity} Name, version, and combined spec.
 * @throws {Error} When `name` or `version` is missing.
 */
export function readPackageIdentity() {
  const pkg = JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  if (typeof pkg.name !== "string" || !pkg.name) {
    throw new Error('package.json is missing a string "name" field');
  }
  if (typeof pkg.version !== "string" || !pkg.version) {
    throw new Error('package.json is missing a string "version" field');
  }
  return {
    name: pkg.name,
    version: pkg.version,
    spec: `${pkg.name}@${pkg.version}`,
  };
}

/**
 * Runs a shell command in the repo root.
 *
 * @param {string} command - Full command line.
 * @param {{ inherit?: boolean }} [options] - When `inherit` is true (default),
 *   pipe stdio to the parent; otherwise capture and discard.
 * @returns {string} Captured stdout when not inheriting; otherwise `""`.
 */
export function run(command, options = {}) {
  const inherit = options.inherit !== false;
  const result = execSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
  return inherit ? "" : String(result ?? "").trim();
}

/**
 * Logs an informational line.
 *
 * @param {string} message - Message body (emoji prefix added).
 * @returns {void}
 */
export function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

/**
 * Logs a success line.
 *
 * @param {string} message - Message body (emoji prefix added).
 * @returns {void}
 */
export function logOk(message) {
  console.log(`✅ ${message}`);
}

/**
 * Logs a skip / no-op line.
 *
 * @param {string} message - Message body (emoji prefix added).
 * @returns {void}
 */
export function logSkip(message) {
  console.log(`⏭️  ${message}`);
}

/**
 * Logs an error line.
 *
 * @param {string} message - Message body (emoji prefix added).
 * @returns {void}
 */
export function logError(message) {
  console.error(`❌ ${message}`);
}

/**
 * Logs a prompt / question line.
 *
 * @param {string} message - Message body (emoji prefix added).
 * @returns {void}
 */
export function logAsk(message) {
  console.log(`❓ ${message}`);
}

/**
 * Logs a start / action line.
 *
 * @param {string} message - Message body (emoji prefix added).
 * @returns {void}
 */
export function logGo(message) {
  console.log(`▶️  ${message}`);
}

/**
 * Whether stdin is an interactive TTY.
 *
 * @returns {boolean} True when prompts are allowed.
 */
export function isInteractive() {
  return Boolean(input.isTTY);
}

/**
 * Asks a yes/no question on TTY. Non-TTY callers must not reach this.
 *
 * @param {string} label - Question text shown to the user.
 * @param {boolean} [defaultYes=false] - Default when the user presses Enter.
 * @returns {Promise<boolean>} True when the answer is yes.
 */
export async function askYesNo(label, defaultYes = false) {
  const hint = defaultYes ? "Y/n" : "y/N";
  const rl = readline.createInterface({ input, output });
  try {
    const answer = (await rl.question(`❓ ${label} (${hint}): `)).trim().toLowerCase();
    if (answer === "") {
      return defaultYes;
    }
    return /^(y|yes)$/.test(answer);
  } finally {
    rl.close();
  }
}

/**
 * Returns whether any version of the package name exists on the registry.
 *
 * @param {string} name - Package name (e.g. `@scope/pkg`).
 * @returns {boolean} True when `npm view <name> version` succeeds.
 */
export function packageNameExistsOnRegistry(name) {
  try {
    run(`npm view "${name}" version`, { inherit: false });
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns whether the exact `name@version` exists on the registry.
 *
 * @param {string} spec - Specifier `name@version`.
 * @returns {boolean} True when `npm view <spec> version` succeeds.
 */
export function packageSpecExistsOnRegistry(spec) {
  try {
    run(`npm view "${spec}" version`, { inherit: false });
    return true;
  } catch {
    return false;
  }
}

/**
 * Prints the npm whoami identity or throws with guidance.
 *
 * @returns {string} Logged-in npm username.
 * @throws {Error} When `npm whoami` fails (not logged in).
 */
export function requireNpmWhoami() {
  try {
    const user = run("npm whoami", { inherit: false });
    if (!user) {
      throw new Error("empty whoami");
    }
    return user;
  } catch {
    throw new Error(
      "npm whoami failed. Log in with an account that can publish under the package scope (npm login), then retry.",
    );
  }
}

/**
 * Reads the latest published version string for a package name, if any.
 *
 * @param {string} name - Package name.
 * @returns {string | null} Version string, or null when the name is free.
 */
export function readPublishedVersion(name) {
  try {
    const version = run(`npm view "${name}" version`, { inherit: false });
    return version || null;
  } catch {
    return null;
  }
}
