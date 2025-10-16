#!/usr/bin/env bash
set -euo pipefail

# E2E test runner for Android
# Usage: ./scripts/e2e-android.sh [flow-name]
# Example: ./scripts/e2e-android.sh onboarding

FLOW="${1:-full_journey}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARTIFACTS_DIR=".artifacts/${TIMESTAMP}-android"
AVD_NAME="Pixel_7_API_35"

echo "🚀 Starting Android E2E test: ${FLOW}"
echo "📱 Emulator: ${AVD_NAME}"
echo "📦 Artifacts will be saved to: ${ARTIFACTS_DIR}"

# Create artifacts directory
mkdir -p "${ARTIFACTS_DIR}"

# Check if Maestro is installed
if ! command -v maestro &> /dev/null; then
    echo "❌ Maestro is not installed"
    echo "Install with: curl -Ls \"https://get.maestro.mobile.dev\" | bash"
    exit 1
fi

# Check if emulator exists
if ! emulator -list-avds | grep -q "${AVD_NAME}"; then
    echo "❌ Emulator '${AVD_NAME}' not found"
    echo "Available emulators:"
    emulator -list-avds
    exit 1
fi

# Start emulator if not running
if ! adb devices | grep -q "emulator"; then
    echo "🔄 Starting emulator..."
    emulator -avd "${AVD_NAME}" -no-snapshot-load -no-audio -no-boot-anim &
    EMULATOR_PID=$!
    
    # Wait for device
    echo "⏳ Waiting for emulator to boot..."
    adb wait-for-device
    
    # Wait for boot to complete
    while [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do
        sleep 2
    done
    echo "✅ Emulator booted"
else
    echo "✅ Emulator already running"
fi

# Start screen recording
echo "📹 Starting screen recording..."
adb shell screenrecord /sdcard/test-run.mp4 &
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
sleep 2

# Pull screen recording
adb pull /sdcard/test-run.mp4 "${ARTIFACTS_DIR}/test-run.mp4" 2>/dev/null || true
adb shell rm /sdcard/test-run.mp4 2>/dev/null || true

# Collect Maestro artifacts
if [ -d ".maestro" ]; then
    echo "📸 Collecting Maestro screenshots and logs..."
    cp -R .maestro "${ARTIFACTS_DIR}/"
fi

# Collect app logs
echo "📝 Collecting app logs..."
adb logcat -d > "${ARTIFACTS_DIR}/logcat.txt" 2>/dev/null || true

# Create summary
cat > "${ARTIFACTS_DIR}/summary.txt" <<EOF
E2E Test Run Summary
====================
Flow: ${FLOW}
Platform: Android
Emulator: ${AVD_NAME}
Timestamp: ${TIMESTAMP}
Result: ${TEST_RESULT:-0}

Artifacts:
- test-run.mp4: Screen recording
- results.xml: JUnit test results
- .maestro/: Maestro screenshots and logs
- logcat.txt: Android logcat

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
