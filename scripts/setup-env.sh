#!/bin/bash

# Star System Sorter (S³) - Environment Setup Script
# This script helps configure environment variables for Android and iOS development

echo "🔧 Setting up development environment variables..."
echo ""

# Detect shell
SHELL_CONFIG=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
    echo "✓ Detected zsh shell"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
    echo "✓ Detected bash shell"
else
    echo "⚠️  Could not detect shell config file"
    echo "   Please manually add environment variables to your shell config"
    exit 1
fi

echo ""
echo "📝 Checking current environment..."
echo ""

# Check Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "✓ Java installed: $JAVA_VERSION"
    
    # Check if JAVA_HOME is set
    if [ -z "$JAVA_HOME" ]; then
        echo "⚠️  JAVA_HOME not set"
        echo ""
        echo "Add this to $SHELL_CONFIG:"
        echo "export JAVA_HOME=\$(/usr/libexec/java_home -v 17)"
        echo "export PATH=\"\$JAVA_HOME/bin:\$PATH\""
    else
        echo "✓ JAVA_HOME: $JAVA_HOME"
    fi
else
    echo "❌ Java not installed"
    echo "   Run: brew install openjdk@17"
fi

echo ""

# Check Android SDK
if [ -d "$HOME/Library/Android/sdk" ]; then
    echo "✓ Android SDK found at: $HOME/Library/Android/sdk"
    
    # Check if ANDROID_HOME is set
    if [ -z "$ANDROID_HOME" ]; then
        echo "⚠️  ANDROID_HOME not set"
        echo ""
        echo "Add this to $SHELL_CONFIG:"
        echo "export ANDROID_HOME=\$HOME/Library/Android/sdk"
        echo "export PATH=\$PATH:\$ANDROID_HOME/emulator"
        echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools"
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools/bin"
    else
        echo "✓ ANDROID_HOME: $ANDROID_HOME"
    fi
    
    # Check adb
    if command -v adb &> /dev/null; then
        ADB_VERSION=$(adb --version | head -n 1)
        echo "✓ adb available: $ADB_VERSION"
    else
        echo "⚠️  adb not in PATH"
    fi
else
    echo "❌ Android SDK not found"
    echo "   Install Android Studio first"
fi

echo ""

# Check Xcode
if command -v xcodebuild &> /dev/null; then
    XCODE_VERSION=$(xcodebuild -version 2>&1 | head -n 1)
    if [[ $XCODE_VERSION == *"error"* ]]; then
        echo "⚠️  Xcode Command Line Tools only (full Xcode needed)"
        echo "   Install Xcode from App Store"
    else
        echo "✓ Xcode installed: $XCODE_VERSION"
    fi
else
    echo "❌ Xcode not installed"
    echo "   Install from Mac App Store"
fi

echo ""

# Check CocoaPods
if command -v pod &> /dev/null; then
    POD_VERSION=$(pod --version)
    echo "✓ CocoaPods installed: $POD_VERSION"
else
    echo "❌ CocoaPods not installed"
    echo "   Run: brew install cocoapods"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo "📊 Environment Status Summary:"
echo ""

READY_COUNT=0
TOTAL_COUNT=4

if command -v java &> /dev/null && [ -n "$JAVA_HOME" ]; then
    echo "✅ Java & JAVA_HOME"
    ((READY_COUNT++))
else
    echo "❌ Java & JAVA_HOME"
fi

if [ -d "$HOME/Library/Android/sdk" ] && [ -n "$ANDROID_HOME" ] && command -v adb &> /dev/null; then
    echo "✅ Android SDK & Environment"
    ((READY_COUNT++))
else
    echo "❌ Android SDK & Environment"
fi

if command -v xcodebuild &> /dev/null; then
    XCODE_CHECK=$(xcodebuild -version 2>&1 | head -n 1)
    if [[ $XCODE_CHECK != *"error"* ]]; then
        echo "✅ Xcode"
        ((READY_COUNT++))
    else
        echo "❌ Xcode (only Command Line Tools)"
    fi
else
    echo "❌ Xcode"
fi

if command -v pod &> /dev/null; then
    echo "✅ CocoaPods"
    ((READY_COUNT++))
else
    echo "❌ CocoaPods"
fi

echo ""
echo "Ready: $READY_COUNT / $TOTAL_COUNT"
echo ""

if [ $READY_COUNT -eq $TOTAL_COUNT ]; then
    echo "🎉 All development tools are ready!"
    echo ""
    echo "You can now run:"
    echo "  npm run ios      # Run on iOS Simulator"
    echo "  npm run android  # Run on Android Emulator"
else
    echo "⚠️  Some tools need to be installed or configured"
    echo ""
    echo "See INSTALLATION_STATUS.md for detailed instructions"
fi

echo ""
