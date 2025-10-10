#!/bin/bash

# Verify Flutter Module Integration
# This script checks that all configuration is in place

set -e

echo "🔍 Verifying Flutter module integration..."
echo ""

ERRORS=0

# Check Flutter SDK
echo "1. Checking Flutter SDK..."
if command -v flutter &> /dev/null; then
    FLUTTER_VERSION=$(flutter --version | head -n 1)
    echo "   ✅ Flutter found: $FLUTTER_VERSION"
else
    echo "   ❌ Flutter not found. Install from https://docs.flutter.dev/get-started/install"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Flutter module configuration
echo "2. Checking Flutter module configuration..."
if grep -q "^module:" super_dash/pubspec.yaml; then
    echo "   ✅ Module configuration found in pubspec.yaml"
    
    if grep -q "androidPackage: com.s3app.super_dash" super_dash/pubspec.yaml; then
        echo "   ✅ Android package configured"
    else
        echo "   ❌ Android package not configured"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "iosBundleIdentifier: com.s3app.superDash" super_dash/pubspec.yaml; then
        echo "   ✅ iOS bundle identifier configured"
    else
        echo "   ❌ iOS bundle identifier not configured"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ❌ Module configuration not found in pubspec.yaml"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Android configuration
echo "3. Checking Android configuration..."
if grep -q "include_flutter.groovy" android/settings.gradle; then
    echo "   ✅ Flutter module included in settings.gradle"
else
    echo "   ❌ Flutter module not included in settings.gradle"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "implementation project(':flutter')" android/app/build.gradle; then
    echo "   ✅ Flutter dependency in build.gradle"
else
    echo "   ❌ Flutter dependency not in build.gradle"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "FlutterEngine" android/app/src/main/java/com/s3app/MainApplication.kt; then
    echo "   ✅ FlutterEngine caching in MainApplication.kt"
    
    if grep -q "s3_engine" android/app/src/main/java/com/s3app/MainApplication.kt; then
        echo "   ✅ Cache ID 's3_engine' configured"
    else
        echo "   ❌ Cache ID 's3_engine' not found"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ❌ FlutterEngine caching not in MainApplication.kt"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check iOS configuration
echo "4. Checking iOS configuration..."
if grep -q "install_all_flutter_pods" ios/Podfile; then
    echo "   ✅ Flutter pods configured in Podfile"
else
    echo "   ❌ Flutter pods not configured in Podfile"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "flutterEngine" ios/S3App/AppDelegate.swift; then
    echo "   ✅ FlutterEngine caching in AppDelegate.swift"
    
    if grep -q "s3_engine" ios/S3App/AppDelegate.swift; then
        echo "   ✅ Cache ID 's3_engine' configured"
    else
        echo "   ❌ Cache ID 's3_engine' not found"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ❌ FlutterEngine caching not in AppDelegate.swift"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check Flutter platform files
echo "5. Checking Flutter platform files..."
if [ -d "super_dash/.android" ]; then
    echo "   ✅ Android platform files generated"
else
    echo "   ⚠️  Android platform files not generated (run setup script)"
fi

if [ -d "super_dash/.ios" ]; then
    echo "   ✅ iOS platform files generated"
else
    echo "   ⚠️  iOS platform files not generated (run setup script)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed!"
    echo ""
    echo "Next steps:"
    echo "  1. Run './scripts/setup-flutter-module.sh' to build Flutter module"
    echo "  2. Run 'npm run android' or 'npm run ios' to test"
    echo "  3. Check logs for FlutterEngine initialization"
    echo ""
    echo "See docs/FLUTTER_ENGINE_CACHE_TESTING.md for testing guide"
    exit 0
else
    echo "❌ $ERRORS error(s) found!"
    echo ""
    echo "Please fix the errors above and run this script again."
    exit 1
fi
