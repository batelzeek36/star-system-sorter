#!/bin/bash

# Reload React Native app on iOS and/or Android simulators
# Usage: 
#   ./scripts/reload-app.sh ios
#   ./scripts/reload-app.sh android
#   ./scripts/reload-app.sh both
#   ./scripts/reload-app.sh both --clean

set -e

PLATFORM=${1:-both}
CLEAN_BUILD=${2:-}

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

# Start Metro in background
start_metro() {
    print_step "Starting Metro bundler with cache reset..."
    npm start -- --reset-cache > metro.log 2>&1 &
    METRO_PID=$!
    
    # Wait for Metro to be ready
    print_step "Waiting for Metro to be ready..."
    for i in {1..30}; do
        if check_metro; then
            print_success "Metro is ready (PID: $METRO_PID)"
            return 0
        fi
        sleep 1
    done
    
    print_error "Metro failed to start. Check metro.log for details."
    return 1
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

# Run iOS
run_ios() {
    print_step "Building and running iOS app..."
    npm run ios
}

# Run Android
run_android() {
    print_step "Building and running Android app..."
    npm run android
}

# Main script
main() {
    echo ""
    print_step "React Native App Reload Script"
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
    
    # Start Metro
    if ! start_metro; then
        exit 1
    fi
    
    # Wait a bit for Metro to fully initialize
    sleep 3
    
    # Run the app(s)
    case $PLATFORM in
        ios)
            run_ios
            print_success "iOS app reloaded!"
            ;;
        android)
            run_android
            print_success "Android app reloaded!"
            ;;
        both)
            print_step "Running both platforms..."
            
            # Run iOS first
            run_ios &
            IOS_PID=$!
            
            # Wait a bit before starting Android
            sleep 5
            
            # Run Android
            run_android &
            ANDROID_PID=$!
            
            # Wait for both to complete
            wait $IOS_PID
            wait $ANDROID_PID
            
            print_success "Both apps reloaded!"
            ;;
        *)
            print_error "Invalid platform: $PLATFORM"
            echo "Usage: $0 [ios|android|both] [--clean]"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Done! Metro is running in the background."
    print_warning "To stop Metro: lsof -ti:8081 | xargs kill -9"
    print_warning "To view Metro logs: tail -f metro.log"
    echo ""
}

# Run main function
main
