#!/usr/bin/env bash
set -euo pipefail

# Find components that might be missing testIDs
# This is a helper script to identify interactive elements

echo "🔍 Scanning for components that may need testIDs..."
echo ""

# Find Button components without testID
echo "📱 Buttons without testID:"
echo "-------------------------"
grep -rn "<Button" src/ --include="*.tsx" | grep -v "testID" | head -n 20 || echo "  ✅ All buttons have testIDs (or none found)"
echo ""

# Find TextInput components without testID
echo "⌨️  TextInputs without testID:"
echo "-----------------------------"
grep -rn "<TextInput" src/ --include="*.tsx" | grep -v "testID" | head -n 20 || echo "  ✅ All text inputs have testIDs (or none found)"
echo ""

# Find Pressable components without testID
echo "👆 Pressables without testID:"
echo "-----------------------------"
grep -rn "<Pressable" src/ --include="*.tsx" | grep -v "testID" | head -n 20 || echo "  ✅ All pressables have testIDs (or none found)"
echo ""

# Find TouchableOpacity components without testID
echo "👆 TouchableOpacity without testID:"
echo "-----------------------------------"
grep -rn "<TouchableOpacity" src/ --include="*.tsx" | grep -v "testID" | head -n 20 || echo "  ✅ All touchables have testIDs (or none found)"
echo ""

# Find View components that might be screens
echo "📺 Potential screen containers:"
echo "------------------------------"
grep -rn "Screen" src/screens/ --include="*.tsx" | grep "const\|function" | head -n 20 || echo "  No screens found"
echo ""

# Count existing testIDs
echo "📊 Statistics:"
echo "-------------"
TESTID_COUNT=$(grep -r "testID=" src/ --include="*.tsx" | wc -l | tr -d ' ')
echo "  Total testIDs found: ${TESTID_COUNT}"
echo ""

# List all unique testIDs
echo "📋 Existing testIDs:"
echo "-------------------"
grep -roh 'testID="[^"]*"' src/ --include="*.tsx" | sort -u | sed 's/testID=/  - /' || echo "  None found"
echo ""

echo "💡 Tips:"
echo "-------"
echo "  1. Add testID to all interactive elements (Button, TextInput, Pressable)"
echo "  2. Add testID to screen containers (View with screen name)"
echo "  3. Add testID to important labels and text displays"
echo "  4. Use kebab-case: btn-*, input-*, label-*, screen-*"
echo "  5. See docs/TESTID_CHECKLIST.md for full list"
