#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$repo_root"

echo "[1/4] Checking required files are non-empty"
required=(
  "README.md"
  "CONTRIBUTING.md"
  "LICENSE"
  "AGENTS.md"
  "VERSIONS.md"
  "tools/REGISTRY.md"
)

for file in "${required[@]}"; do
  if [[ ! -s "$file" ]]; then
    echo "Missing or empty required file: $file" >&2
    exit 1
  fi
done

echo "[2/4] Syntax-checking CLI scripts"
for file in tools/clis/*.js; do
  node --check "$file"
done

echo "[3/4] Running unit/smoke tests"
npm test

echo "[4/4] Registry linkage check"
node .github/scripts/sync-skills.js --check

echo "Validation passed"
