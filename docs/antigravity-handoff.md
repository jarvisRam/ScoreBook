# ScoreBook - AntiGravity Handoff Documentation

## Purpose

This document provides complete context for continuing ScoreBook development on a Mac using AntiGravity. It includes all architectural decisions, project structure, and next steps.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What Has Been Done](#what-has-been-done)
3. [Technical Decisions Made](#technical-decisions-made)
4. [Project Structure](#project-structure)
5. [How to Continue with AntiGravity on Mac](#how-to-continue-with-antigravity-on-mac)
6. [First Development Tasks](#first-development-tasks)
7. [Key Files to Reference](#key-files-to-reference)

---

## Project Overview

**ScoreBook** is a cross-platform React Native application for viewing live sports scores across six major sports. Built specifically as a testbed for AI-based test automation solutions.

### Goals
- ✅ Cross-platform (iOS, Android, Web)
- ✅ Real-time score updates with auto-polling
- ✅ Comprehensive E2E testing capabilities
- ✅ Toggle between mock and real API data
- ✅ Professional CI/CD pipeline

### Supported Sports
1. Cricket
2. American Football
3. Hockey
4. Soccer
5. Tennis
6. Badminton

### Key Features
- Sport tab navigation (top-level)
- Match status tabs (Live/Upcoming/Completed) per sport
- Match cards with teams, scores, venue, home/away indicators
- Auto-refresh every 30-60 seconds
- TestID attributes on all interactive elements

---

## What Has Been Done

### ✅ Completed on Windows

1. **Planning & Architecture**
   - [x] Design proposal and UI mockups created
   - [x] Technical architecture fully documented
   - [x] Implementation plan with complete file structure
   - [x] All technical decisions confirmed

2. **Documentation Created**
   - [x] [implementation-plan.md](./implementation-plan.md) - Complete implementation roadmap
   - [x] [technical-architecture.md](./technical-architecture.md) - System architecture with diagrams
   - [x] [design-proposal.md](./design-proposal.md) - Original design and questions
   - [x] [technical-decisions.md](./technical-decisions.md) - All confirmed decisions
   - [x] [windows-vs-mac-analysis.md](./windows-vs-mac-analysis.md) - Development platform analysis
   - [x] [task.md](./task.md) - Implementation task checklist

### 🔄 To Be Done on Mac

1. **Project Initialization**
   - [ ] Create project directory structure
   - [ ] Initialize Expo React Native project
   - [ ] Initialize Node.js backend
   - [ ] Install all dependencies
   - [ ] Configure TypeScript

2. **Core Development**
   - [ ] Implement navigation structure
   - [ ] Build component library
   - [ ] Create backend API with mock data
   - [ ] Integrate React Query + Zustand
   - [ ] Implement theming system

3. **Testing Setup**
   - [ ] Configure Detox for iOS/Android
   - [ ] Configure Cypress for web
   - [ ] Add testID attributes
   - [ ] Write sample E2E tests

4. **GitHub**
   - [ ] Initialize git repository
   - [ ] Push to GitHub
   - [ ] Set up GitHub Actions

---

## Technical Decisions Made

### Core Stack

| Category | Decision | Rationale |
|----------|----------|-----------|
| **Framework** | Expo (React Native) | Cross-platform, EAS Build, React Native Web |
| **Language** | TypeScript | Type safety, better DX, testing automation |
| **Navigation** | React Navigation v6 | Industry standard, proven |
| **State (Server)** | React Query (TanStack Query) | Auto-polling, caching, perfect for live scores |
| **State (Client)** | Zustand | Lightweight, simple app state |
| **Styling** | Styled Components | Component-scoped, theming, RN Web compatible |
| **UI Library** | React Native Paper | Accessible, pre-built components |
| **Backend** | Node.js + Express | TypeScript, toggle mock/real data |
| **Testing (Mobile)** | Detox | React Native optimized, fast |
| **Testing (Web)** | Cypress | Developer-friendly, future Playwright |
| **CI/CD** | GitHub Actions | Automated testing pipeline |

### Key Configurations

**API Strategy:**
- Node.js backend with Express
- Environment toggle: `USE_MOCK_DATA=true/false`
- Mock data in JSON fixtures
- Real data from sports APIs (future)

**Real-Time Updates:**
- Polling every 30-60 seconds
- Auto-refresh when app is active
- React Query handles refetching

**Testing Strategy:**
- TestIDs on all interactive elements
- Detox for mobile E2E
- Cypress for web E2E
- Jest for unit tests
- Multi-layered: mock tests (first defense) + real API tests

**Home/Away Logic:**
- Team sports (Cricket, Football, Hockey, Soccer): Show H/A badges
- Individual sports (Tennis, Badminton): No H/A badges, show venue only

**Team Logos:**
- Hybrid approach: Popular logos in repo + dynamic/fallback icons
- Sport icons as fallbacks
- Team initials with color if no logo

---

## Project Structure

```
ScoreBook/                          # Monorepo root
├── mobile/                         # React Native Expo app
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── MatchCard.tsx
│   │   │   ├── TeamDisplay.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── LiveIndicator.tsx
│   │   │   ├── VenueInfo.tsx
│   │   │   └── HomeAwayBadge.tsx
│   │   ├── screens/               # Screen components
│   │   │   ├── SportScreen.tsx
│   │   │   └── MatchDetailScreen.tsx
│   │   ├── navigation/            # Navigation config
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── SportTabNavigator.tsx
│   │   │   └── types.ts
│   │   ├── services/              # API services
│   │   │   ├── api.ts
│   │   │   ├── matchService.ts
│   │   │   └── sportService.ts
│   │   ├── store/                 # State management
│   │   │   ├── useAppStore.ts          # Zustand
│   │   │   ├── useMatches.ts           # React Query
│   │   │   └── useLiveMatches.ts
│   │   ├── types/                 # TypeScript types
│   │   │   ├── match.types.ts
│   │   │   ├── sport.types.ts
│   │   │   └── api.types.ts
│   │   ├── theme/                 # Design system
│   │   │   ├── theme.ts
│   │   │   ├── sportColors.ts
│   │   │   └── StyledComponents.ts
│   │   ├── constants/             # App constants
│   │   │   ├── sports.ts
│   │   │   └── config.ts
│   │   └── assets/                # Images, icons, logos
│   ├── e2e/                       # Detox E2E tests
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                        # Node.js Express backend
│   ├── src/
│   │   ├── routes/                # API routes
│   │   │   ├── matches.routes.ts
│   │   │   ├── sports.routes.ts
│   │   │   └── health.routes.ts
│   │   ├── services/              # Business logic
│   │   │   ├── dataService.ts
│   │   │   ├── mockDataService.ts
│   │   │   └── realDataService.ts
│   │   ├── mock-data/             # JSON fixtures
│   │   │   ├── cricket/
│   │   │   ├── football/
│   │   │   └── ...
│   │   ├── types/
│   │   ├── config.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                           # Documentation
│   ├── technical-architecture.md
│   ├── api-documentation.md
│   ├── testing-strategy.md
│   ├── mac-setup-guide.md
│   └── component-library.md
│
├── .github/                        # GitHub Actions
│   └── workflows/
│       └── ci.yml
│
├── README.md
├── .gitignore
└── package.json                    # Root package.json
```

---

## How to Continue with AntiGravity on Mac

When you start development on your Mac, you'll open a new AntiGravity conversation. Here's how to provide context:

### Starting a New AntiGravity Session

**1. Clone/Access the GitHub Repository**

First, ensure the ScoreBook repository is on your Mac:

```bash
# If repository exists on GitHub
git clone https://github.com/YOUR_USERNAME/ScoreBook.git
cd ScoreBook

# If starting fresh, the repo will be initialized
```

**2. Open AntiGravity and Provide Context**

Use this template to start your AntiGravity conversation:

---

### AntiGravity Conversation Starter (Copy This)

```
I'm continuing development on the ScoreBook application that I started planning on another machine. This is a React Native (Expo) cross-platform app for live sports scores, built specifically for test automation demonstrations.

All architectural planning is complete. Here's what has been done:

1. TECHNICAL ARCHITECTURE COMPLETED
   - Framework: Expo (React Native) with TypeScript
   - State: React Query (server state) + Zustand (client state)
   - Navigation: React Navigation v6
   - Styling: Styled Components
   - Backend: Node.js + Express with mock/real data toggle
   - Testing: Detox (mobile), Cypress (web)

2. DOCUMENTATION CREATED
   - Implementation plan with complete file structure
   - Technical architecture with system diagrams
   - All technical decisions documented
   
3. PROJECT STRUCTURE DEFINED
   - Monorepo: mobile/ (React Native) + backend/ (Node.js)
   - Complete component hierarchy planned
   - API endpoints defined
   - Testing strategy documented

4. KEY REQUIREMENTS
   - 6 sports: Cricket, American Football, Hockey, Soccer, Tennis, Badminton
   - 2-level navigation: Sport tabs → Match status tabs (Live/Upcoming/Completed)
   - Auto-polling every 30-60 seconds for live updates
   - TestIDs on all interactive elements
   - Mock/real data toggle for testing

CURRENT STATUS:
- Planning phase: 100% complete
- Implementation: 0% complete (ready to start)
- Location: e:/Sriram Workspace/ScoreBook (or your actual path)

I NEED YOU TO:
1. Read the technical documentation in the repository
2. Initialize the Expo project structure in mobile/
3. Initialize the Node.js backend in backend/
4. Set up the base configuration (TypeScript, ESLint, etc.)
5. Create the navigation structure
6. Start building core components

Please start by examining the existing documentation files, then let me know when you're ready to begin implementation.
```

---

**3. Let AntiGravity Examine the Docs**

After providing the above context, AntiGravity will:
- Read your documentation files
- Understand the architecture
- Ask clarifying questions if needed
- Begin implementation

**4. Point to Key Files**

If AntiGravity needs more context, reference these files:

```
Key documentation files (all in docs/ directory):
- implementation-plan.md - Complete file structure and implementation steps
- technical-architecture.md - System architecture with diagrams
- technical-decisions.md - All confirmed decisions
- task.md - Implementation checklist
- design-proposal.md - Original design mockups
```

---

## First Development Tasks

Once AntiGravity is ready on your Mac, here are the first tasks:

### Phase 1: Project Initialization (Week 1)

1. **Set Up Mobile App**
   ```bash
   # AntiGravity will run these commands
   cd mobile
   npx create-expo-app@latest . --template blank-typescript
   npm install @react-navigation/native @react-navigation/material-top-tabs
   npm install @tanstack/react-query zustand styled-components
   npm install react-native-paper react-native-vector-icons
   ```

2. **Set Up Backend**
   ```bash
   cd backend
   npm init -y
   npm install express cors dotenv axios
   npm install -D typescript @types/express @types/node ts-node nodemon
   ```

3. **Configure TypeScript**
   - Set up tsconfig.json for both mobile and backend
   - Configure path aliases (@components, @screens, etc.)

4. **Create Basic Structure**
   - Create all directories as per implementation plan
   - Set up empty component files
   - Create type definition files

### Phase 2: Core Implementation (Week 2-3)

1. **Backend API with Mock Data**
   - Create Express server
   - Implement health endpoint
   - Create mock JSON fixtures for all 6 sports
   - Implement match endpoints
   - Add mock/real toggle

2. **Navigation Structure**
   - RootNavigator setup
   - Sport tab navigator (Material Top Tabs)
   - Match status tabs integration

3. **Theme System**
   - Define design tokens (colors, spacing, typography)
   - Set up Styled Components theme
   - Create sport-specific color schemes

4. **Core Components**
   - MatchCard component
   - TeamDisplay component
   - ScoreDisplay component
   - LiveIndicator component
   - VenueInfo component
   - HomeAwayBadge component

### Phase 3: Integration (Week 4)

1. **State Management**
   - Set up React Query client
   - Create custom hooks (useMatches, useLiveMatches)
   - Set up Zustand stores
   - Configure auto-polling

2. **API Integration**
   - Connect frontend to backend
   - Implement loading/error states
   - Add pull-to-refresh
   - Test data flow

3. **Testing Setup**
   - Configure Detox
   - Configure Cypress
   - Add testID attributes
   - Write first E2E tests

---

## Key Files to Reference

### Must Read Before Implementation

1. **[implementation-plan.md](./implementation-plan.md)**
   - Complete file structure
   - Every component and its purpose
   - Implementation workflow
   - Verification plan

2. **[technical-architecture.md](./technical-architecture.md)**
   - System architecture diagrams
   - Component hierarchy
   - Data flow patterns
   - State management strategy
   - Design decisions and rationale

3. **[technical-decisions.md](./technical-decisions.md)**
   - All confirmed technical choices
   - State management explanation
   - Team logos strategy
   - Backend architecture

### Reference During Development

4. **[task.md](./task.md)**
   - Implementation checklist
   - Track progress

5. **[design-proposal.md](./design-proposal.md)**
   - Original UI mockups
   - Design structure
   - Initial questions and answers

---

## Development Workflow on Mac

### Daily Workflow

```bash
# Start backend
cd backend
npm run dev        # Runs on localhost:3000

# Start mobile app (separate terminal)
cd mobile
npx expo start     # Opens Expo Dev Tools

# Options:
# - Press 'i' for iOS Simulator
# - Press 'a' for Android Emulator
# - Press 'w' for web browser
# - Scan QR code with Expo Go on physical device
```

### Testing Workflow

```bash
# Unit tests
cd mobile && npm test
cd backend && npm test

# E2E tests (mobile)
cd mobile
npm run test:e2e

# Web tests
cd mobile
npm run test:web
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/navigation-setup

# Make changes, commit
git add .
git commit -m "feat: implement sport tab navigation"

# Push to GitHub
git push origin feature/navigation-setup

# Create PR on GitHub
# Merge to develop after review
```

---

## Environment Setup on Mac

### Prerequisites to Install

1. **Homebrew**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Node.js (LTS)**
   ```bash
   brew install node
   ```

3. **Git**
   ```bash
   brew install git
   ```

4. **Xcode** (from App Store)
   - Install Xcode
   - Open Xcode, accept license
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

5. **Xcode Simulators**
   - Open Xcode → Preferences → Components
   - Download iOS simulators

6. **Watchman** (for React Native)
   ```bash
   brew install watchman
   ```

7. **VS Code** (recommended)
   ```bash
   brew install --cask visual-studio-code
   ```

8. **Android Studio** (optional, for Android development)
   - Download from https://developer.android.com/studio
   - Set up Android SDK
   - Create virtual device

### First-Time Setup

```bash
# Clone repository (if from GitHub)
git clone https://github.com/YOUR_USERNAME/ScoreBook.git
cd ScoreBook

# Install dependencies
cd mobile && npm install
cd ../backend && npm install

# Set up environment variables
cd backend
cp .env.example .env
# Edit .env with your settings

# Start development
cd mobile && npx expo start
```

---

## Troubleshooting

### Common Issues on Mac

**1. iOS Simulator not opening**
```bash
# Make sure Xcode Command Line Tools installed
xcode-select --install

# Make sure simulators downloaded in Xcode
```

**2. Metro bundler cache issues**
```bash
cd mobile
npx expo start --clear
```

**3. Pod install issues (if using bare React Native)**
```bash
cd ios
pod install
```

**4. Port already in use**
```bash
# Backend (3000)
lsof -ti:3000 | xargs kill

# Expo Metro (8081)
lsof -ti:8081 | xargs kill
```

---

## Questions?

If you have any questions while implementing on Mac, refer to:

1. Check [implementation-plan.md](./implementation-plan.md) for file structure details
2. Check [technical-architecture.md](./technical-architecture.md) for architecture clarifications
3. Ask AntiGravity specific questions with context from these docs

---

## Summary

**You're all set!** 

✅ All planning and architecture is complete  
✅ Every technical decision has been made  
✅ Complete file structure is documented  
✅ Development workflow is defined  

**Next step on Mac:**
1. Set up Mac environment (Xcode, Node.js, etc.)
2. Open new AntiGravity conversation
3. Use the conversation starter template above
4. Let AntiGravity read the docs and begin implementation

The project is architected for success. Just follow the implementation plan, and you'll have a production-ready app with comprehensive testing capabilities!

---

**Good luck with your Mac development! 🚀**
