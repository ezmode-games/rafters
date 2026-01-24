#!/bin/bash
# Check status of the test mutex lock
# Usage: ./scripts/test-mutex-status.sh [--clear]

LOCK_FILE="/tmp/rafters-test-mutex.lock"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [[ "$1" == "--clear" ]]; then
  if [[ -f "$LOCK_FILE" ]]; then
    echo -e "${YELLOW}Clearing lock:${NC} $(cat "$LOCK_FILE")"
    rm -f "$LOCK_FILE"
    echo -e "${GREEN}Lock cleared${NC}"
  else
    echo -e "${GREEN}No lock to clear${NC}"
  fi
  exit 0
fi

if [[ -f "$LOCK_FILE" ]]; then
  echo -e "${RED}LOCKED${NC}"
  echo "Holder: $(cat "$LOCK_FILE")"

  if [[ "$(uname)" == "Darwin" ]]; then
    lock_age=$(( $(date +%s) - $(stat -f %m "$LOCK_FILE") ))
  else
    lock_age=$(( $(date +%s) - $(stat -c %Y "$LOCK_FILE") ))
  fi

  echo "Age: ${lock_age}s"

  if [[ $lock_age -gt 600 ]]; then
    echo -e "${YELLOW}WARNING: Lock appears stale (>10 min)${NC}"
  fi
else
  echo -e "${GREEN}UNLOCKED${NC} - ready for tests"
fi
