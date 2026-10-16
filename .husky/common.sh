#!/usr/bin/env sh
# =============================================================================
# 🧰 .husky/common.sh — shared helpers for package-agnostic Git hooks
# =============================================================================
# 📌 Purpose: resolve the repo root, read package.json identity dynamically,
#    and provide emoji log helpers. Source from any hook in this directory:
#
#      #!/usr/bin/env sh
#      . "$(dirname "$0")/common.sh"
#
# ⚠️ Do NOT source .husky/_/husky.sh (deprecated in Husky v9+, fails in v10).
# 🌍 Safe to copy into any repo that keeps package.json at the repo root and
#    Commitlint at configs/commitlint.config.js.
# =============================================================================

# 📁 HUSKY_DIR: set by the hook before sourcing, or derived from $0
if [ -z "${HUSKY_DIR:-}" ]; then
  HUSKY_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
fi

# 📁 REPO_ROOT: parent of .husky (repository root)
REPO_ROOT="$(CDPATH= cd -- "$HUSKY_DIR/.." && pwd)"

# 🏠 Always run hook tools from the repo root (works from any caller cwd)
cd "$REPO_ROOT" || exit 1

# 📦 PKG_NAME / PKG_VERSION: dynamic from package.json (no hard-coded scope)
PKG_NAME="$(
  node -e "const p=require('./package.json'); process.stdout.write(String(p.name||''))"
)"
PKG_VERSION="$(
  node -e "const p=require('./package.json'); process.stdout.write(String(p.version||''))"
)"

# 📝 COMMITLINT_CONFIG: repo-relative Commitlint config path
COMMITLINT_CONFIG="$REPO_ROOT/configs/commitlint.config.js"

# -----------------------------------------------------------------------------
# 🗣️ Logging
# -----------------------------------------------------------------------------

# ℹ️ log_info MESSAGE — informational line
log_info() {
  printf '%s\n' "ℹ️  $*"
}

# ✅ log_ok MESSAGE — success line
log_ok() {
  printf '%s\n' "✅ $*"
}

# ▶️ log_go MESSAGE — action / start line
log_go() {
  printf '%s\n' "▶️  $*"
}

# ❌ log_err MESSAGE — error line (stderr)
log_err() {
  printf '%s\n' "❌ $*" >&2
}

# ⏭️ log_skip MESSAGE — skip / no-op line
log_skip() {
  printf '%s\n' "⏭️  $*"
}

# 🏷️ log_hook_banner HOOK_NAME — standard hook header with package identity
log_hook_banner() {
  _hook_name="$1"
  log_go "husky ${_hook_name} — ${PKG_NAME}@${PKG_VERSION}"
  log_info "Repo root: ${REPO_ROOT}"
}
