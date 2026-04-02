#!/usr/bin/env bash
# Test: Plugin Loading
# Verifies that the ask-questions plugin can be installed in the expected layout.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Test: Plugin Loading ==="

# Source setup to create isolated environment
source "$SCRIPT_DIR/setup.sh"

# Trap to cleanup on exit
trap cleanup_test_env EXIT

plugin_link="$OPENCODE_CONFIG_DIR/plugins/ask-questions.js"

echo "Test 1: Checking plugin registration..."
if [ -L "$plugin_link" ]; then
    echo "  [PASS] Plugin symlink exists"
else
    echo "  [FAIL] Plugin symlink not found at $plugin_link"
    exit 1
fi

if [ -f "$(readlink -f "$plugin_link")" ]; then
    echo "  [PASS] Plugin symlink target exists"
else
    echo "  [FAIL] Plugin symlink target does not exist"
    exit 1
fi

echo "Test 2: Checking skills directory..."
skill_count="$(find "$ASK_QUESTIONS_SKILLS_DIR" -name "SKILL.md" | wc -l)"
if [ "$skill_count" -gt 0 ]; then
    echo "  [PASS] Found $skill_count skill(s)"
else
    echo "  [FAIL] No skills found in $ASK_QUESTIONS_SKILLS_DIR"
    exit 1
fi

echo "Test 3: Checking ask-questions skill exists..."
if [ -f "$ASK_QUESTIONS_SKILLS_DIR/ask-questions/SKILL.md" ]; then
    echo "  [PASS] ask-questions skill exists"
else
    echo "  [FAIL] ask-questions skill not found"
    exit 1
fi

echo "Test 4: Checking package entry point..."
if grep -q '"main": ".opencode/plugins/ask-questions.js"' "$ASK_QUESTIONS_PACKAGE_FILE"; then
    echo "  [PASS] package.json declares the plugin entry point"
else
    echo "  [FAIL] package.json is missing the expected main entry"
    exit 1
fi

echo "Test 5: Checking plugin JavaScript syntax..."
if node --check "$ASK_QUESTIONS_PLUGIN_FILE" 2>/dev/null; then
    echo "  [PASS] Plugin JavaScript syntax is valid"
else
    echo "  [FAIL] Plugin has JavaScript syntax errors"
    exit 1
fi

echo ""
echo "=== All plugin loading tests passed ==="
