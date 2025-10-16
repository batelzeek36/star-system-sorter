#!/usr/bin/env bash
set -euo pipefail

# Collect and analyze E2E test artifacts
# Usage: ./scripts/collect-artifacts.sh [artifacts-dir]

ARTIFACTS_DIR="${1:-.artifacts}"

if [ ! -d "${ARTIFACTS_DIR}" ]; then
    echo "❌ Artifacts directory not found: ${ARTIFACTS_DIR}"
    exit 1
fi

echo "📊 Analyzing E2E Test Artifacts"
echo "================================"
echo ""

# Find latest test run
LATEST=$(ls -t "${ARTIFACTS_DIR}" | head -n 1)

if [ -z "${LATEST}" ]; then
    echo "❌ No test runs found in ${ARTIFACTS_DIR}"
    exit 1
fi

LATEST_DIR="${ARTIFACTS_DIR}/${LATEST}"

echo "📁 Latest test run: ${LATEST}"
echo ""

# Show summary if exists
if [ -f "${LATEST_DIR}/summary.txt" ]; then
    cat "${LATEST_DIR}/summary.txt"
    echo ""
fi

# Parse JUnit results if exists
if [ -f "${LATEST_DIR}/results.xml" ]; then
    echo "🧪 Test Results:"
    echo "----------------"
    
    # Extract test counts (basic parsing)
    TESTS=$(grep -o 'tests="[0-9]*"' "${LATEST_DIR}/results.xml" | head -n 1 | grep -o '[0-9]*' || echo "0")
    FAILURES=$(grep -o 'failures="[0-9]*"' "${LATEST_DIR}/results.xml" | head -n 1 | grep -o '[0-9]*' || echo "0")
    ERRORS=$(grep -o 'errors="[0-9]*"' "${LATEST_DIR}/results.xml" | head -n 1 | grep -o '[0-9]*' || echo "0")
    
    echo "  Total tests: ${TESTS}"
    echo "  Failures: ${FAILURES}"
    echo "  Errors: ${ERRORS}"
    
    if [ "${FAILURES}" -eq 0 ] && [ "${ERRORS}" -eq 0 ]; then
        echo "  ✅ All tests passed!"
    else
        echo "  ❌ Some tests failed"
    fi
    echo ""
fi

# List Maestro screenshots
if [ -d "${LATEST_DIR}/.maestro" ]; then
    echo "📸 Screenshots:"
    echo "---------------"
    find "${LATEST_DIR}/.maestro" -name "*.png" -o -name "*.jpg" | while read -r img; do
        echo "  - $(basename "$img")"
    done
    echo ""
fi

# Check for video
if [ -f "${LATEST_DIR}/test-run.mp4" ]; then
    echo "📹 Video recording available: ${LATEST_DIR}/test-run.mp4"
    echo ""
fi

# Show recent log errors (if logs exist)
if [ -f "${LATEST_DIR}/logcat.txt" ]; then
    echo "🔍 Recent errors in logcat:"
    echo "---------------------------"
    grep -i "error\|exception\|crash" "${LATEST_DIR}/logcat.txt" | tail -n 10 || echo "  No errors found"
    echo ""
elif [ -f "${LATEST_DIR}/system.log" ]; then
    echo "🔍 Recent errors in system log:"
    echo "-------------------------------"
    grep -i "error\|exception\|crash" "${LATEST_DIR}/system.log" | tail -n 10 || echo "  No errors found"
    echo ""
fi

echo "📂 Full artifacts location: ${LATEST_DIR}"
echo ""
echo "Commands to explore:"
echo "  View video: open ${LATEST_DIR}/test-run.mp4"
echo "  View results: cat ${LATEST_DIR}/results.xml"
echo "  View logs: less ${LATEST_DIR}/*.log ${LATEST_DIR}/*.txt"
echo "  View screenshots: open ${LATEST_DIR}/.maestro/"
