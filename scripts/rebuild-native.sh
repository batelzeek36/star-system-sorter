#!/bin/bash

# Rebuild Native Apps Script
# Use this after installing new native dependencies

set -e

echo "🔧 Rebuilding native apps after dependency changes..."

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from project root"
    exit 1
fi

# Function to kill Metro if running
kill_metro() {
    echo "🛑 Stopping Metro bundler..."
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
}

# Parse arguments
PLATFORM=${1:-both}

case $PLATFORM in
    ios)
        echo "📱 Rebuilding iOS..."
        kill_metro
        
        echo "  → Installing CocoaPods..."
        cd ios
        bundle exec pod install
        cd ..
        
        echo "  → Cleaning iOS build..."
        cd ios
        xcodebuild clean -workspace S3App.xcworkspace -scheme S3App 2>/dev/null || true
        cd ..
        
        echo "✅ iOS rebuild complete!"
        echo ""
        echo "Next steps:"
        echo "  1. npm start -- --reset-cache"
        echo "  2. npm run ios"
        ;;
        
    android)
        echo "🤖 Rebuilding Android..."
        kill_metro
        
        echo "  → Cleaning Android build..."
        cd android
        ./gradlew clean
        cd ..
        
        echo "✅ Android rebuild complete!"
        echo ""
        echo "Next steps:"
        echo "  1. npm start -- --reset-cache"
        echo "  2. npm run android"
        ;;
        
    both)
        echo "📱🤖 Rebuilding both platforms..."
        kill_metro
        
        # iOS
        echo ""
        echo "📱 iOS:"
        echo "  → Installing CocoaPods..."
        cd ios
        bundle exec pod install
        cd ..
        
        echo "  → Cleaning iOS build..."
        cd ios
        xcodebuild clean -workspace S3App.xcworkspace -scheme S3App 2>/dev/null || true
        cd ..
        
        # Android
        echo ""
        echo "🤖 Android:"
        echo "  → Cleaning Android build..."
        cd android
        ./gradlew clean
        cd ..
        
        echo ""
        echo "✅ Both platforms rebuilt!"
        echo ""
        echo "Next steps:"
        echo "  1. npm start -- --reset-cache"
        echo "  2. npm run ios (or npm run android)"
        ;;
        
    *)
        echo "❌ Invalid platform: $PLATFORM"
        echo "Usage: $0 [ios|android|both]"
        exit 1
        ;;
esac
