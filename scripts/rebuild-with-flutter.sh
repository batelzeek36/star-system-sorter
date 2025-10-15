#!/bin/bash
# Rebuild app with Flutter integration
# This script rebuilds the native apps to include the GameBridge native modules

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔨 Rebuilding Star System Sorter with Flutter Integration${NC}"
echo "=========================================================="
echo ""

# Check which platform to build
PLATFORM="${1:-both}"

if [ "$PLATFORM" != "android" ] && [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "both" ]; then
  echo -e "${RED}❌ Invalid platform: $PLATFORM${NC}"
  echo "Usage: $0 [android|ios|both]"
  exit 1
fi

echo -e "${YELLOW}📋 This script will:${NC}"
echo "  1. Clean Metro bundler cache"
echo "  2. Clean native build artifacts"
echo "  3. Rebuild Flutter AAR (Android)"
echo "  4. Reinstall iOS pods (iOS)"
echo "  5. Rebuild and launch the app"
echo ""

# Function to clean Metro cache
clean_metro() {
  echo -e "${BLUE}🧹 Cleaning Metro bundler cache...${NC}"
  rm -rf node_modules/.cache
  rm -rf $TMPDIR/metro-*
  rm -rf $TMPDIR/haste-*
  echo -e "${GREEN}✅ Metro cache cleaned${NC}"
  echo ""
}

# Function to rebuild Android
rebuild_android() {
  echo -e "${BLUE}🤖 Rebuilding Android...${NC}"
  echo ""
  
  # Clean Android build
  echo "  Cleaning Android build artifacts..."
  cd android
  ./gradlew clean
  cd ..
  echo -e "${GREEN}  ✅ Android cleaned${NC}"
  echo ""
  
  # Rebuild Flutter AAR
  echo "  Building Flutter AAR..."
  cd runner_game
  flutter clean
  flutter pub get
  flutter build aar
  cd ..
  echo -e "${GREEN}  ✅ Flutter AAR built${NC}"
  echo ""
  
  # Build Android app
  echo "  Building Android app..."
  cd android
  ./gradlew assembleDebug
  cd ..
  echo -e "${GREEN}  ✅ Android app built${NC}"
  echo ""
  
  echo -e "${GREEN}✅ Android rebuild complete!${NC}"
  echo ""
  echo -e "${YELLOW}To run: npm run android${NC}"
  echo ""
}

# Function to rebuild iOS
rebuild_ios() {
  echo -e "${BLUE}🍎 Rebuilding iOS...${NC}"
  echo ""
  
  # Clean iOS build
  echo "  Cleaning iOS build artifacts..."
  rm -rf ios/build
  rm -rf ios/Pods
  rm -rf ios/Podfile.lock
  echo -e "${GREEN}  ✅ iOS cleaned${NC}"
  echo ""
  
  # Ensure Flutter module is built
  echo "  Ensuring Flutter module is ready..."
  cd runner_game
  flutter clean
  flutter pub get
  cd ..
  echo -e "${GREEN}  ✅ Flutter module ready${NC}"
  echo ""
  
  # Install pods
  echo "  Installing iOS pods..."
  cd ios
  bundle exec pod install
  cd ..
  echo -e "${GREEN}  ✅ iOS pods installed${NC}"
  echo ""
  
  echo -e "${GREEN}✅ iOS rebuild complete!${NC}"
  echo ""
  echo -e "${YELLOW}To run: npm run ios${NC}"
  echo ""
}

# Main execution
clean_metro

if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  rebuild_android
fi

if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  rebuild_ios
fi

echo -e "${GREEN}🎉 Rebuild complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Start Metro: npm start"
echo "  2. Run app:"
if [ "$PLATFORM" = "android" ]; then
  echo "     npm run android"
elif [ "$PLATFORM" = "ios" ]; then
  echo "     npm run ios"
else
  echo "     npm run android  (or npm run ios)"
fi
echo "  3. Navigate to the game and check for ready events"
echo ""
echo -e "${YELLOW}⚠️  If you still see 'Flutter integration not enabled':${NC}"
echo "  • Make sure Metro is restarted (npm start)"
echo "  • Try: npm start -- --reset-cache"
echo "  • Check Metro logs for errors"
echo ""
