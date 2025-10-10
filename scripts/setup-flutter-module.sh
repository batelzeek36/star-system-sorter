#!/bin/bash

# Setup Flutter Module Integration
# This script prepares the Super Dash Flutter module for integration with React Native

set -e

echo "🚀 Setting up Flutter module integration..."

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first:"
    echo "   https://docs.flutter.dev/get-started/install"
    exit 1
fi

echo "✅ Flutter found: $(flutter --version | head -n 1)"

# Navigate to Flutter module
cd super_dash

echo "📦 Getting Flutter dependencies..."
flutter pub get

echo "🔨 Building Flutter module for Android..."
flutter build aar --release

echo "🔨 Building Flutter module for iOS..."
flutter build ios-framework --release

cd ..

echo "📱 Installing iOS pods..."
cd ios
if command -v bundle &> /dev/null; then
    bundle install
    bundle exec pod install
else
    echo "⚠️  Bundler not found. Installing pods directly..."
    pod install
fi
cd ..

echo "✅ Flutter module setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run android' to test Android integration"
echo "  2. Run 'npm run ios' to test iOS integration"
echo "  3. Verify FlutterEngine caching in logs"
echo ""
echo "See docs/FLUTTER_MODULE_INTEGRATION.md for more details."
