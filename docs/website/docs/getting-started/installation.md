---
sidebar_position: 1
---

# Installation

Get started with ScoreBook by setting up the development environment.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Git**

### Platform-Specific Requirements

#### For iOS Development:
- macOS
- Xcode (latest version)
- CocoaPods: `sudo gem install cocoapods`

#### For Android Development:
- Java Development Kit (JDK 17): `brew install openjdk@17`
- Android Studio with Android SDK
- Android Emulator or physical device

#### For Web Development:
- Any modern browser (Chrome, Firefox, Safari)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ScoreBook.git
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

### 3. Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install
```

## Verify Installation

### Check Backend

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Check Mobile App

```bash
cd mobile
npx expo start
```

You should see the Metro bundler start successfully.

## Next Steps

- [Quick Start Guide](./quick-start.md)
- [Project Structure](./project-structure.md)
