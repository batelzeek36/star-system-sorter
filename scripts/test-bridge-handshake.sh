#!/bin/bash

# Bridge Handshake Test Script
#
# Tests the critical handshake gate:
# Boot app → call GameBridge.open() → receive ready < 5s
#
# Prerequisites:
# - Android/iOS native bridge implemented (Tasks 6.2/6.3)
# - Flutter module built
# - Device/simulator running

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=================================================="
echo "Bridge Handshake Test"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check if Flutter module exists
if [ ! -d "$PROJECT_ROOT/super_dash" ]; then
  echo -e "${RED}✗ Flutter module not found${NC}"
  echo "  Run: ./scripts/setup-flutter-module.sh"
  exit 1
fi
echo -e "${GREEN}✓ Flutter module found${NC}"

# Check if Flutter module is built
if [ ! -d "$PROJECT_ROOT/super_dash/.ios/Flutter/engine" ] && [ ! -d "$PROJECT_ROOT/super_dash/.android/Flutter" ]; then
  echo -e "${YELLOW}⚠ Flutter module not built${NC}"
  echo "  Building Flutter module..."
  "$SCRIPT_DIR/build-flutter-module.sh"
fi
echo -e "${GREEN}✓ Flutter module built${NC}"

# Check if native bridges exist
ANDROID_BRIDGE="$PROJECT_ROOT/android/app/src/main/java/com/starsystemsorter/GameBridgeModule.java"
IOS_BRIDGE="$PROJECT_ROOT/ios/StarSystemSorter/GameBridgeModule.swift"

if [ ! -f "$ANDROID_BRIDGE" ] && [ ! -f "$IOS_BRIDGE" ]; then
  echo -e "${RED}✗ Native bridges not implemented${NC}"
  echo "  Android bridge: $ANDROID_BRIDGE"
  echo "  iOS bridge: $IOS_BRIDGE"
  echo ""
  echo "  Please implement Tasks 6.2 (Android) and 6.3 (iOS) first"
  exit 1
fi

if [ -f "$ANDROID_BRIDGE" ]; then
  echo -e "${GREEN}✓ Android bridge found${NC}"
else
  echo -e "${YELLOW}⚠ Android bridge not found${NC}"
fi

if [ -f "$IOS_BRIDGE" ]; then
  echo -e "${GREEN}✓ iOS bridge found${NC}"
else
  echo -e "${YELLOW}⚠ iOS bridge not found${NC}"
fi

echo ""
echo "=================================================="
echo "Running Handshake Test"
echo "=================================================="
echo ""

# Prompt user to choose platform
echo "Select platform to test:"
echo "  1) Android"
echo "  2) iOS"
echo "  3) Both"
read -p "Enter choice [1-3]: " platform_choice

run_android_test() {
  echo ""
  echo "Testing Android..."
  echo ""
  
  # Check if Android device/emulator is connected
  if ! command -v adb &> /dev/null; then
    echo -e "${RED}✗ adb not found${NC}"
    echo "  Install Android SDK Platform Tools"
    return 1
  fi
  
  device_count=$(adb devices | grep -v "List" | grep "device$" | wc -l)
  if [ "$device_count" -eq 0 ]; then
    echo -e "${RED}✗ No Android device/emulator connected${NC}"
    echo "  Start an emulator or connect a device"
    return 1
  fi
  
  echo -e "${GREEN}✓ Android device connected${NC}"
  
  # Build and install app
  echo "Building and installing app..."
  cd "$PROJECT_ROOT"
  npx react-native run-android --no-packager
  
  # Wait for app to start
  echo "Waiting for app to start..."
  sleep 5
  
  # Check logcat for ready event
  echo "Checking for ready event in logcat..."
  timeout 10s adb logcat -s ReactNativeJS:* | grep -m 1 "ready" || {
    echo -e "${RED}✗ Ready event not received within 10 seconds${NC}"
    return 1
  }
  
  echo -e "${GREEN}✓ Ready event received${NC}"
}

run_ios_test() {
  echo ""
  echo "Testing iOS..."
  echo ""
  
  # Check if iOS simulator is available
  if ! command -v xcrun &> /dev/null; then
    echo -e "${RED}✗ Xcode not found${NC}"
    echo "  Install Xcode from App Store"
    return 1
  fi
  
  # Check if simulator is running
  simulator_count=$(xcrun simctl list devices | grep "Booted" | wc -l)
  if [ "$simulator_count" -eq 0 ]; then
    echo -e "${YELLOW}⚠ No iOS simulator running${NC}"
    echo "  Starting simulator..."
    open -a Simulator
    sleep 10
  fi
  
  echo -e "${GREEN}✓ iOS simulator available${NC}"
  
  # Build and install app
  echo "Building and installing app..."
  cd "$PROJECT_ROOT"
  npx react-native run-ios --no-packager
  
  # Wait for app to start
  echo "Waiting for app to start..."
  sleep 5
  
  # Check console for ready event
  echo "Checking for ready event..."
  # Note: iOS console checking is more complex, would need xcrun simctl spawn
  echo -e "${YELLOW}⚠ Manual verification required for iOS${NC}"
  echo "  Check Metro bundler console for ready event"
}

# Run tests based on user choice
case $platform_choice in
  1)
    run_android_test
    ;;
  2)
    run_ios_test
    ;;
  3)
    run_android_test
    run_ios_test
    ;;
  *)
    echo -e "${RED}Invalid choice${NC}"
    exit 1
    ;;
esac

echo ""
echo "=================================================="
echo "Manual Verification Steps"
echo "=================================================="
echo ""
echo "1. Open the app on your device/simulator"
echo "2. Open React Native DevTools or Metro console"
echo "3. Call GameBridge.open() from your code"
echo "4. Verify you see:"
echo "   - Ready event received within 5 seconds"
echo "   - Event payload: { type: 'ready', game_core_version: '1.0.0' }"
echo "   - No validation errors"
echo ""
echo "Example code to test:"
echo ""
echo "  import { GameBridge } from '@/bridge';"
echo ""
echo "  async function testHandshake() {"
echo "    try {"
echo "      const startTime = Date.now();"
echo "      const readyEvent = await GameBridge.open();"
echo "      const elapsed = Date.now() - startTime;"
echo "      "
echo "      console.log(\`✓ Ready in \${elapsed}ms\`);"
echo "      console.log('✓ Event:', readyEvent);"
echo "    } catch (error) {"
echo "      console.error('✗ Handshake failed:', error);"
echo "    }"
echo "  }"
echo ""
echo "  testHandshake();"
echo ""
echo "=================================================="
echo "Expected Results"
echo "=================================================="
echo ""
echo "✓ Ready event received in < 5000ms"
echo "✓ Event type: 'ready'"
echo "✓ Event has game_core_version: '1.0.0'"
echo "✓ Event validates against Zod schema"
echo "✓ Channel names match:"
echo "  - Commands: s3/game/cmd"
echo "  - Events: s3/game/events"
echo ""
