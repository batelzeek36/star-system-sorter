#!/usr/bin/env bash
set -euo pipefail

# E2E test runner for iOS
# Usage: ./scripts/e2e-ios.sh [flow-name]
# Example: ./scripts/e2e-ios.sh onboarding

FLOW="${1:-full_journey}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARTIFACTS_DIR=".artifacts/${TIMESTAMP}-ios"
SIMULATOR="iPhone 15"

echo "🚀 Starting iOS E2E test: ${FLOW}"
echo "📱 Simulator: ${SIMULATOR}"
echo "📦 Artifacts will be saved to: ${ARTIFACTS_DIR}"

# Create artifacts directory
mkdir -p "${ARTIFACTS_DIR}"

# Check if Maestro is installed
if ! command -v maestro &> /dev/null; then
    echo "❌ Maestro is not installed"
    echo "Install with: curl -Ls \"https://get.maestro.mobile.dev\" | bash"
    exit 1
fi

# Check if simulator exists
if ! xcrun simctl list devices | grep -q "${SIMULATOR}"; then
    echo "❌ Simulator '${SIMULATOR}' not found"
    echo "Available simulators:"
    xcrun simctl list devices | grep "iPhone"
    exit 1
fi

# Boot simulator if not already booted
echo "🔄 Booting simulator..."
DEVICE_ID=$(xcrun simctl list devices | grep "${SIMULATOR}" | grep -v "unavailable" | head -n 1 | grep -oE '\([A-F0-9-]+\)' | tr -d '()')
xcrun simctl boot "${DEVICE_ID}" 2>/dev/null || echo "Simulator already booted"
xcrun simctl bootstatus "${DEVICE_ID}"

# Start screen recording
echo "📹 Starting screen recording..."
xcrun simctl io "${DEVICE_ID}" recordVideo "${ARTIFACTS_DIR}/test-run.mp4" &
RECORD_PID=$!

# Give recording a moment to start
sleep 2

# Run Maestro test
echo "🎭 Running Maestro flow: ${FLOW}"
maestro test "e2e/flows/${FLOW}.yaml" \
    --format junit \
    --output "${ARTIFACTS_DIR}/results.xml" \
    || TEST_RESULT=$?

# Stop screen recording
echo "⏹️  Stopping screen recording..."
kill ${RECORD_PID} 2>/dev/null || true
sleep 1

# Collect Maestro artifacts
if [ -d ".maestro" ]; then
    echo "📸 Collecting Maestro screenshots and logs..."
    cp -R .maestro "${ARTIFACTS_DIR}/"
fi

# Collect app logs
echo "📝 Collecting app logs..."
xcrun simctl spawn "${DEVICE_ID}" log collect --output "${ARTIFACTS_DIR}/system.log" 2>/dev/null || true

# Create summary
cat > "${ARTIFACTS_DIR}/summary.txt" <<EOF
E2E Test Run Summary
====================
Flow: ${FLOW}
Platform: iOS
Simulator: ${SIMULATOR}
Timestamp: ${TIMESTAMP}
Result: ${TEST_RESULT:-0}

Artifacts:
- test-run.mp4: Screen recording
- results.xml: JUnit test results
- .maestro/: Maestro screenshots and logs
- system.log: iOS system logs

EOF

# Print results
echo ""
echo "✅ Test run complete!"
echo "📊 Results: ${TEST_RESULT:-0}"
echo "📁 Artifacts saved to: ${ARTIFACTS_DIR}"
echo ""
echo "View artifacts:"
echo "  Video: open ${ARTIFACTS_DIR}/test-run.mp4"
echo "  Results: cat ${ARTIFACTS_DIR}/results.xml"
echo "  Summary: cat ${ARTIFACTS_DIR}/summary.txt"

exit ${TEST_RESULT:-0}
