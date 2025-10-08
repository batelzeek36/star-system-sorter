# How to Run the App - Quick Reference

## 🚀 Quick Start (3 Steps)

### Step 1: Reload Shell (One-Time Only)
```bash
source ~/.zshrc
```

### Step 2: Start Metro Bundler
```bash
npm start
```
**Keep this terminal running!**

### Step 3: Run the App

#### For iOS:
Open a **new terminal** and run:
```bash
npm run ios
```

#### For Android:
1. Start Android Emulator from Android Studio
2. Open a **new terminal** and run:
```bash
npm run android
```

## ✅ That's It!

The app will launch and show:
- **Star System Sorter**
- **S³**
- "React Native app initialized successfully"

## 🔥 Hot Reload

Edit any file in `src/` or `App.tsx` and save - the app reloads automatically!

## 🐛 Debug Menu

- **iOS**: Cmd+D (simulator) or shake device
- **Android**: Cmd+M (emulator) or shake device

## 📝 Useful Commands

```bash
npm run typecheck    # Check TypeScript
npm run lint         # Check code style
npm run test         # Run tests
npm start -- --reset-cache  # Clear Metro cache
```

## ⚠️ Troubleshooting

### "Command not found" errors
```bash
source ~/.zshrc
```

### Metro won't start
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

### iOS build fails
```bash
cd ios && /opt/homebrew/bin/pod install && cd ..
```

### Android build fails
```bash
cd android && ./gradlew clean && cd ..
```

---

**Need more details?** See `FINAL_SETUP_STATUS.md`
