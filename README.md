# ScoreBook App

A cross-platform sports scoreboard application built with React Native (Expo) and Node.js, supporting iOS, Android, and Web platforms.

## Features

- **Multi-Sport Support**: Cricket, American Football, Hockey, Soccer, Tennis, and Badminton
- **Real-Time Updates**: Live match scores with auto-polling
- **Cross-Platform**: Single codebase for iOS, Android, and Web
- **Test Automation Ready**: Comprehensive testIDs for E2E testing
- **Mock Data**: Comprehensive mock data for development and testing

## Tech Stack

**Frontend (Mobile & Web)**
- React Native with Expo
- TypeScript
- React Navigation
- React Query (TanStack Query)
- Zustand (State Management)
- Axios (API Client)

**Backend**
- Node.js with Express
- TypeScript
- Comprehensive mock data for all sports

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Git**

### Platform-Specific Requirements

**For iOS Development:**
- macOS
- Xcode (latest version)
- CocoaPods: `sudo gem install cocoapods`

**For Android Development:**
- Java Development Kit (JDK 17): `brew install openjdk@17`
- Android Studio with Android SDK
- Android Emulator or physical device

**For Web Development:**
- Any modern browser (Chrome, Firefox, Safari)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ScoreBook.git
cd ScoreBook
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm run dev
```

The backend will run at `http://localhost:3000`

**Verify backend is running:**
```bash
curl http://localhost:3000/api/health
```

### 3. Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install
```

### 4. Environment Configuration

**For iOS and Web:** No additional configuration needed.

**For Android:** The app is pre-configured to use `10.0.2.2:3000` (Android emulator's host machine address).

## Running the App

### Web

```bash
cd mobile
npx expo start --web
```

Opens at `http://localhost:8081`

### iOS Simulator

```bash
cd mobile
npx expo run:ios
```

**Or use Expo Go:**
```bash
npx expo start
# Then press 'i' for iOS simulator
```

### Android Emulator

**First-time setup:**
1. Ensure Java 17 is installed and in PATH:
   ```bash
   export JAVA_HOME=/opt/homebrew/opt/openjdk@17
   export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
   ```

2. Set Android SDK environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. Start your Android emulator from Android Studio

**Run the app:**
```bash
cd mobile
npx expo run:android
```

**Or use Expo Go:**
```bash
npx expo start
# Then press 'a' for Android emulator
```

## Project Structure

```
ScoreBook/
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── mock-data/      # Mock data for all sports
│   │   └── types/          # TypeScript type definitions
│   └── package.json
│
├── mobile/                  # React Native mobile app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # Screen components
│   │   ├── navigation/     # Navigation configuration
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   ├── constants/      # App constants
│   │   └── theme/          # Theme configuration
│   ├── App.tsx             # Main app entry point
│   └── package.json
│
└── docs/                    # Project documentation
```

## API Endpoints

**Base URL:** `http://localhost:3000/api`

- `GET /health` - Health check
- `GET /sports` - List all supported sports
- `GET /matches/live` - Get all live matches
- `GET /matches/:sport?status=live|upcoming|completed` - Get matches for a specific sport
- `GET /match/:id` - Get detailed match information

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start with auto-reload
npm run build        # Build for production
npm start            # Run production build
```

### Mobile Development

```bash
cd mobile
npx expo start       # Start Metro bundler
npx expo start --clear  # Clear cache and start
```

### Testing

The app includes comprehensive `testID` attributes for E2E testing with tools like Detox or Appium.

## Troubleshooting

### Android Build Issues

**Java not found:**
```bash
brew install openjdk@17
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
```

**SDK location not found:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
```

**Network errors on Android emulator:**
- The app uses `10.0.2.2:3000` for Android emulator
- Ensure backend is running at `localhost:3000`

### iOS Build Issues

**CocoaPods not installed:**
```bash
sudo gem install cocoapods
cd mobile/ios
pod install
```

### Web Build Issues

**Blank screen:**
- Check browser console for errors
- Ensure backend is running
- Try clearing cache: `npx expo start --web --clear`

## Environment Variables

### Backend `.env`

```env
PORT=3000
USE_MOCK_DATA=true
NODE_ENV=development
```

### Mobile (Optional)

The app auto-detects platform and configures API URLs accordingly:
- **iOS/Web**: `http://localhost:3000/api`
- **Android**: `http://10.0.2.2:3000/api`

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment with a hybrid build strategy.

### Pipeline Overview

| Job | Platform | Runner | Build Time | Cost |
|-----|----------|--------|------------|------|
| **Lint & Test** | All | ubuntu-latest | ~3 min | 💰 Low |
| **Build Web** | Web | ubuntu-latest | ~2 min | 💰 Low |
| **Build Android** | Android | ubuntu-latest | ~10 min | 💰 Low |
| **Build iOS** | iOS | ubuntu-latest (EAS) | ~5 min CI* | 💰 Low |

*iOS builds happen on Expo's servers (EAS Build), so CI only triggers the build

### Build Artifacts

After each successful CI run, build artifacts are available:

- **Web Build**: `web-build/` folder (7-day retention)
- **Android APK**: `android/app/build/outputs/apk/release/*.apk` (7-day retention)
- **iOS Build**: Available via EAS CLI or Expo dashboard

To download artifacts:
```bash
# From GitHub Actions UI
Go to Actions → Select workflow run → Download artifacts

# iOS builds via EAS CLI
eas build:list --platform ios
eas build:download --platform ios --latest --output ./app.ipa
```

### Setup Requirements

**EXPO_TOKEN (Required for iOS builds):**

The iOS build job requires an Expo access token. Follow the setup guide:

📖 **[EXPO_TOKEN Setup Guide](./docs/guide-expo-token-setup.md)**

**Quick Setup:**
1. Create Expo account: https://expo.dev/signup
2. Generate token: https://expo.dev/accounts/[username]/settings/access-tokens
3. Add to GitHub Secrets:
   - Repository Settings → Secrets → Actions → New secret
   - Name: `EXPO_TOKEN`
   - Value: Your token

### E2E Testing (Future)

The pipeline includes E2E test infrastructure (currently commented out). To enable:

1. Set up Detox in the mobile project
2. Uncomment E2E job sections in `.github/workflows/ci.yml`
3. Add test scripts to `mobile/package.json`

## Documentation

The project includes comprehensive documentation built with Docusaurus.

### Viewing Documentation Locally

```bash
# Navigate to docs website directory
cd docs/website

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

The documentation will be available at `http://localhost:3000` (or `http://localhost:3002` if port 3000 is in use).

### Building Documentation

To build the static documentation site:

```bash
cd docs/website

# Build static site
npm run build

# Preview the build locally
npm run serve
```

The built site will be in `docs/website/build/` directory.

### Deploying Documentation

The documentation is configured for deployment to Vercel:

**Vercel Settings:**
- Framework Preset: Docusaurus (V2+)
- Root Directory: `docs/website`
- Build Command: `npm run build`
- Output Directory: `build`

**Alternative Deployment Options:**
- GitHub Pages
- Netlify
- Any static hosting service

### Documentation Structure

```
docs/website/docs/
├── intro.md                    # Introduction
├── getting-started/            # Setup guides
│   ├── installation.md
│   ├── quick-start.md
│   └── project-structure.md
├── architecture/               # System design
│   └── system-architecture.md
├── api/                        # API documentation
│   ├── overview.md
│   └── matches-by-sport.md
├── frontend/                   # Frontend docs
│   ├── screens/
│   └── components/
└── testing/                    # Testing guides
    └── overview.md
```

## Building for Production


### iOS

```bash
cd mobile
npx expo build:ios
```

### Android

```bash
cd mobile
npx expo build:android
```

### Web

```bash
cd mobile
npx expo export:web
# Output in mobile/web-build/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing documentation in the `/docs` folder

## Acknowledgments

Built as a demo application for test automation practice, supporting multiple sports with comprehensive mock data.
