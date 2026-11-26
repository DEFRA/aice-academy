#!/usr/bin/env bash
# Builds the AICE Academy practice repo: Defra's CDP frontend template, plus the
# academy starter kit, plus the Codespaces set-up. Push the result to
# DEFRA/aice-academy-practice (marked as a template repository on GitHub).
#
# Usage:
#   ./scripts/build-practice-repo.sh <output folder> [template git ref]
#
# Run it again whenever the starter kit or the CDP template changes.

set -euo pipefail

ACADEMY="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:?Give an output folder, for example ../aice-academy-practice}"
TEMPLATE_REF="${2:-main}"
TEMPLATE_URL="https://github.com/DEFRA/cdp-node-frontend-template.git"

if [ -e "$OUTPUT" ]; then
  echo "$OUTPUT already exists. Choose a new folder." >&2
  exit 1
fi

echo "Getting the CDP frontend template ($TEMPLATE_REF)"
git clone --quiet --depth 1 --branch "$TEMPLATE_REF" "$TEMPLATE_URL" "$OUTPUT"
TEMPLATE_VERSION="$(node -e "console.log(require(process.argv[1]).version)" "$OUTPUT/package.json")"
rm -rf "$OUTPUT/.git"

# Remove the CDP Portal's template machinery and the publish workflows,
# which need CDP's AWS account. Keep check-pull-request.yml: it's the
# pipeline learners see go green in Mission 10.
rm -rf "$OUTPUT/.github/template"
rm -f "$OUTPUT/.github/workflows/template.yml" \
  "$OUTPUT/.github/workflows/validate-template.yml" \
  "$OUTPUT/.github/workflows/publish.yml" \
  "$OUTPUT/.github/workflows/publish-hotfix.yml"

echo "Adding the starter kit and Codespaces set-up"
cp -R "$ACADEMY/starter-kit/." "$OUTPUT/"
cp -R "$ACADEMY/practice/.devcontainer" "$OUTPUT/"
cp "$ACADEMY/practice/START-HERE.md" "$OUTPUT/"
# Join the practice intro and the template README with exactly one blank line
{ printf '%s\n\n' "$(cat "$ACADEMY/practice/README-PRACTICE.md")"; cat "$OUTPUT/README.md"; } > "$OUTPUT/README.tmp"
mv "$OUTPUT/README.tmp" "$OUTPUT/README.md"
chmod +x "$OUTPUT"/.claude/hooks/*.mjs "$OUTPUT/.devcontainer/post-create.sh"

(
  cd "$OUTPUT"
  git init --quiet --initial-branch main
  git add -A
  git -c user.name="AICE Academy" -c user.email="aice-academy@defra.gov.uk" \
    commit --quiet -m "Practice repo: CDP frontend template v$TEMPLATE_VERSION with the AICE Academy starter kit"
)

echo
echo "Built $OUTPUT from CDP frontend template v$TEMPLATE_VERSION."
echo "Next: push it to DEFRA/aice-academy-practice and tick 'Template repository' in its settings."
