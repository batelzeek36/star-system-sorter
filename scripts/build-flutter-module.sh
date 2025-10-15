#!/bin/bash

# Build Flutter module to generate plugin configurations
# This must be run before the first Android/iOS build

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FLUTTER_MODULE_PATH="$PROJECT_ROOT/runner_game"

echo "🔨 Building Flutter module..."
echo ""

cd "$FLUTTER_MODULE_PATH"

# Verify this is a Flutter module
PROJECT_TYPE=$(grep "project_type:" .metadata | awk '{print $2}')
if [ "$PROJECT_TYPE" != "module" ]; then
    echo "❌ Error: runner_game is not configured as a Flutter module"
    exit 1
fi

echo "✅ Verified Flutter module configuration"
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean

# Get dependencies
echo "📦 Getting Flutter dependencies..."
flutter pub get

# Build for Android (generates plugin registrations)
echo ""
echo "🤖 Building for Android..."
echo "This will generate plugin configurations needed by Gradle"
echo ""

# Build the module for Android - this generates the necessary files
flutter build apk --debug 2>&1 | grep -v "Warning:" || true

# The above command will fail because it's a module, but it generates the files we need
# So we'll use a different approach - build the AAR

echo ""
echo "📦 Building Android Archive (AAR)..."
flutter build aar --debug --no-tree-shake-icons

echo ""
echo "✅ Android build complete!"
echo ""

# Build for iOS (generates plugin registrations)
echo "🍎 Building for iOS..."
echo "This will generate plugin configurations needed by CocoaPods"
echo ""

flutter build ios-framework --debug --no-tree-shake-icons

echo ""
echo "✅ iOS build complete!"
echo ""

# Verify generated files
echo "🔍 Verifying generated files..."

if [ -f ".android/Flutter/build.gradle" ]; then
    echo "✅ Android Flutter build.gradle exists"
else
    echo "⚠️  Android Flutter build.gradle not found"
fi

if [ -d "build/ios/framework/Debug" ]; then
    echo "✅ iOS framework built"
else
    echo "⚠️  iOS framework not found"
fi

echo ""
echo "✅ Flutter module build complete!"
echo ""
echo "Next steps:"
echo "  1. Build Android: cd $PROJECT_ROOT/android && ./gradlew assembleDebug"
echo "  2. Build iOS: cd $PROJECT_ROOT && npx react-native run-ios"
