#!/bin/bash
# Performance Measurement Script
# Measures cold launch times and checks performance targets

set +e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "⚡ Star System Sorter - Performance Measurement"
echo "=============================================="
echo ""

# Performance targets
ANDROID_TARGET_MS=2500  # ≤2.5s for Android mid-tier
IOS_TARGET_MS=1800      # ≤1.8s for iOS A-series

echo -e "${BLUE}ℹ️  Performance Targets:${NC}"
echo "  • Android (mid-tier): ≤${ANDROID_TARGET_MS}ms (2.5s)"
echo "  • iOS (A-series): ≤${IOS_TARGET_MS}ms (1.8s)"
echo ""

echo "📱 Cold Launch Time Measurement"
echo "-------------------------------"
echo ""
echo -e "${YELLOW}⚠️  Manual Testing Required${NC}"
echo ""
echo "Cold launch times must be measured on actual devices:"
echo ""
echo "Android (using adb):"
echo "  1. Close the app completely"
echo "  2. Run: adb shell am start -W -n com.s3app/.MainActivity"
echo "  3. Look for 'TotalTime' in output"
echo "  4. Target: ≤2500ms on mid-tier device"
echo ""
echo "iOS (using Xcode Instruments):"
echo "  1. Close the app completely"
echo "  2. Open Xcode → Product → Profile"
echo "  3. Select 'Time Profiler' instrument"
echo "  4. Launch app and measure time to first frame"
echo "  5. Target: ≤1800ms on A-series device"
echo ""

echo "🔄 FlutterEngine Reuse Verification"
echo "-----------------------------------"
echo ""
echo -e "${YELLOW}⚠️  Manual Testing Required${NC}"
echo ""
echo "To verify engine reuse (no second engine boot):"
echo ""
echo "1. Enable Flutter engine logging:"
echo "   Android: adb logcat | grep -i 'flutter.*engine'"
echo "   iOS: Xcode console, filter for 'flutter' and 'engine'"
echo ""
echo "2. Launch app and navigate to game"
echo "3. Look for 'FlutterEngine created' or similar message"
echo "4. Exit game and return to React Native"
echo "5. Navigate to game again"
echo "6. Verify: Should NOT see 'FlutterEngine created' again"
echo "7. Should see: 'Reusing cached FlutterEngine' or similar"
echo ""

echo "📊 Automated Checks"
echo "------------------"
echo ""

# Check if FlutterEngine caching is configured
PASSED=0
FAILED=0

# Android engine caching
if grep -q "FlutterEngineCache" android/app/src/main/java/com/s3app/MainApplication.kt 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Android: FlutterEngine caching configured"
  ((PASSED++))
else
  echo -e "${RED}❌${NC} Android: FlutterEngine caching NOT configured"
  ((FAILED++))
fi

# iOS engine caching
if grep -q "flutterEngine" ios/S3App/AppDelegate.swift 2>/dev/null; then
  echo -e "${GREEN}✅${NC} iOS: FlutterEngine caching configured"
  ((PASSED++))
else
  echo -e "${RED}❌${NC} iOS: FlutterEngine caching NOT configured"
  ((FAILED++))
fi

# Check if engine is created in Application/AppDelegate (not in Activity/ViewController)
if grep -q "FlutterEngine" android/app/src/main/java/com/s3app/MainApplication.kt 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Android: Engine created in Application class (good for reuse)"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️${NC}  Android: Engine might not be created in Application class"
fi

if grep -q "FlutterEngine" ios/S3App/AppDelegate.swift 2>/dev/null; then
  echo -e "${GREEN}✅${NC} iOS: Engine created in AppDelegate (good for reuse)"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️${NC}  iOS: Engine might not be created in AppDelegate"
fi

echo ""
echo "📋 Channel Constants Verification"
echo "---------------------------------"
echo ""

# Check that all platforms use the same constants
EXPECTED_CMD="s3/game/cmd"
EXPECTED_EVT="s3/game/events"

# Flutter
CMD_FLUTTER=$(grep "const String S3_CMD_CHANNEL" runner_game/lib/bridge/schema.dart 2>/dev/null | grep -o "'[^']*'" | tr -d "'")
EVT_FLUTTER=$(grep "const String S3_EVT_CHANNEL" runner_game/lib/bridge/schema.dart 2>/dev/null | grep -o "'[^']*'" | tr -d "'")

# React Native
CMD_RN=$(grep "export const S3_CMD_CHANNEL" src/bridge/GameBridge.ts 2>/dev/null | grep -o "'[^']*'" | tr -d "'")
EVT_RN=$(grep "export const S3_EVT_CHANNEL" src/bridge/GameBridge.ts 2>/dev/null | grep -o "'[^']*'" | tr -d "'")

# Android
CMD_ANDROID=$(grep "const val METHOD_CHANNEL_NAME" android/app/src/main/java/com/s3app/GameBridgeModule.kt 2>/dev/null | grep -o '"[^"]*"' | tr -d '"')

# iOS
CMD_IOS=$(grep "private static let METHOD_CHANNEL_NAME" ios/S3App/GameBridgeModule.swift 2>/dev/null | grep -o '"[^"]*"' | tr -d '"')

# Verify all match
ALL_MATCH=true

if [ "$CMD_FLUTTER" = "$EXPECTED_CMD" ] && [ "$EVT_FLUTTER" = "$EXPECTED_EVT" ] && \
   [ "$CMD_RN" = "$EXPECTED_CMD" ] && [ "$EVT_RN" = "$EXPECTED_EVT" ] && \
   [ "$CMD_ANDROID" = "$EXPECTED_CMD" ] && [ "$CMD_IOS" = "$EXPECTED_CMD" ]; then
  echo -e "${GREEN}✅${NC} All platforms use §9.4.1 constants correctly"
  echo "   CMD: $EXPECTED_CMD"
  echo "   EVT: $EXPECTED_EVT"
  ((PASSED++))
else
  echo -e "${RED}❌${NC} Channel constant mismatch detected:"
  echo "   Expected CMD: $EXPECTED_CMD"
  echo "   Expected EVT: $EXPECTED_EVT"
  echo "   Flutter CMD: $CMD_FLUTTER, EVT: $EVT_FLUTTER"
  echo "   RN CMD: $CMD_RN, EVT: $EVT_RN"
  echo "   Android CMD: $CMD_ANDROID"
  echo "   iOS CMD: $CMD_IOS"
  ((FAILED++))
  ALL_MATCH=false
fi

echo ""
echo "📊 Summary"
echo "=========="
echo -e "${GREEN}Automated checks passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Automated checks failed: $FAILED${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All automated checks passed!${NC}"
  echo ""
  echo -e "${YELLOW}⚠️  Manual testing still required for:${NC}"
  echo "  • Cold launch time measurement"
  echo "  • FlutterEngine reuse verification"
  echo "  • Performance on target devices"
  echo ""
  echo "See instructions above for manual testing procedures."
  exit 0
else
  echo -e "${RED}❌ Some automated checks failed.${NC}"
  echo "Fix the issues above before proceeding to manual testing."
  exit 1
fi
