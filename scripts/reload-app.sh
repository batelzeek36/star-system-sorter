#!/bin/bash

# Reload React Native app on iOS and/or Android simulators
# Opens Metro in current terminal, iOS and Android in separate terminals
# Usage: 
#   ./scripts/reload-app.sh ios
#   ./scripts/reload-app.sh android
#   ./scripts/reload-app.sh both
#   ./scripts/reload-app.sh both --clean
#   npm start --prefix ./apps/server          -- for API

set -e

PLATFORM=${1:-both}
CLEAN_BUILD=${2:-}
PROJECT_DIR=$(pwd)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Metro is running
check_metro() {
    if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Kill Metro if running
kill_metro() {
    if check_metro; then
        print_step "Stopping Metro bundler..."
        lsof -ti:8081 | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "Metro stopped"
    fi
}

# Open new Terminal window on macOS
open_terminal() {
    local title=$1
    local command=$2
    
    osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_DIR' && echo '${title}' && ${command}"
    activate
end tell
EOF
}

# Clean build for iOS
clean_ios() {
    print_step "Cleaning iOS build..."
    cd ios
    rm -rf Pods Podfile.lock
    bundle exec pod install
    cd ..
    print_success "iOS cleaned"
}

# Clean build for Android
clean_android() {
    print_step "Cleaning Android build..."
    cd android
    ./gradlew clean
    cd ..
    print_success "Android cleaned"
}

# Run iOS in new terminal
run_ios() {
    print_step "Opening iOS build in new terminal..."
    open_terminal "🍎 iOS Build" "npm run ios"
    print_success "iOS terminal opened"
}

# Run Android in new terminal
run_android() {
    print_step "Opening Android build in new terminal..."
    open_terminal "🤖 Android Build" "npm run android"
    print_success "Android terminal opened"
}

# Main script
main() {
    echo ""
    print_step "React Native App Reload Script"
    print_warning "Metro will run in THIS terminal"
    print_warning "iOS/Android will open in SEPARATE terminals"
    echo ""
    
    # Kill Metro
    kill_metro
    
    # Clean builds if requested
    if [ "$CLEAN_BUILD" = "--clean" ]; then
        print_warning "Clean build requested"
        
        if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
            clean_ios
        fi
        
        if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
            clean_android
        fi
    fi
    
    # Launch platform builds in separate terminals first
    case $PLATFORM in
        ios)
            run_ios
            ;;
        android)
            run_android
            ;;
        both)
            print_step "Opening both platforms in separate terminals..."
            run_ios
            sleep 2
            run_android
            print_success "Both terminals opened!"
            ;;
        *)
            print_error "Invalid platform: $PLATFORM"
            echo "Usage: $0 [ios|android|both] [--clean]"
            exit 1
            ;;
    esac
    
    echo ""
    print_step "Starting Metro bundler in this terminal..."
    print_warning "Press Ctrl+C to stop Metro"
    echo ""
    
    # Start Metro in foreground (this terminal)
    npm start -- --reset-cache
}

# Run main function
main
