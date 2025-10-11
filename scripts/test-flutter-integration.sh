#!/bin/bash

# Test script for Flutter module integration
# Verifies that the Flutter module is properly integrated with the React Native app

# Don't exit on error - we want to collect all test results
set +e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🧪 Testing Flutter Module Integration"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Test 1: Flutter SDK
section "1. Flutter SDK"
if command -v flutter &> /dev/null; then
    FLUTTER_VERSION=$(flutter --version | head -1)
    pass "Flutter SDK found: $FLUTTER_VERSION"
else
    fail "Flutter SDK not found in PATH"
fi

# Test 2: Flutter Module Configuration
section "2. Flutter Module Configuration"
cd "$PROJECT_ROOT/super_dash"

PROJECT_TYPE=$(grep "project_type:" .metadata | awk '{print $2}')
if [ "$PROJECT_TYPE" = "module" ]; then
    pass "Super Dash is configured as Flutter module"
else
    fail "Super Dash is not a Flutter module (type: $PROJECT_TYPE)"
fi

if grep -q "^module:" pubspec.yaml; then
    pass "Module configuration found in pubspec.yaml"
else
    fail "Module configuration missing in pubspec.yaml"
fi

# Test 3: Platform Directories
section "3. Platform Directories"

if [ -d ".android" ]; then
    pass ".android directory exists"
    
    if [ -f ".android/include_flutter.groovy" ]; then
        pass "include_flutter.groovy exists"
    else
        fail "include_flutter.groovy missing"
    fi
    
    if [ -f ".android/local.properties" ]; then
        FLUTTER_SDK_PATH=$(grep "flutter.sdk=" .android/local.properties | cut -d'=' -f2)
        if [ -n "$FLUTTER_SDK_PATH" ] && [ -d "$FLUTTER_SDK_PATH" ]; then
            pass "Flutter SDK path configured: $FLUTTER_SDK_PATH"
        else
            fail "Flutter SDK path invalid or missing"
        fi
    else
        fail "local.properties missing"
    fi
else
    fail ".android directory missing"
fi

if [ -d ".ios" ]; then
    pass ".ios directory exists"
    
    if [ -f ".ios/Flutter/podhelper.rb" ]; then
        pass "podhelper.rb exists"
    else
        fail "podhelper.rb missing"
    fi
    
    if [ -f ".ios/Flutter/Generated.xcconfig" ]; then
        pass "Generated.xcconfig exists"
    else
        fail "Generated.xcconfig missing"
    fi
else
    fail ".ios directory missing"
fi

# Test 4: Flutter Dependencies
section "4. Flutter Dependencies"

echo "Running flutter pub get..."
if flutter pub get > /dev/null 2>&1; then
    pass "Flutter dependencies resolved"
else
    fail "Flutter pub get failed"
fi

# Test 5: Android Configuration
section "5. Android Configuration"
cd "$PROJECT_ROOT"

if grep -q "evaluate(new File(" android/settings.gradle; then
    pass "Flutter module included in settings.gradle"
else
    fail "Flutter module not included in settings.gradle"
fi

if grep -q "implementation project(':flutter')" android/app/build.gradle; then
    pass "Flutter dependency in app/build.gradle"
else
    fail "Flutter dependency missing in app/build.gradle"
fi

if grep -q "import io.flutter.embedding.engine.FlutterEngine" android/app/src/main/java/com/s3app/MainApplication.kt; then
    pass "FlutterEngine imports in MainApplication.kt"
else
    fail "FlutterEngine imports missing in MainApplication.kt"
fi

if grep -q "FlutterEngineCache" android/app/src/main/java/com/s3app/MainApplication.kt; then
    pass "FlutterEngine caching implemented"
else
    fail "FlutterEngine caching not implemented"
fi

# Test 6: iOS Configuration
section "6. iOS Configuration"

if grep -q "flutter_application_path = '../super_dash'" ios/Podfile; then
    pass "Flutter module path in Podfile"
else
    fail "Flutter module path missing in Podfile"
fi

if grep -q "install_all_flutter_pods" ios/Podfile; then
    pass "Flutter pods installation in Podfile"
else
    fail "Flutter pods installation missing in Podfile"
fi

if grep -q "import Flutter" ios/S3App/AppDelegate.swift; then
    pass "Flutter imports in AppDelegate.swift"
else
    fail "Flutter imports missing in AppDelegate.swift"
fi

if grep -q "FlutterEngine" ios/S3App/AppDelegate.swift; then
    pass "FlutterEngine caching implemented"
else
    fail "FlutterEngine caching not implemented"
fi

# Test 7: Android Build Test (optional)
section "7. Android Build Test (Optional)"

echo "Testing Android Gradle configuration..."
cd android
if ./gradlew tasks --dry-run > /dev/null 2>&1; then
    pass "Android Gradle configuration valid"
else
    warn "Android Gradle configuration has issues (may need full build)"
fi

# Test 8: iOS Pods Test (optional)
section "8. iOS Pods Test (Optional)"

cd "$PROJECT_ROOT/ios"
if [ -f "Podfile.lock" ]; then
    if grep -q "Flutter" Podfile.lock; then
        pass "Flutter pods installed"
    else
        warn "Flutter pods not found in Podfile.lock (run 'pod install')"
    fi
else
    warn "Podfile.lock not found (run 'pod install')"
fi

# Summary
section "Test Summary"
echo ""
echo "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Build Android: cd android && ./gradlew assembleDebug"
    echo "  2. Run Android: npx react-native run-android"
    echo "  3. Run iOS: npx react-native run-ios"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo ""
    echo "Please fix the issues above before building."
    exit 1
fi
