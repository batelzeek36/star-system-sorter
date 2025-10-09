#!/bin/bash

# Verify Core Dependencies Installation
# This script checks that all required dependencies are properly installed

echo "🔍 Verifying core dependencies..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "❌ node_modules not found. Run 'npm install' first."
  exit 1
fi

# Required dependencies
REQUIRED_DEPS=(
  "zod"
  "@hookform/resolvers"
  "react-hook-form"
  "zustand"
  "@react-navigation/native"
  "@react-navigation/native-stack"
  "react-native-svg"
  "pako"
  "react-native-document-picker"
  "react-native-gesture-handler"
  "react-native-screens"
)

MISSING_DEPS=()

for dep in "${REQUIRED_DEPS[@]}"; do
  if [ ! -d "node_modules/$dep" ]; then
    MISSING_DEPS+=("$dep")
  fi
done

if [ ${#MISSING_DEPS[@]} -eq 0 ]; then
  echo "✅ All required dependencies are installed"
else
  echo "❌ Missing dependencies:"
  for dep in "${MISSING_DEPS[@]}"; do
    echo "   - $dep"
  done
  exit 1
fi

# Check configuration files
echo ""
echo "🔍 Verifying configuration files..."

CONFIG_FILES=(
  "src/lib/validation.ts"
  "src/state/store.ts"
  "docs/DEPENDENCIES.md"
)

MISSING_FILES=()

for file in "${CONFIG_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
  echo "✅ All configuration files exist"
else
  echo "❌ Missing configuration files:"
  for file in "${MISSING_FILES[@]}"; do
    echo "   - $file"
  done
  exit 1
fi

# Check gesture handler import in index.js
echo ""
echo "🔍 Verifying gesture handler configuration..."

if grep -q "react-native-gesture-handler" index.js; then
  echo "✅ Gesture handler import found in index.js"
else
  echo "❌ Gesture handler import missing in index.js"
  exit 1
fi

# Check MainActivity configuration
echo ""
echo "🔍 Verifying Android MainActivity configuration..."

if grep -q "onCreate" android/app/src/main/java/com/s3app/MainActivity.kt; then
  echo "✅ MainActivity configured for gesture handler"
else
  echo "❌ MainActivity missing onCreate override"
  exit 1
fi

# Run typecheck
echo ""
echo "🔍 Running TypeScript type check..."

npm run typecheck > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ TypeScript type check passed"
else
  echo "❌ TypeScript type check failed"
  exit 1
fi

echo ""
echo "✨ All verifications passed! Dependencies are properly configured."
echo ""
echo "Next steps:"
echo "  1. Run 'npm run android' to test on Android"
echo "  2. Run 'npm run ios' to test on iOS"
echo "  3. See docs/DEPENDENCIES.md for usage examples"
