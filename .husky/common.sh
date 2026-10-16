#!/usr/bin/env sh
# =============================================================================
# 🧰 .husky/common.sh — shared helpers for package-agnostic Git hooks
# =============================================================================
# 📌 Purpose: resolve the repo root, read package.json identity dynamically,
#    and provide emoji log helpers. Gates live in `npm run check` (.devenv).
# ⚠️ Do NOT source .husky/_/husky.sh (deprecated in Husky v9+, fails in v10).
# =============================================================================

# 📁 HUSKY_DIR: set by the hook before sourcing, or derived from $0
if [ -z "${HUSKY_DIR:-}" ]; then
  HUSKY_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
fi

# 📁 REPO_ROOT: parent of .husky
REPO_ROOT="$(CDPATH= cd -- "$HUSKY_DIR/.." && pwd)"

# 🏠 Always run npm scripts from the repo root
cd "$REPO_ROOT" || exit 1

# 📦 PKG_NAME / PKG_VERSION from package.json
PKG_NAME="$(
  node -e "const p=require('./package.json'); process.stdout.write(String(p.name||''))"
)"
PKG_VERSION="$(
  node -e "const p=require('./package.json'); process.stdout.write(String(p.version||''))"
)"

# ℹ️ log_info MESSAGE
log_info() {
  printf '%s\n' "ℹ️  $*"
}

# ✅ log_ok MESSAGE
log_ok() {
  printf '%s\n' "✅ $*"
}

# ▶️ log_go MESSAGE
log_go() {
  printf '%s\n' "▶️  $*"
}

# ❌ log_err MESSAGE
log_err() {
  printf '%s\n' "❌ $*" >&2
}

# 🏷️ log_hook_banner HOOK_NAME
log_hook_banner() {
  _hook_name="$1"
  log_go "husky ${_hook_name} — ${PKG_NAME}@${PKG_VERSION}"
  log_info "Repo root: ${REPO_ROOT}"
}
