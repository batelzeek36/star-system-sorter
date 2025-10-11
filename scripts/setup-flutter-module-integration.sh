#!/bin/bash

# Setup script for Flutter module integration
# This script generates the .android and .ios directories for the Super Dash Flutter module

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FLUTTER_MODULE_PATH="$PROJECT_ROOT/super_dash"

echo "🔧 Setting up Flutter module integration..."
echo "Project root: $PROJECT_ROOT"
echo "Flutter module: $FLUTTER_MODULE_PATH"

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed or not in PATH"
    exit 1
fi

echo "✅ Flutter found: $(flutter --version | head -1)"

# Navigate to Flutter module
cd "$FLUTTER_MODULE_PATH"

# Verify this is a Flutter module
PROJECT_TYPE=$(grep "project_type:" .metadata | awk '{print $2}')
if [ "$PROJECT_TYPE" != "module" ]; then
    echo "❌ Super Dash is not configured as a Flutter module"
    echo "   Current project_type: $PROJECT_TYPE"
    exit 1
fi

echo "✅ Super Dash is configured as a Flutter module"

# Run flutter pub get to ensure dependencies are resolved
echo "📦 Running flutter pub get..."
flutter pub get

# Check if .android directory exists
if [ -d ".android" ]; then
    echo "✅ .android directory already exists"
else
    echo "⚠️  .android directory does not exist yet"
    echo "   It will be generated on first Android build"
fi

# Check if .ios directory exists
if [ -d ".ios" ]; then
    echo "✅ .ios directory already exists"
else
    echo "⚠️  .ios directory does not exist yet"
    echo "   It will be generated on first iOS build"
fi

echo ""
echo "📝 Next steps:"
echo ""
echo "For Android:"
echo "  cd $PROJECT_ROOT/android"
echo "  ./gradlew assembleDebug"
echo ""
echo "For iOS:"
echo "  cd $PROJECT_ROOT/ios"
echo "  pod install"
echo "  (then build from Xcode or use react-native run-ios)"
echo ""
echo "The .android and .ios directories will be generated automatically"
echo "during the first build of the host app."
echo ""
echo "✅ Flutter module integration setup complete!"
