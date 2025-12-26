---
sidebar_position: 1
---

# Introduction

Welcome to the ScoreBook documentation! This guide will help you understand, maintain, and extend the ScoreBook application.

## What is ScoreBook?

ScoreBook is a cross-platform sports scoreboard application that displays live, upcoming, and completed matches across six different sports:

- 🏏 Cricket
- 🏈 American Football
- 🏒 Hockey
- ⚽ Soccer
- 🎾 Tennis
- 🏸 Badminton

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Mobile & Web Frontend             │
│         (React Native + Expo)               │
│  iOS │ Android │ Web                        │
└──────────────┬──────────────────────────────┘
               │
               │ HTTP/REST
               │
┌──────────────▼──────────────────────────────┐
│           Backend API                        │
│         (Node.js + Express)                  │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │      Mock Data Service              │    │
│  │  (JSON files for 6 sports)          │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Key Features

- **Single Codebase:** One React Native codebase for iOS, Android, and Web
- **Real-time Updates:** Auto-polling for live match scores
- **Mock Data:** Comprehensive mock data for development and testing
- **Test-Ready:** Extensive testID coverage for E2E automation
- **Type-Safe:** Full TypeScript implementation
- **Modular:** Clean component architecture for easy maintenance

## Tech Stack

### Frontend
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (Material Top Tabs + Stack)
- **State Management:** React Query + Zustand
- **HTTP Client:** Axios
- **Styling:** React Native StyleSheet

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Data Source:** JSON mock data files

## Documentation Structure

This documentation is organized into logical sections:

### 📚 Getting Started
Quick start guides, installation, and setup instructions.

### 🏗️ Architecture
System design, data flow, and technical decisions.

### 🔌 API Reference
Complete backend API documentation with examples.

###  Frontend Guide
Screens, components, navigation, and state management.

### 🧪 Testing
Testing strategies, tools, and best practices.

### 🤝 Contributing
Guidelines for contributing to the project.

## Quick Links

- [Installation Guide](./getting-started/installation.md)
- [API Reference](./api/overview.md)
- [Component Library](./frontend/components/overview.md)
- [Testing Guide](./testing/overview.md)

## Project Status

✅ **Production Ready** - All platforms verified working
- iOS: Tested on iPhone 16e Simulator
- Android: Tested on Pixel 9 Pro Emulator
- Web: Tested on Chrome/Safari browsers

## Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Documentation:** You're reading it!

---

*Last Updated: December 2024*
