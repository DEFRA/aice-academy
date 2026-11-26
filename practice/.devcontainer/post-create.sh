#!/usr/bin/env bash
# Runs once, when the codespace is first created.
set -euo pipefail

echo "Setting up your practice service. This takes a few minutes the first time."

# Use the Node.js version the CDP template asks for
export NVM_DIR="${NVM_DIR:-/usr/local/share/nvm}"
# shellcheck disable=SC1091
source "$NVM_DIR/nvm.sh"
nvm install
nvm alias default "$(cat .nvmrc)"

npm ci --no-audit --no-fund
npm test --silent

git config --global init.defaultBranch main
git config --global pull.rebase false

cat <<'DONE'

  Your practice service is ready.

  1. Run:  npm run dev
     Your service opens in a "Your service" tab.
  2. Open Claude: select the Claude icon on the left, or run `claude`
     in a new terminal, and sign in when asked.
  3. Type /academy

DONE
