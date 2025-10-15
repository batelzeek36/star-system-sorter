#!/bin/bash
# Integration Verification Script
# Checks channel constants, engine reuse, and other integration requirements

# Don't exit on error - we want to see all results
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Star System Sorter - Integration Verification"
echo "================================================"
echo ""

# Track results
PASSED=0
FAILED=0
WARNINGS=0

# Function to print test result
print_result() {
  local test_name="$1"
  local result="$2"
  local message="$3"
  
  if [ "$result" = "PASS" ]; then
    echo -e "${GREEN}✅ PASS${NC}: $test_name"
    ((PASSED++))
  elif [ "$result" = "FAIL" ]; then
    echo -e "${RED}❌ FAIL${NC}: $test_name"
    echo -e "   ${RED}$message${NC}"
    ((FAILED++))
  elif [ "$result" = "WARN" ]; then
    echo -e "${YELLOW}⚠️  WARN${NC}: $test_name"
    echo -e "   ${YELLOW}$message${NC}"
    ((WARNINGS++))
  fi
}

echo "📋 Checking Channel Constants (§9.4.1)"
echo "--------------------------------------"

# Expected constants
EXPECTED_CMD="s3/game/cmd"
EXPECTED_EVT="s3/game/events"

# Check Flutter schema.dart
if [ -f "runner_game/lib/bridge/schema.dart" ]; then
  CMD_FLUTTER=$(grep "const String S3_CMD_CHANNEL" runner_game/lib/bridge/schema.dart | grep -o "'[^']*'" | tr -d "'")
  EVT_FLUTTER=$(grep "const String S3_EVT_CHANNEL" runner_game/lib/bridge/schema.dart | grep -o "'[^']*'" | tr -d "'")
  
  if [ "$CMD_FLUTTER" = "$EXPECTED_CMD" ] && [ "$EVT_FLUTTER" = "$EXPECTED_EVT" ]; then
    print_result "Flutter schema.dart constants" "PASS"
  else
    print_result "Flutter schema.dart constants" "FAIL" "Expected: $EXPECTED_CMD, $EXPECTED_EVT | Got: $CMD_FLUTTER, $EVT_FLUTTER"
  fi
else
  print_result "Flutter schema.dart exists" "FAIL" "File not found"
fi

# Check React Native GameBridge.ts
if [ -f "src/bridge/GameBridge.ts" ]; then
  CMD_RN=$(grep "export const S3_CMD_CHANNEL" src/bridge/GameBridge.ts | grep -o "'[^']*'" | tr -d "'")
  EVT_RN=$(grep "export const S3_EVT_CHANNEL" src/bridge/GameBridge.ts | grep -o "'[^']*'" | tr -d "'")
  
  if [ "$CMD_RN" = "$EXPECTED_CMD" ] && [ "$EVT_RN" = "$EXPECTED_EVT" ]; then
    print_result "React Native GameBridge.ts constants" "PASS"
  else
    print_result "React Native GameBridge.ts constants" "FAIL" "Expected: $EXPECTED_CMD, $EXPECTED_EVT | Got: $CMD_RN, $EVT_RN"
  fi
else
  print_result "React Native GameBridge.ts exists" "FAIL" "File not found"
fi

# Check Android GameBridgeModule.kt
if [ -f "android/app/src/main/java/com/s3app/GameBridgeModule.kt" ]; then
  CMD_ANDROID=$(grep "const val METHOD_CHANNEL_NAME" android/app/src/main/java/com/s3app/GameBridgeModule.kt | grep -o '"[^"]*"' | tr -d '"')
  
  if [ "$CMD_ANDROID" = "$EXPECTED_CMD" ]; then
    print_result "Android GameBridgeModule.kt CMD constant" "PASS"
  else
    print_result "Android GameBridgeModule.kt CMD constant" "FAIL" "Expected: $EXPECTED_CMD | Got: $CMD_ANDROID"
  fi
  
  # Check if using hardcoded string instead of constant
  if grep -q '"s3/game/events"' android/app/src/main/java/com/s3app/GameBridgeModule.kt; then
    print_result "Android hardcoded event channel" "WARN" "Found hardcoded 's3/game/events' string. Should use constant."
  fi
else
  print_result "Android GameBridgeModule.kt exists" "FAIL" "File not found"
fi

# Check iOS GameBridgeModule.swift
if [ -f "ios/S3App/GameBridgeModule.swift" ]; then
  CMD_IOS=$(grep "private static let METHOD_CHANNEL_NAME" ios/S3App/GameBridgeModule.swift | grep -o '"[^"]*"' | tr -d '"')
  
  if [ "$CMD_IOS" = "$EXPECTED_CMD" ]; then
    print_result "iOS GameBridgeModule.swift CMD constant" "PASS"
  else
    print_result "iOS GameBridgeModule.swift CMD constant" "FAIL" "Expected: $EXPECTED_CMD | Got: $CMD_IOS"
  fi
  
  # Check if using hardcoded string instead of constant
  if grep -q '"s3/game/events"' ios/S3App/GameBridgeModule.swift; then
    print_result "iOS hardcoded event channel" "WARN" "Found hardcoded 's3/game/events' string. Should use constant."
  fi
else
  print_result "iOS GameBridgeModule.swift exists" "FAIL" "File not found"
fi

echo ""
echo "🔧 Checking FlutterEngine Configuration"
echo "---------------------------------------"

# Check Android MainApplication.kt for engine caching
if [ -f "android/app/src/main/java/com/s3app/MainApplication.kt" ]; then
  if grep -q "FlutterEngineCache" android/app/src/main/java/com/s3app/MainApplication.kt; then
    print_result "Android FlutterEngine caching configured" "PASS"
  else
    print_result "Android FlutterEngine caching configured" "FAIL" "FlutterEngineCache not found in MainApplication.kt"
  fi
  
  if grep -q '"s3_engine"' android/app/src/main/java/com/s3app/MainApplication.kt; then
    print_result "Android engine ID matches" "PASS"
  else
    print_result "Android engine ID matches" "WARN" "Engine ID 's3_engine' not found"
  fi
else
  print_result "Android MainApplication.kt exists" "FAIL" "File not found"
fi

# Check iOS AppDelegate.swift for engine caching
if [ -f "ios/S3App/AppDelegate.swift" ]; then
  if grep -q "flutterEngine" ios/S3App/AppDelegate.swift; then
    print_result "iOS FlutterEngine caching configured" "PASS"
  else
    print_result "iOS FlutterEngine caching configured" "FAIL" "flutterEngine not found in AppDelegate.swift"
  fi
else
  print_result "iOS AppDelegate.swift exists" "FAIL" "File not found"
fi

echo ""
echo "📦 Checking Flutter AAR Build"
echo "-----------------------------"

# Check if Flutter AAR has been built
if [ -d "runner_game/build/host/outputs/repo/com/starsystemsorter/runner_game" ]; then
  print_result "Flutter AAR artifacts exist" "PASS"
  
  # Check for debug and release variants
  if [ -d "runner_game/build/host/outputs/repo/com/starsystemsorter/runner_game/flutter_debug" ]; then
    print_result "Flutter debug AAR exists" "PASS"
  else
    print_result "Flutter debug AAR exists" "FAIL" "Debug AAR not found"
  fi
  
  if [ -d "runner_game/build/host/outputs/repo/com/starsystemsorter/runner_game/flutter_release" ]; then
    print_result "Flutter release AAR exists" "PASS"
  else
    print_result "Flutter release AAR exists" "WARN" "Release AAR not found (optional for dev)"
  fi
else
  print_result "Flutter AAR artifacts exist" "FAIL" "Run: cd runner_game && flutter build aar"
fi

echo ""
echo "🔗 Checking Android AAR Integration"
echo "-----------------------------------"

# Check android/settings.gradle for AAR repository
if [ -f "android/settings.gradle" ]; then
  if grep -q "runner_game/build/host/outputs/repo" android/settings.gradle; then
    print_result "Android AAR repository configured" "PASS"
  else
    print_result "Android AAR repository configured" "FAIL" "AAR repository not found in settings.gradle"
  fi
else
  print_result "android/settings.gradle exists" "FAIL" "File not found"
fi

# Check android/app/build.gradle for AAR dependencies
if [ -f "android/app/build.gradle" ]; then
  if grep -q "flutter_debug:1.0" android/app/build.gradle; then
    print_result "Android debug AAR dependency configured" "PASS"
  else
    print_result "Android debug AAR dependency configured" "FAIL" "Debug AAR dependency not found"
  fi
  
  if grep -q "flutter_release:1.0" android/app/build.gradle; then
    print_result "Android release AAR dependency configured" "PASS"
  else
    print_result "Android release AAR dependency configured" "WARN" "Release AAR dependency not found (optional for dev)"
  fi
else
  print_result "android/app/build.gradle exists" "FAIL" "File not found"
fi

echo ""
echo "🍎 Checking iOS Flutter Integration"
echo "-----------------------------------"

# Check ios/Podfile for Flutter module
if [ -f "ios/Podfile" ]; then
  if grep -q "flutter_application_path = '../runner_game'" ios/Podfile; then
    print_result "iOS Flutter module path configured" "PASS"
  else
    print_result "iOS Flutter module path configured" "FAIL" "Flutter path not found in Podfile"
  fi
  
  if grep -q "install_all_flutter_pods" ios/Podfile; then
    print_result "iOS Flutter pods installation configured" "PASS"
  else
    print_result "iOS Flutter pods installation configured" "FAIL" "install_all_flutter_pods not found"
  fi
else
  print_result "ios/Podfile exists" "FAIL" "File not found"
fi

# Check if Flutter pods are installed
if [ -f "ios/Podfile.lock" ]; then
  if grep -q "Flutter" ios/Podfile.lock; then
    print_result "iOS Flutter pods installed" "PASS"
  else
    print_result "iOS Flutter pods installed" "FAIL" "Run: cd ios && bundle exec pod install"
  fi
else
  print_result "ios/Podfile.lock exists" "WARN" "Run: cd ios && bundle exec pod install"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All critical checks passed!${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some warnings detected. Review above for details.${NC}"
  fi
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Review above for details.${NC}"
  exit 1
fi
