# 📱 Finnhub Stock Alert App

A real-time stock monitoring app built with React Native and Expo that provides price alerts, portfolio tracking, and market insights using the Finnhub API.

## ✨ Features

- 🚨 **Real-time Price Alerts** - Set target prices and receive local push notifications when reached
- 📊 **Portfolio Tracking** - Track your stock portfolio value with interactive charts
- 📈 **Real-time Market Data** - Live stock prices via WebSocket connection
- 🏠 **Dashboard Overview** - Portfolio performance and top movers at a glance
- 🔐 **Secure Authentication** - Auth0 integration for user management
- 📱 **Cross-platform** - iOS and Android support via React Native

## 🛠 Tech Stack

### Core Technologies

- **React Native** `0.81.4` - Cross-platform mobile development
- **Expo SDK** `~54.0.10` - Development platform and toolchain
- **TypeScript** `~5.9.2` - Type-safe JavaScript
- **React Navigation** `^7.x` - Navigation and routing

### Key Dependencies

- **expo-notifications** `^0.32.11` - Local push notifications
- **reconnecting-websocket** `^4.4.0` - Real-time data streaming
- **expo-auth-session** `^7.0.8` - OAuth authentication
- **react-native-reanimated** `^4.0.0` - Smooth animations
- **axios** `^1.12.2` - HTTP client for API calls

### APIs & Services

- **Finnhub API** - Stock market data and WebSocket feeds
- **Auth0** - User authentication and authorization

## 🏗 Project Architecture

### Feature-Based Structure

```
src/
├── features/           # Feature modules
│   ├── alerts/        # Price alert management
│   ├── auth/          # Authentication flows
│   ├── graph/         # Chart components and services
│   ├── home/          # Dashboard and overview
│   ├── notifications/ # Push notification handling
│   └── watchlist/     # Stock tracking and WebSocket
├── navigation/        # App navigation setup
├── services/          # API clients and external services
├── shared/            # Reusable components and utilities
├── storage/           # Persistent data management
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities
```

### Key Components

#### 🔔 Notification System

- **NotificationService** - Functional service for local notifications
- **useNotifications** - Hook for permission management
- Price alert notifications with cooldown protection

#### 📊 Chart System

- **BaseChart** - Foundational chart rendering component
- **PortfolioChart** - Portfolio value visualization
- **StockChart** - Individual stock price charts
- **PortfolioDataService** - Data aggregation and calculations

#### 🌐 Real-time Data

- **WebSocket Manager** - Finnhub WebSocket connection handling
- **Socket Service** - Connection state management with auto-reconnection
- Real-time price updates and alert processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone the repository**

```bash
git clone  [URL]
cd finnhubstockalert
```

2. **Install dependencies**

```bash
yarn install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FINNHUB_API_BASE=https://finnhub.io/api/v1
EXPO_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key

# Auth0 Configuration
EXPO_PUBLIC_AUTH0_DOMAIN=your_auth0_domain
EXPO_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
```

4. **Get API Keys**
   - **Finnhub API**: Sign up at [finnhub.io](https://finnhub.io) for free API access
   - **Auth0**: Create account at [auth0.com](https://auth0.com) and set up application

## 💻 Development

### Local Development

**Start the development server**

```bash
yarn start
```

**Run on specific platforms**

````bash
# iOS Simulator
yarn ios

# Android Emulator
yarn android


### Development Builds

For testing device-specific features (notifications, WebSocket):

```bash
# Development build for Android
yarn android:dev
````

### Code Quality

**Run tests**

```bash
yarn test
```

## 📦 Deployment

### EAS Build Configuration

The project uses Expo Application Services (EAS) for building and deployment. Build profiles are configured in `eas.json`:

- **development** - Development builds with dev client
- **preview** - Internal testing builds
- **production** - Production builds for app stores

### Building for Different Environments

**Preview/Internal Testing**

```bash
yarn android:preview
```

**Production Build**

```bash
yarn android:prod
```

### Environment Variables for Builds

Production builds should include environment variables in `eas.json`:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_AUTH0_DOMAIN": "your-domain.auth0.com",
        "EXPO_PUBLIC_AUTH0_CLIENT_ID": "your_client_id",
        "EXPO_PUBLIC_FINNHUB_API_BASE": "https://finnhub.io/api/v1"
      }
    }
  }
}
```

## 🎯 Usage Guide

### Setting Up Stock Alerts

1. **Add Stock Symbol** - Navigate to watchlist screen
2. **Set Target Price** - Configure price alert threshold
3. **Enable Notifications** - Grant notification permissions
4. **Monitor Real-time** - View live price updates

### Portfolio Tracking

1. **Add Multiple Stocks** - Set alerts for different symbols
2. **View Dashboard** - Check portfolio overview on home screen
3. **Track Performance** - Monitor gains/losses over time
4. **Analyze Charts** - View individual stock and portfolio charts

## 🔧 Configuration

### Notification Settings

```typescript
// Cooldown period for alerts (prevents spam)
const DEFAULT_ALERT_COOLDOWN_MS = 60_000; // 1 minute

// Notification channel configuration
await Notifications.setNotificationChannelAsync("price-alerts", {
  name: "Price Alerts",
  importance: Notifications.AndroidImportance.HIGH,
  sound: "default",
  enableVibrate: true,
});
```

### WebSocket Configuration

```typescript
// Connection settings
const WEBSOCKET_INITIAL_RECONNECTION_DELAY_MS = 3000;
const WEBSOCKET_MAXIMUM_RECONNECTION_ATTEMPTS = 10;
const WEBSOCKET_CONNECTION_ESTABLISHMENT_TIMEOUT_MS = 10000;
```

### Chart Configuration

```typescript
// Portfolio data retention
const MAX_HISTORY_POINTS = 100; // Limits memory usage

// Chart dimensions
const chartConfig = {
  width: 350,
  height: 200,
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  showGrid: true,
  theme: "light",
};
```
