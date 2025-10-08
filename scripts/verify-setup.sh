#!/bin/bash

# Star System Sorter (S³) - Setup Verification Script
# This script verifies that the React Native project is properly configured

echo "🔍 Verifying React Native project setup..."
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
node_version=$(node -v)
echo "  Node.js: $node_version"

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✓ package.json found"
else
    echo "✗ package.json not found"
    exit 1
fi

# Check if tsconfig.json exists
if [ -f "tsconfig.json" ]; then
    echo "✓ tsconfig.json found"
else
    echo "✗ tsconfig.json not found"
    exit 1
fi

# Check if metro.config.js exists
if [ -f "metro.config.js" ]; then
    echo "✓ metro.config.js found"
else
    echo "✗ metro.config.js not found"
    exit 1
fi

# Check if App.tsx exists
if [ -f "App.tsx" ]; then
    echo "✓ App.tsx found"
else
    echo "✗ App.tsx not found"
    exit 1
fi

# Check if android directory exists
if [ -d "android" ]; then
    echo "✓ Android project found"
else
    echo "✗ Android project not found"
    exit 1
fi

# Check if ios directory exists
if [ -d "ios" ]; then
    echo "✓ iOS project found"
else
    echo "✗ iOS project not found"
    exit 1
fi

# Check if src directory structure exists
if [ -d "src/screens" ] && [ -d "src/components" ] && [ -d "src/scorer" ]; then
    echo "✓ Source directory structure found"
else
    echo "✗ Source directory structure incomplete"
    exit 1
fi

# Check if hdkit exists
if [ -d "hdkit" ]; then
    echo "✓ hdkit directory found"
else
    echo "✗ hdkit directory not found"
    exit 1
fi

# Check if super_dash exists
if [ -d "super_dash" ]; then
    echo "✓ super_dash directory found"
else
    echo "✗ super_dash directory not found"
    exit 1
fi

echo ""
echo "✅ All checks passed! React Native project is properly set up."
echo ""
echo "Next steps:"
echo "  1. Run 'npm install' to install dependencies"
echo "  2. For iOS: cd ios && bundle install && bundle exec pod install"
echo "  3. Run 'npm start' to start Metro bundler"
echo "  4. Run 'npm run android' or 'npm run ios' to launch the app"
