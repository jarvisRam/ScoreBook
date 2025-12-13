# Mac Setup Guide for ScoreBook Development

This guide will help you set up your Mac for ScoreBook development after cloning the repository.

## Prerequisites

### System Requirements
- **macOS**: 12.0 (Monterey) or later
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 20GB free space

---

## Step 1: Install Xcode

Xcode is required for iOS development.

### Install Xcode from App Store

1. Open **App Store**
2. Search for **Xcode**
3. Click **Get** / **Install**
4. Wait for installation (this takes 30-60 minutes, ~12GB download)

### Accept Xcode License

```bash
sudo xcodebuild -license accept
```

### Install Command Line Tools

```bash
xcode-select --install
```

### Verify Installation

```bash
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer
```

---

## Step 2: Install Homebrew

Homebrew is a package manager for macOS.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, follow the instructions to add Homebrew to your PATH.

### Verify Installation

```bash
brew --version
# Should output: Homebrew x.x.x
```

---

## Step 3: Install Node.js

ScoreBook requires Node.js 18 or later.

```bash
brew install node@18
```

### Verify Installation

```bash
node --version
# Should output: v18.x.x or later

npm --version
# Should output: 9.x.x or later
```

---

## Step 4: Install Git

Git should already be installed with Xcode, but you can update it via Homebrew:

```bash
brew install git
```

### Configure Git (if not already done)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 5: Install Watchman

Watchman is used by React Native for file watching.

```bash
brew install watchman
```

### Verify Installation

```bash
watchman --version
```

---

## Step 6: Install iOS Simulators

### Open Xcode
1. Open **Xcode**
2. Go to **Preferences** (Xcode → Preferences or ⌘,)
3. Click **Components** tab
4. Download iOS simulators you need (e.g., iOS 16.0, iOS 17.0)

### Verify Simulators

```bash
xcrun simctl list devices
# Should list available iOS simulators
```

---

## Step 7: Install Android Studio (Optional)

For Android development, install Android Studio.

### Download and Install

1. Download from: https://developer.android.com/studio
2. Open the downloaded DMG file
3. Drag **Android Studio** to **Applications**
4. Open Android Studio

### Initial Setup

1. Run Android Studio
2. Follow the setup wizard
3. Install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Set Environment Variables

Add to `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload shell:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### Create Android Virtual Device

1. Open Android Studio
2. Go to **Tools** → **AVD Manager**
3. Click **Create Virtual Device**
4. Select a device (e.g., Pixel 5)
5. Select a system image (e.g., Android 13 - API 33)
6. Click **Finish**

---

## Step 8: Install VS Code (Recommended)

```bash
brew install --cask visual-studio-code
```

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **TypeScript and JavaScript Language Features**
- **React Native Tools**
- **GitLens**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

Install via VS Code Extensions panel or:

```bash
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

---

## Step 9: Clone ScoreBook Repository

```bash
cd ~/Developer  # or your preferred directory
git clone https://github.com/YOUR_USERNAME/ScoreBook.git
cd ScoreBook
```

---

## Step 10: Install Project Dependencies

### Install Mobile Dependencies

```bash
cd mobile
npm install
```

### Install Backend Dependencies

```bash
cd ../backend
npm install
```

### Return to Root

```bash
cd ..
```

---

## Step 11: Set Up Backend Environment

Create `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
# API Mode
USE_MOCK_DATA=true

# Server Configuration
PORT=3000
NODE_ENV=development

# External API Keys (add when using real data)
# API_SPORTS_KEY=your_key_here
```

---

## Step 12: Start Development

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
Mode: MOCK
```

### Terminal 2: Start Mobile App

```bash
cd mobile
npx expo start
```

You should see Expo Dev Tools with a QR code.

### Options to Run App

**iOS Simulator:**
```
Press 'i' in the Expo terminal
```

**Android Emulator:**
```
Press 'a' in the Expo terminal
```

**Web Browser:**
```
Press 'w' in the Expo terminal
```

**Physical Device:**
```
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Scan the QR code with your device camera
```

---

## Step 13: Verify Installation

### Run Tests

**Mobile:**
```bash
cd mobile
npm test
```

**Backend:**
```bash
cd backend
npm test
```

### Check Backend Health

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "mode": "mock",
  "timestamp": 1234567890
}
```

---

## Troubleshooting

### iOS Simulator Not Starting

**Issue**: Simulator window doesn't appear

**Solution**:
```bash
# Kill existing simulators
pkill -9 Simulator

# Start Expo again
npx expo start
# Press 'i'
```

### Metro Bundler Issues

**Issue**: "Metro bundler failed to start"

**Solution**:
```bash
# Clear Expo cache
npx expo start --clear

# Or reset Metro cache
rm -rf node_modules/.cache
```

### Port Already in Use

**Issue**: "Port 3000 is already in use"

**Solution**:
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

### CocoaPods Issues (if using bare React Native)

**Issue**: "Pod install failed"

**Solution**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### Node Modules Issues

**Issue**: Various dependency errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Xcode Build Errors

**Issue**: iOS build fails in Xcode

**Solution**:
1. Open Xcode
2. **Product** → **Clean Build Folder** (⌘⇧K)
3. **Product** → **Build** (⌘B)

### Watchman Watch Limit

**Issue**: "Watchman error: too many files"

**Solution**:
```bash
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
watchman shutdown-server
```

---

## Development Workflow

### Daily Development

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend && npm run dev
   ```

2. **Start Mobile** (Terminal 2)
   ```bash
   cd mobile && npx expo start
   ```

3. **Make Changes**
   - Edit code in VS Code
   - Save files
   - App reloads automatically

4. **Run Tests**
   ```bash
   npm test
   ```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature

# Create Pull Request on GitHub
```

---

## Keyboard Shortcuts

### Expo Dev Tools
- `i` - Open iOS Simulator
- `a` - Open Android Emulator
- `w` - Open in web browser
- `r` - Reload app
- `m` - Toggle menu
- `d` - Open developer menu in app

### React Native Developer Menu

**iOS Simulator**: ⌘D  
**Android Emulator**: ⌘M

Options in menu:
- Reload
- Enable Fast Refresh
- Toggle Inspector
- Debug with Chrome

---

## Useful Commands

```bash
# Install iOS app on simulator
npx expo run:ios

# Install Android app on emulator
npx expo run:android

# Build production version
npx expo build:ios
npx expo build:android

# Clear all caches
watchman watch-del-all && rm -rf node_modules && npm install && npm start -- --reset-cache

# List iOS simulators
xcrun simctl list devices

# List Android emulators
emulator -list-avds

# Start Android emulator from command line
emulator -avd Pixel_5_API_33
```

---

## Performance Tips

1. **Use Fast Refresh**: Keep Fast Refresh enabled for instant updates
2. **Disable Remote JS Debugging**: Only enable when needed (slower)
3. **Use Flipper**: For advanced debugging (install separately)
4. **Close Unused Apps**: Free up RAM for simulator/emulator
5. **Use Physical Device**: Often faster than simulators

---

## Next Steps

Once your environment is set up:

1. Read [antigravity-handoff.md](./antigravity-handoff.md) for project context
2. Review [technical-architecture.md](./technical-architecture.md) for system design
3. Check [implementation-plan.md](./implementation-plan.md) for development roadmap
4. Start implementing features!

---

## Getting Help

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/react-native

---

**You're ready to build! 🚀**
