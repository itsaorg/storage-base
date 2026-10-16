#!/usr/bin/env sh
# =============================================================================
# 🧰 .husky/common.sh — shared helpers for package-agnostic Git hooks
# =============================================================================
# 📌 Purpose: resolve the repo root, read package.json identity dynamically,
#    emoji log helpers, and run_ci_gate via npm package.scripts.
# ▶️ Source from a hook after setting HUSKY_DIR:
#
#      HUSKY_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
#      . "$HUSKY_DIR/common.sh"
#
# ⚠️ Do NOT source .husky/_/husky.sh (deprecated in Husky v9+, fails in v10).
# 🌍 Safe to copy into any repo with package.json at root and the same scripts.
# =============================================================================

# 📁 HUSKY_DIR: set by the hook before sourcing, or derived from $0
# ❓ if: only compute when the caller did not already export HUSKY_DIR
if [ -z "${HUSKY_DIR:-}" ]; then
  # 📂 dirname "$0": directory of the current script path
  # 🔄 CDPATH=: avoid CDPATH surprises; cd then pwd for an absolute path
  HUSKY_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
# 🔚 fi: end of HUSKY_DIR fallback
fi

# 📁 REPO_ROOT: parent of .husky (repository root)
# 🔼 ..: walk up from .husky to the package root
REPO_ROOT="$(CDPATH= cd -- "$HUSKY_DIR/.." && pwd)"

# 🏠 cd: always run npm scripts from the repo root (any caller cwd)
cd "$REPO_ROOT" || exit 1

# 📦 PKG_NAME: dynamic package name from package.json (no hard-coded scope)
# 🟢 node -e: one-shot read of require('./package.json').name
PKG_NAME="$(
  node -e "const p=require('./package.json'); process.stdout.write(String(p.name||''))"
)"

# 📦 PKG_VERSION: dynamic semver from package.json
PKG_VERSION="$(
  node -e "const p=require('./package.json'); process.stdout.write(String(p.version||''))"
)"

# 📝 COMMITLINT_CONFIG: absolute path to Commitlint config (for docs / fallbacks)
COMMITLINT_CONFIG="$REPO_ROOT/configs/commitlint.config.js"

# -----------------------------------------------------------------------------
# 🗣️ Logging helpers
# -----------------------------------------------------------------------------

# ℹ️ log_info MESSAGE — informational line to stdout
log_info() {
  # 🖨️ printf: portable print with trailing newline
  printf '%s\n' "ℹ️  $*"
}

# ✅ log_ok MESSAGE — success line to stdout
log_ok() {
  printf '%s\n' "✅ $*"
}

# ▶️ log_go MESSAGE — action / start line to stdout
log_go() {
  printf '%s\n' "▶️  $*"
}

# ❌ log_err MESSAGE — error line to stderr
log_err() {
  #  divert: >&2 sends failures to stderr for hooks/CI
  printf '%s\n' "❌ $*" >&2
}

# ⏭️ log_skip MESSAGE — skip / no-op line to stdout
log_skip() {
  printf '%s\n' "⏭️  $*"
}

# 🏷️ log_hook_banner HOOK_NAME — standard header with package identity
log_hook_banner() {
  # 📥 $1: hook name string (pre-commit, pre-push, …)
  _hook_name="$1"
  # 🏷️ banner line with package identity
  log_go "husky ${_hook_name} — ${PKG_NAME}@${PKG_VERSION}"
  # 📂 show resolved repo root for debugging path issues
  log_info "Repo root: ${REPO_ROOT}"
}

# -----------------------------------------------------------------------------
# 🧪 CI gate (npm package.scripts only — no test:coverage / no coverage/ writes)
# -----------------------------------------------------------------------------

# 🧩 run_step LABEL npm run SCRIPT — run one package script with emoji status
# 📤 returns: the exit code of the underlying command
run_step() {
  # 🏷️ _label: human-readable step name for logs
  _label="$1"
  # 🔀 shift: drop label so remaining args are the command
  shift
  # ▶️ announce the step
  log_go "${_label}"
  # ✅ if: command succeeds
  if "$@"; then
    # ✅ success log
    log_ok "${_label}"
    # 🔙 return 0: success to caller
    return 0
  # ❌ else: command failed
  fi
  # ❌ failure log
  log_err "${_label} failed"
  # 🔙 return 1: signal failure
  return 1
}

# 🚪 run_ci_gate — typecheck → format:check → lint → layout → test:run → build
# 📌 Order matches .github/workflows/ci.yml; uses npm run for configurability.
# ⚠️ Does not run test:coverage (avoids writing coverage/ from husky).
run_ci_gate() {
  # 1️⃣ typecheck: tsc --noEmit
  run_step "typecheck" npm run typecheck || return 1
  # 2️⃣ format:check: Prettier check (no write)
  run_step "format:check" npm run format:check || return 1
  # 3️⃣ lint: ESLint (no --fix)
  run_step "lint" npm run lint || return 1
  # 4️⃣ check:layout: one principal per source file
  run_step "check:layout" npm run check:layout || return 1
  # 5️⃣ test:run: Vitest once (no watch, no coverage/)
  run_step "test:run" npm run test:run || return 1
  # 6️⃣ build: emit dist/ (same final CI step)
  run_step "build" npm run build || return 1
  # ✅ all steps green
  log_ok "CI gate passed for ${PKG_NAME}@${PKG_VERSION}"
  # 🔙 return 0
  return 0
}
