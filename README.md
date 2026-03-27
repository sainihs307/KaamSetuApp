# KaamSetuApp 🔗

**KaamSetu** (Hindi: काम = Work, सेतु = Bridge) is a cross-platform mobile application built to connect workers and employers — bridging the gap between job seekers and opportunities. Built with React Native and Expo, the app runs on Android, iOS, and the web from a single codebase.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Key Dependencies](#-key-dependencies)
- [Architecture Overview](#-architecture-overview)
- [Navigation](#-navigation)
- [Backend](#-backend)
- [Assets](#-assets)
- [Contributing](#-contributing)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React Native](https://reactnative.dev/) 0.81 + [Expo](https://expo.dev/) ~54 |
| Language | TypeScript ~5.9 (93.8% of codebase) |
| Routing | [Expo Router](https://expo.github.io/router/) ~6.0 (file-based routing) |
| Navigation | React Navigation v7 (Bottom Tabs + Native Stack) |
| Animations | React Native Reanimated ~4.1 |
| Gestures | React Native Gesture Handler ~2.28 |
| Image Handling | Expo Image Picker + Cloudinary SDK |
| Storage | AsyncStorage |
| Email | Nodemailer ^8.0 |
| Icons | @expo/vector-icons ^15 |
| Linting | ESLint 9 + eslint-config-expo |

---

## 📁 Project Structure

```
KaamSetuApp/
├── app/                    # All screens & layouts (file-based routing via Expo Router)
│   ├── _layout.tsx         # Root layout — wraps the entire app
│   ├── (tabs)/             # Tab-based screens (bottom navigation group)
│   │   └── _layout.tsx     # Tab bar configuration
│   └── ...                 # Other screen files / route groups
│
├── backend/                # Backend logic (API handlers, server utilities)
│
├── components/             # Reusable UI components shared across screens
│
├── constants/              # App-wide constants (colors, sizes, config values)
│
├── hooks/                  # Custom React hooks
│
├── assets/
│   └── images/             # App icons, splash screen, and image assets
│
├── scripts/                # Utility scripts (e.g., reset-project)
│
├── app.json                # Expo configuration (icons, splash, scheme, plugins)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

### Key Directories Explained

**`app/`** — The heart of the project. Expo Router maps the file system directly to routes. Every `.tsx` file inside `app/` becomes a screen. Route groups (folders wrapped in parentheses like `(tabs)`) let you share layouts without affecting the URL path.

**`components/`** — Stateless or lightly-stateful UI components (buttons, cards, inputs, etc.) that are imported by screens. Keep business logic out of here.

**`hooks/`** — Custom hooks that encapsulate logic like data fetching, form handling, or device capabilities.

**`constants/`** — Centralised values like color palettes, font sizes, and API endpoints. Import from here instead of hardcoding values in components.

**`backend/`** — Server-side logic. This may contain API route handlers, database helpers, or cloud function utilities (e.g., Nodemailer email sending, Cloudinary upload handlers).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [Expo Go](https://expo.dev/go) app on your phone (for quick preview), OR
- Android Studio / Xcode for emulator/simulator

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NirajPrasad483/KaamSetuApp.git
cd KaamSetuApp

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

After running `npx expo start`, you'll see a QR code in your terminal. Scan it with Expo Go (Android) or the Camera app (iOS) to open the app instantly.

### Running on a specific platform

```bash
npm run android   # Open on Android emulator or connected device
npm run ios       # Open on iOS simulator (macOS only)
npm run web       # Open in the browser
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start the Expo development server |
| `npm run android` | Launch on Android |
| `npm run ios` | Launch on iOS |
| `npm run web` | Launch in the browser |
| `npm run lint` | Run ESLint across the project |
| `npm run reset-project` | Archive starter code to `app-example/` and create a blank `app/` directory |

---

## 📦 Key Dependencies

### Core

| Package | Purpose |
|---|---|
| `expo` ~54 | Core Expo SDK — device APIs, build tooling |
| `expo-router` ~6 | File-based routing and navigation |
| `react-native` 0.81 | Cross-platform mobile UI framework |
| `react` 19.1 | UI library |

### Navigation & UI

| Package | Purpose |
|---|---|
| `@react-navigation/native` | Navigation container |
| `@react-navigation/bottom-tabs` | Bottom tab bar |
| `react-native-reanimated` | Smooth, performant animations |
| `react-native-gesture-handler` | Touch and gesture recognition |
| `expo-linear-gradient` | Gradient backgrounds |
| `@expo/vector-icons` | Icon library (Ionicons, MaterialIcons, etc.) |

### Data & Media

| Package | Purpose |
|---|---|
| `@react-native-async-storage/async-storage` | Persistent local key-value storage |
| `expo-image-picker` | Camera and gallery access |
| `expo-image` | Optimised image rendering |
| `cloudinary` | Cloud image upload and transformation |

### Communication

| Package | Purpose |
|---|---|
| `nodemailer` | Server-side email sending |

### Device

| Package | Purpose |
|---|---|
| `expo-haptics` | Haptic feedback on supported devices |
| `expo-font` | Custom font loading |
| `expo-splash-screen` | Splash screen control |
| `expo-constants` | App constants (version, expoConfig, etc.) |

---

## 🏗 Architecture Overview

```
User Interaction
      │
      ▼
 Expo Router (app/)
      │
      ├──► Screen Components (app/ files)
      │         │
      │         ├──► Reusable Components (components/)
      │         ├──► Custom Hooks (hooks/)
      │         └──► Constants (constants/)
      │
      └──► Backend Logic (backend/)
                │
                ├──► Cloudinary (image uploads)
                └──► Nodemailer (email notifications)
```

The app uses **Expo's New Architecture** (`newArchEnabled: true`) and the **React Compiler** (`reactCompiler: true`) for optimised re-renders.

---

## 🧭 Navigation

KaamSetuApp uses **Expo Router's file-based routing**. The routing structure mirrors the `app/` directory:

- `app/_layout.tsx` — Root layout (fonts, splash screen, theme setup)
- `app/(tabs)/_layout.tsx` — Bottom tab bar definition
- `app/(tabs)/index.tsx` — First tab (Home)
- Additional route groups or stack screens live as siblings or nested folders

**Deep linking** is enabled via the custom URL scheme `kaamsetuapp://`.

---

## 🖥 Backend

The `backend/` directory houses server-side utilities used within the app (likely via serverless functions or a lightweight Node server):

- **Email** — Nodemailer is configured for sending transactional emails (e.g., application notifications, OTPs).
- **Media** — The Cloudinary SDK handles image uploads for profile pictures or job postings.

> ⚠️ Ensure you configure your environment variables (API keys, SMTP credentials, Cloudinary credentials) before running backend-dependent features. Create a `.env` file at the project root based on your setup.

---

## 🎨 Assets

All static assets live in `assets/images/`:

| File | Usage |
|---|---|
| `icon.png` | App icon (iOS) |
| `android-icon-foreground.png` | Adaptive icon foreground (Android) |
| `android-icon-background.png` | Adaptive icon background (Android) |
| `android-icon-monochrome.png` | Monochrome icon (Android 13+) |
| `splash-icon.png` | Splash screen image |
| `favicon.png` | Web favicon |

The adaptive icon uses a light blue background (`#E6F4FE`).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please run `npm run lint` before submitting a PR to ensure code quality.

---

## 📄 License

This project is private. All rights reserved.

---

> Built with ❤️ using Expo + React Native
