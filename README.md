# ScoreBook

A cross-platform React Native application for viewing live sports scores across Cricket, American Football, Hockey, Soccer, Tennis, and Badminton. Built specifically as a testbed for AI-based test automation solutions.

![ScoreBook Banner](docs/assets/banner.png)

## 🎯 Project Overview

**ScoreBook** provides real-time sports scores across six major sports with comprehensive E2E testing capabilities, making it perfect for demonstrating test automation tools and strategies.

### Key Features

- ✅ **Cross-Platform**: iOS, Android, and Web from a single codebase
- ✅ **6 Sports Covered**: Cricket, American Football, Hockey, Soccer, Tennis, Badminton
- ✅ **Real-Time Updates**: Auto-polling every 30-60 seconds
- ✅ **Test-Friendly**: Comprehensive testID attributes on all elements
- ✅ **Flexible Data**: Toggle between mock (predictable) and real API data
- ✅ **Multi-Layered Testing**: Unit, Integration, and E2E tests
- ✅ **Professional UI**: Modern, premium design with sport-specific theming

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Git
- **For iOS development**: macOS with Xcode installed
- **For Android development**: Android Studio installed

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ScoreBook.git
cd ScoreBook

# Install mobile app dependencies
cd mobile
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the App

**Start the Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3000
```

**Start the Mobile App:**
```bash
cd mobile
npx expo start

# Options:
# - Press 'i' for iOS Simulator
# - Press 'a' for Android Emulator  
# - Press 'w' for Web Browser
# - Scan QR code with Expo Go app on your phone
```

## 📁 Project Structure

```
ScoreBook/
├── mobile/                 # React Native Expo app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Screen components
│   │   ├── navigation/    # Navigation configuration
│   │   ├── services/      # API services
│   │   ├── store/         # State management (React Query + Zustand)
│   │   ├── theme/         # Design system
│   │   └── types/         # TypeScript types
│   └── e2e/              # Detox E2E tests
│
├── backend/               # Node.js Express backend
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── mock-data/    # Mock JSON fixtures
│
├── docs/                  # Documentation
│   ├── technical-architecture.md
│   ├── api-documentation.md
│   ├── testing-strategy.md
│   └── mac-setup-guide.md
│
└── .github/              # GitHub Actions CI/CD
```

## 🛠️ Tech Stack

### Frontend (Mobile)
- **Framework**: React Native (Expo SDK 49+)
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: 
  - React Query (TanStack Query) - Server state
  - Zustand - Client state
- **Styling**: Styled Components
- **UI Components**: React Native Paper

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Data**: Toggle between Mock (JSON) and Real (External APIs)

### Testing
- **Unit**: Jest + React Testing Library
- **E2E (Mobile)**: Detox
- **E2E (Web)**: Cypress
- **Future**: Appium, Playwright support

### DevOps
- **CI/CD**: GitHub Actions
- **Version Control**: Git
- **Package Manager**: npm

## 🧪 Testing

### Running Tests

**Unit Tests:**
```bash
# Mobile
cd mobile && npm test

# Backend
cd backend && npm test
```

**E2E Tests (Mobile):**
```bash
cd mobile
npm run test:e2e
```

**E2E Tests (Web):**
```bash
cd mobile
npm run test:web
```

### Testing Strategy

ScoreBook implements a **multi-layered testing approach**:

1. **Mock Data Tests** (First Defense)
   - Predictable, fast, no API dependencies
   - Test edge cases (ties, overtime, etc.)
   - Run in CI/CD pipeline

2. **Real API Tests** (Integration)
   - Validate real-world scenarios
   - Test API error handling
   - Run before releases

3. **E2E Tests** (Critical Flows)
   - User journey validation
   - Cross-platform testing
   - Automated in CI/CD

See [testing-strategy.md](docs/testing-strategy.md) for details.

## 📱 Supported Platforms

| Platform | Support | Testing |
|----------|---------|---------|
| **iOS** | ✅ iOS 13+ | ✅ Detox on Simulator |
| **Android** | ✅ Android 8+ | ✅ Detox on Emulator |
| **Web** | ✅ Modern Browsers | ✅ Cypress |

## 🎨 UI/UX

### Navigation Structure

```
Sport Tabs (Top Level)
  └─ Cricket / Football / Hockey / Soccer / Tennis / Badminton
      └─ Match Status Tabs
          └─ Live Now / Upcoming / Completed
              └─ Match Cards
```

### Match Card Components

Each match card displays:
- Team names and logos
- Current score (or scheduled time)
- Live indicator (for ongoing matches)
- Venue/location
- Home/Away badges (for team sports)

## 🔧 Configuration

### Backend API Modes

Toggle between mock and real data:

```bash
# backend/.env
USE_MOCK_DATA=true   # Use mock JSON fixtures
USE_MOCK_DATA=false  # Use real external APIs
```

### API Endpoints

```
GET  /api/health                    # Health check
GET  /api/sports                    # List of supported sports
GET  /api/matches/live              # All live matches
GET  /api/matches/:sport            # Matches for a sport
     ?status=live|upcoming|completed
GET  /api/match/:id                 # Detailed match info
```

See [api-documentation.md](docs/api-documentation.md) for full API reference.

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Technical Architecture](docs/technical-architecture.md) - System architecture, diagrams, design decisions
- [API Documentation](docs/api-documentation.md) - Complete API reference
- [Testing Strategy](docs/testing-strategy.md) - Testing philosophy and guidelines
- [Mac Setup Guide](docs/mac-setup-guide.md) - Environment setup for macOS
- [Component Library](docs/component-library.md) - UI component documentation
- [AntiGravity Handoff](docs/antigravity-handoff.md) - Development continuation guide

## 🤝 Contributing

This project follows a standard Git Flow workflow:

```bash
# Create feature branch from develop
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
- ✅ Runs linting and type checking
- ✅ Executes unit tests
- ✅ Runs E2E tests on Android
- ✅ Validates builds for all platforms
- ✅ Deploys to staging (on develop branch)

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 👤 Author

**Sriram**

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components from [React Native Paper](https://reactnativepaper.com/)
- State management by [TanStack Query](https://tanstack.com/query) & [Zustand](https://github.com/pmndrs/zustand)

---

## 📖 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Detox Testing](https://wix.github.io/Detox/)
- [Cypress Testing](https://www.cypress.io/)

---

**Built for Testing Excellence** 🧪 | **Cross-Platform by Design** 📱 | **Open Source** ❤️
