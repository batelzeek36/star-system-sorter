# Reload Script Update - Multi-Terminal Support

## Changes Made

Updated `scripts/reload-app.sh` to provide better development experience by separating Metro, iOS, and Android into different terminal windows.

## New Behavior

### Before
- Metro ran in background, logs saved to `metro.log`
- iOS/Android builds ran in the same terminal
- Hard to monitor different components

### After
- **Current terminal**: Metro bundler (foreground, live logs)
- **New terminal 1**: iOS build (if requested)
- **New terminal 2**: Android build (if requested)

## Usage

```bash
# iOS only - opens iOS in new terminal, Metro in current
./scripts/reload-app.sh ios

# Android only - opens Android in new terminal, Metro in current
./scripts/reload-app.sh android

# Both - opens iOS and Android in separate terminals, Metro in current
./scripts/reload-app.sh both

# With clean build
./scripts/reload-app.sh both --clean
```

## Implementation Details

- Uses macOS `osascript` to open new Terminal windows
- Each new terminal automatically `cd`s to project directory
- Metro runs in foreground for easy Ctrl+C stopping
- Emojis in terminal titles (🍎 for iOS, 🤖 for Android)

## Benefits

1. **Better visibility**: See Metro logs without build output clutter
2. **Parallel monitoring**: Watch iOS and Android builds simultaneously
3. **Easy debugging**: Errors are isolated to their respective terminals
4. **Simple control**: Ctrl+C to stop Metro, close terminals to stop builds
5. **Professional workflow**: Similar to running multiple tmux/screen sessions

## Platform Support

Currently supports macOS with Terminal.app. Could be extended to support:
- iTerm2 (different AppleScript)
- Linux (xterm, gnome-terminal)
- Windows (wt.exe for Windows Terminal)
