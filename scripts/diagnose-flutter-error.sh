#!/bin/bash
# Diagnose "Flutter integration not enabled" error

set +e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Diagnosing Flutter Integration Error${NC}"
echo "========================================"
echo ""

echo -e "${YELLOW}Error: 'Flutter integration not enabled'${NC}"
echo "This means the GameBridge native module is not available."
echo ""

echo "📋 Checking Configuration..."
echo "----------------------------"
echo ""

ISSUES=0

# Check if native modules exist
echo "1. Checking native module files..."
if [ -f "android/app/src/main/java/com/s3app/GameBridgeModule.kt" ]; then
  echo -e "   ${GREEN}✅${NC} Android GameBridgeModule.kt exists"
else
  echo -e "   ${RED}❌${NC} Android GameBridgeModule.kt NOT FOUND"
  ((ISSUES++))
fi

if [ -f "android/app/src/main/java/com/s3app/GameBridgePackage.kt" ]; then
  echo -e "   ${GREEN}✅${NC} Android GameBridgePackage.kt exists"
else
  echo -e "   ${RED}❌${NC} Android GameBridgePackage.kt NOT FOUND"
  ((ISSUES++))
fi

if [ -f "ios/S3App/GameBridgeModule.swift" ]; then
  echo -e "   ${GREEN}✅${NC} iOS GameBridgeModule.swift exists"
else
  echo -e "   ${RED}❌${NC} iOS GameBridgeModule.swift NOT FOUND"
  ((ISSUES++))
fi

if [ -f "ios/S3App/GameBridgeModule.m" ]; then
  echo -e "   ${GREEN}✅${NC} iOS GameBridgeModule.m exists"
else
  echo -e "   ${RED}❌${NC} iOS GameBridgeModule.m NOT FOUND"
  ((ISSUES++))
fi

echo ""
echo "2. Checking if modules are registered..."

# Check Android registration
if grep -q "GameBridgePackage" android/app/src/main/java/com/s3app/MainApplication.kt 2>/dev/null; then
  echo -e "   ${GREEN}✅${NC} Android: GameBridgePackage registered in MainApplication"
else
  echo -e "   ${RED}❌${NC} Android: GameBridgePackage NOT registered"
  ((ISSUES++))
fi

# Check iOS registration
if grep -q "GameBridge" ios/S3App/GameBridgeModule.m 2>/dev/null; then
  echo -e "   ${GREEN}✅${NC} iOS: GameBridge module defined"
else
  echo -e "   ${RED}❌${NC} iOS: GameBridge module NOT defined"
  ((ISSUES++))
fi

echo ""
echo "3. Checking Flutter integration..."

# Check if Flutter AAR is built
if [ -d "runner_game/build/host/outputs/repo/com/starsystemsorter/runner_game/flutter_debug" ]; then
  echo -e "   ${GREEN}✅${NC} Flutter AAR built"
else
  echo -e "   ${RED}❌${NC} Flutter AAR NOT built"
  echo -e "      ${YELLOW}Run: cd runner_game && flutter build aar${NC}"
  ((ISSUES++))
fi

# Check if AAR is configured in Android
if grep -q "flutter_debug:1.0" android/app/build.gradle 2>/dev/null; then
  echo -e "   ${GREEN}✅${NC} Android: Flutter AAR dependency configured"
else
  echo -e "   ${RED}❌${NC} Android: Flutter AAR dependency NOT configured"
  ((ISSUES++))
fi

# Check if Flutter pods are installed (iOS)
if grep -q "Flutter" ios/Podfile.lock 2>/dev/null; then
  echo -e "   ${GREEN}✅${NC} iOS: Flutter pods installed"
else
  echo -e "   ${YELLOW}⚠️${NC}  iOS: Flutter pods might not be installed"
  echo -e "      ${YELLOW}Run: cd ios && bundle exec pod install${NC}"
fi

echo ""
echo "📊 Diagnosis Summary"
echo "-------------------"
echo ""

if [ $ISSUES -eq 0 ]; then
  echo -e "${GREEN}✅ Configuration looks correct!${NC}"
  echo ""
  echo -e "${YELLOW}The issue is likely that the app needs to be rebuilt.${NC}"
  echo ""
  echo -e "${BLUE}Solution:${NC}"
  echo "  1. Stop the app completely"
  echo "  2. Run: ./scripts/rebuild-with-flutter.sh android"
  echo "     (or 'ios' for iOS, or 'both' for both platforms)"
  echo "  3. Start Metro: npm start"
  echo "  4. Run the app: npm run android (or npm run ios)"
  echo ""
  echo -e "${YELLOW}Why?${NC} Native modules are compiled into the app binary."
  echo "Changes to native code require a full rebuild, not just Metro refresh."
else
  echo -e "${RED}❌ Found $ISSUES configuration issues${NC}"
  echo ""
  echo -e "${BLUE}Solution:${NC}"
  echo "  1. Review the issues above"
  echo "  2. Check FLUTTER_RE_ENABLED.md for re-enabling instructions"
  echo "  3. Run: ./scripts/rebuild-with-flutter.sh"
fi

echo ""
echo -e "${BLUE}ℹ️  Additional Info:${NC}"
echo ""
echo "The error 'Flutter integration not enabled' means:"
echo "  • NativeModules.GameBridge is undefined"
echo "  • The native module wasn't compiled into the app"
echo "  • The app needs to be rebuilt with native changes"
echo ""
echo "This is NOT a JavaScript/Metro issue - it's a native build issue."
echo ""
