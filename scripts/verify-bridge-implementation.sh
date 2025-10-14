#!/bin/bash

# Bridge Implementation Verification Script
#
# Verifies that the Android native bridge is properly implemented
# without requiring the app to run.
#
# This checks:
# - File existence
# - Channel name consistency
# - Flutter integration enabled
# - Code structure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=================================================="
echo "Bridge Implementation Verification"
echo "=================================================="
echo ""

ERRORS=0
WARNINGS=0

# Helper functions
check_file() {
  local file=$1
  local description=$2
  
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $description"
    return 0
  else
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}Missing: $file${NC}"
    ((ERRORS++))
    return 1
  fi
}

check_string_in_file() {
  local file=$1
  local search=$2
  local description=$3
  
  if [ ! -f "$file" ]; then
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}File not found: $file${NC}"
    ((ERRORS++))
    return 1
  fi
  
  if grep -q "$search" "$file"; then
    echo -e "${GREEN}✓${NC} $description"
    return 0
  else
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}Not found in: $file${NC}"
    ((ERRORS++))
    return 1
  fi
}

check_not_commented() {
  local file=$1
  local search=$2
  local description=$3
  
  if [ ! -f "$file" ]; then
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}File not found: $file${NC}"
    ((ERRORS++))
    return 1
  fi
  
  # Check if the line exists and is NOT commented
  if grep -v "^[[:space:]]*#" "$file" | grep -v "^[[:space:]]*//" | grep -q "$search"; then
    echo -e "${GREEN}✓${NC} $description"
    return 0
  else
    echo -e "${YELLOW}⚠${NC} $description"
    echo -e "  ${YELLOW}May be commented in: $file${NC}"
    ((WARNINGS++))
    return 1
  fi
}

echo -e "${BLUE}Checking Android Native Bridge...${NC}"
echo ""

# Check Android files
check_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgeModule.kt" \
  "GameBridgeModule.kt exists"

check_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgePackage.kt" \
  "GameBridgePackage.kt exists"

check_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/MainApplication.kt" \
  "MainApplication.kt exists"

echo ""
echo -e "${BLUE}Checking Flutter Integration (Android)...${NC}"
echo ""

# Check Flutter integration is enabled
check_not_commented "$PROJECT_ROOT/android/settings.gradle" \
  "setBinding(new Binding" \
  "Flutter module included in settings.gradle"

check_not_commented "$PROJECT_ROOT/android/app/build.gradle" \
  "implementation project(':flutter')" \
  "Flutter dependency in build.gradle"

check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/MainApplication.kt" \
  "import io.flutter.embedding.engine.FlutterEngine" \
  "FlutterEngine imported in MainApplication"

check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/MainApplication.kt" \
  "FlutterEngineCache" \
  "FlutterEngineCache used in MainApplication"

check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/MainApplication.kt" \
  "GameBridgePackage()" \
  "GameBridgePackage registered in MainApplication"

echo ""
echo -e "${BLUE}Checking Channel Names...${NC}"
echo ""

# Check channel names match
EXPECTED_CMD_CHANNEL="s3/game/cmd"
EXPECTED_EVENT_CHANNEL="s3/game/events"

# Android
check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgeModule.kt" \
  "$EXPECTED_CMD_CHANNEL" \
  "Command channel name in Android: $EXPECTED_CMD_CHANNEL"

# Flutter
check_string_in_file "$PROJECT_ROOT/super_dash/lib/bridge/method_channel_bridge.dart" \
  "$EXPECTED_CMD_CHANNEL" \
  "Command channel name in Flutter: $EXPECTED_CMD_CHANNEL"

# React Native
check_string_in_file "$PROJECT_ROOT/src/bridge/GameBridge.ts" \
  "$EXPECTED_EVENT_CHANNEL" \
  "Event channel name in React Native: $EXPECTED_EVENT_CHANNEL"

echo ""
echo -e "${BLUE}Checking Module Structure...${NC}"
echo ""

# Check key methods exist
check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgeModule.kt" \
  "fun open(" \
  "open() method exists"

check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgeModule.kt" \
  "fun sendCommand(" \
  "sendCommand() method exists"

check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgeModule.kt" \
  "@ReactMethod" \
  "ReactMethod annotations present"

check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgeModule.kt" \
  "FlutterActivity" \
  "FlutterActivity used for launching"

check_string_in_file "$PROJECT_ROOT/android/app/src/main/java/com/s3app/GameBridgeModule.kt" \
  "s3_engine" \
  "Correct engine ID used"

echo ""
echo -e "${BLUE}Checking Flutter Bridge...${NC}"
echo ""

check_file "$PROJECT_ROOT/super_dash/lib/bridge/method_channel_bridge.dart" \
  "method_channel_bridge.dart exists"

check_string_in_file "$PROJECT_ROOT/super_dash/lib/bridge/method_channel_bridge.dart" \
  "sendEvent" \
  "sendEvent method exists in Flutter bridge"

check_string_in_file "$PROJECT_ROOT/super_dash/lib/bridge/method_channel_bridge.dart" \
  "MethodChannel" \
  "MethodChannel used in Flutter bridge"

echo ""
echo -e "${BLUE}Checking React Native Bridge...${NC}"
echo ""

check_file "$PROJECT_ROOT/src/bridge/GameBridge.ts" \
  "GameBridge.ts exists"

check_file "$PROJECT_ROOT/src/bridge/types.ts" \
  "types.ts exists"

check_string_in_file "$PROJECT_ROOT/src/bridge/GameBridge.ts" \
  "NativeModules.GameBridge" \
  "NativeModules.GameBridge imported"

check_string_in_file "$PROJECT_ROOT/src/bridge/GameBridge.ts" \
  "async open()" \
  "open() method exists"

check_string_in_file "$PROJECT_ROOT/src/bridge/GameBridge.ts" \
  "async sendCommand(" \
  "sendCommand() method exists"

echo ""
echo "=================================================="
echo "Summary"
echo "=================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed!${NC}"
  echo ""
  echo "The Android native bridge is properly implemented."
  echo ""
  echo "Next steps:"
  echo "  1. Build the Flutter module: ./scripts/build-flutter-module.sh"
  echo "  2. Build the Android app: cd android && ./gradlew assembleDebug"
  echo "  3. Run the app: npm run android"
  echo "  4. Test the handshake: npm test -- bridge-handshake.test.ts"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
  echo ""
  echo "The implementation looks mostly correct, but there are some warnings."
  echo "Review the warnings above and fix if necessary."
  echo ""
  exit 0
else
  echo -e "${RED}✗ $ERRORS error(s), $WARNINGS warning(s)${NC}"
  echo ""
  echo "The implementation has errors that need to be fixed."
  echo "Review the errors above and fix them before proceeding."
  echo ""
  exit 1
fi
