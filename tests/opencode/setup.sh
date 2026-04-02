#!/usr/bin/env bash
# Setup script for OpenCode plugin tests
# Creates an isolated test environment with the expected plugin install layout.
set -euo pipefail

# Get the repository root (two levels up from tests/opencode/)
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Create temp home directory for isolation
export TEST_HOME
TEST_HOME="$(mktemp -d)"
export HOME="$TEST_HOME"
export XDG_CONFIG_HOME="$TEST_HOME/.config"
export OPENCODE_CONFIG_DIR="$TEST_HOME/.config/opencode"

# Standard install layout:
#   $OPENCODE_CONFIG_DIR/ask-questions/               ← package root
#   $OPENCODE_CONFIG_DIR/ask-questions/skills/        ← skills dir
#   $OPENCODE_CONFIG_DIR/ask-questions/.opencode/plugins/ask-questions.js
#   $OPENCODE_CONFIG_DIR/plugins/ask-questions.js     ← symlink OpenCode reads

ASK_QUESTIONS_DIR="$OPENCODE_CONFIG_DIR/ask-questions"
ASK_QUESTIONS_SKILLS_DIR="$ASK_QUESTIONS_DIR/skills"
ASK_QUESTIONS_PLUGIN_FILE="$ASK_QUESTIONS_DIR/.opencode/plugins/ask-questions.js"
ASK_QUESTIONS_PACKAGE_FILE="$ASK_QUESTIONS_DIR/package.json"

# Install package contents needed by OpenCode
mkdir -p "$ASK_QUESTIONS_DIR"
cp -r "$REPO_ROOT/skills" "$ASK_QUESTIONS_DIR/"
mkdir -p "$(dirname "$ASK_QUESTIONS_PLUGIN_FILE")"
cp "$REPO_ROOT/.opencode/plugins/ask-questions.js" "$ASK_QUESTIONS_PLUGIN_FILE"
cp "$REPO_ROOT/package.json" "$ASK_QUESTIONS_PACKAGE_FILE"

# Register plugin via symlink (what OpenCode actually reads)
mkdir -p "$OPENCODE_CONFIG_DIR/plugins"
ln -sf "$ASK_QUESTIONS_PLUGIN_FILE" "$OPENCODE_CONFIG_DIR/plugins/ask-questions.js"

echo "Setup complete: $TEST_HOME"
echo "OPENCODE_CONFIG_DIR:   $OPENCODE_CONFIG_DIR"
echo "Ask-Questions dir:     $ASK_QUESTIONS_DIR"
echo "Skills dir:            $ASK_QUESTIONS_SKILLS_DIR"
echo "Plugin file:           $ASK_QUESTIONS_PLUGIN_FILE"
echo "Package file:          $ASK_QUESTIONS_PACKAGE_FILE"
echo "Plugin registered at:  $OPENCODE_CONFIG_DIR/plugins/ask-questions.js"

# Helper function for cleanup (call from tests or trap)
cleanup_test_env() {
    if [ -n "${TEST_HOME:-}" ] && [ -d "$TEST_HOME" ]; then
        rm -rf "$TEST_HOME"
    fi
}

# Export for use in tests
export -f cleanup_test_env
export REPO_ROOT
export ASK_QUESTIONS_DIR
export ASK_QUESTIONS_SKILLS_DIR
export ASK_QUESTIONS_PLUGIN_FILE
export ASK_QUESTIONS_PACKAGE_FILE
