#!/bin/bash
# File-based mutex for coordinating test runs across multiple agents
# Usage: ./scripts/test-mutex.sh <command>
# Example: ./scripts/test-mutex.sh "pnpm --filter=@rafters/ui test:unit use-clipboard"

set -e

LOCK_FILE="/tmp/rafters-test-mutex.lock"
LOCK_TIMEOUT=300  # 5 minutes max wait
LOCK_STALE=600    # 10 minutes = stale lock (crashed agent)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
  echo -e "${GREEN}[test-mutex]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[test-mutex]${NC} $1"
}

error() {
  echo -e "${RED}[test-mutex]${NC} $1"
}

# Check if lock is stale (older than LOCK_STALE seconds)
is_lock_stale() {
  if [[ ! -f "$LOCK_FILE" ]]; then
    return 1
  fi

  local lock_age
  if [[ "$(uname)" == "Darwin" ]]; then
    lock_age=$(( $(date +%s) - $(stat -f %m "$LOCK_FILE") ))
  else
    lock_age=$(( $(date +%s) - $(stat -c %Y "$LOCK_FILE") ))
  fi

  if [[ $lock_age -gt $LOCK_STALE ]]; then
    return 0
  fi
  return 1
}

# Acquire the lock
acquire_lock() {
  local waited=0
  local interval=5

  while true; do
    # Check for stale lock
    if is_lock_stale; then
      warn "Stale lock detected ($(cat "$LOCK_FILE" 2>/dev/null || echo 'unknown')), removing..."
      rm -f "$LOCK_FILE"
    fi

    # Try to create lock atomically
    if (set -o noclobber; echo "$$:$(date +%s):$1" > "$LOCK_FILE") 2>/dev/null; then
      log "Lock acquired for: $1"
      return 0
    fi

    # Lock exists, wait
    local holder
    holder=$(cat "$LOCK_FILE" 2>/dev/null || echo "unknown")

    if [[ $waited -ge $LOCK_TIMEOUT ]]; then
      error "Timeout waiting for lock (held by: $holder)"
      return 1
    fi

    warn "Waiting for lock (held by: $holder)... ${waited}s/${LOCK_TIMEOUT}s"
    sleep $interval
    waited=$((waited + interval))
  done
}

# Release the lock
release_lock() {
  if [[ -f "$LOCK_FILE" ]]; then
    rm -f "$LOCK_FILE"
    log "Lock released"
  fi
}

# Cleanup on exit (success or failure)
cleanup() {
  release_lock
}

# Main
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <command>"
  echo "Example: $0 \"pnpm --filter=@rafters/ui test:unit use-clipboard\""
  exit 1
fi

COMMAND="$*"

# Set up cleanup trap
trap cleanup EXIT

# Acquire lock
if ! acquire_lock "$COMMAND"; then
  error "Failed to acquire lock"
  exit 1
fi

# Run the command
log "Running: $COMMAND"
echo "----------------------------------------"

eval "$COMMAND"
EXIT_CODE=$?

echo "----------------------------------------"
if [[ $EXIT_CODE -eq 0 ]]; then
  log "Command completed successfully"
else
  error "Command failed with exit code: $EXIT_CODE"
fi

exit $EXIT_CODE
