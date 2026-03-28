#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
file="$(jq -r '.tool_input.file_path // .tool_input.path // empty' <<< "$input")"

# Rust files
case "$file" in
  *.rs)
    cd "$(git rev-parse --show-toplevel 2>/dev/null)/wasm"
    cargo clippy --fix --allow-dirty >/dev/null 2>&1 || true
    cargo fmt >/dev/null 2>&1 || true
    diag="$(cargo clippy 2>&1 | grep -E '(warning|error)\[' | head -20)"
    if [ -n "$diag" ]; then
      jq -Rn --arg msg "$diag" \
        '{ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: $msg } }'
    fi
    exit 0
    ;;
esac

# TypeScript files
case "$file" in
  *.ts|*.tsx|*.js|*.jsx)
    cd "$(git rev-parse --show-toplevel 2>/dev/null)/frontend"
    npx biome format --write "$file" >/dev/null 2>&1 || true
    npx oxlint --fix "$file" >/dev/null 2>&1 || true
    diag="$(npx oxlint "$file" 2>&1 | head -20)"
    if [ -n "$diag" ]; then
      jq -Rn --arg msg "$diag" \
        '{ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: $msg } }'
    fi
    exit 0
    ;;
esac
