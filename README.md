# BharatQuest

**Protect Your Money. Learn to Fight Fraud.**

BharatQuest is a gamified, behavioral financial literacy app built with React Native (Expo + TypeScript). It teaches users — specifically targeting rural Indian demographics — to recognize and defend against common digital payment scams (UPI phishing, QR code fraud, bank impersonation) through experiential, consequence-driven gameplay.

Built as a hackathon MVP, it features real-time SMS interception via a custom Expo native module, a heuristic scam detection engine with multi-language translation, and an offline-first architecture backed by AsyncStorage.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Game Flow](#game-flow)
- [SMS Interception](#sms-interception)
- [Scam Detection Engine](#scam-detection-engine)
- [Localization](#localization)
- [State Management](#state-management)
- [Configuration](#configuration)
- [Demo Controls](#demo-controls)
- [Dependencies](#dependencies)
- [Known Limitations](#known-limitations)

---

## Features

- **3-Level Scam Scenario Campaign**: UPI Reward Phishing → QR Code Fraud → Bank Impersonation — each with unique NPC dialogues, fake brand UI, and educational consequences.
- **Real-time SMS Interception**: Custom Expo native Android module (`expo-sms-interceptor`) intercepts incoming SMS, runs heuristic AI detection, and alerts users to live scam messages.
- **Heuristic Scam Detection**: Regex-based pattern matching engine with 7 detection strategies, including urgency + link, greed + action, auth harvesting, and mixed-script analysis (Devanagari/Bengali).
- **Translation Pipeline**: Bhashini API integration for Hindi/Assamese → English translation, with a comprehensive mock fallback that maps 200+ keywords for offline reliability.
- **Multi-language Support**: Full UI and content localization in English (`en`), Hindi (`hi`), and Assamese (`as`), switchable at runtime.
- **Voice Narration**: Text-to-speech warnings via `expo-speech` when phishing content is detected in-chat, with per-message deduplication.
- **Offline-First Persistence**: All game state (balance, trust score, level, language, mode) persisted to `AsyncStorage` and restored on app launch.
- **Assisted Learning Mode**: Toggle-able "Grandchild Tips" that appear after each scenario — designed for intergenerational education where a younger family member teaches an elder.
- **Fortune Teller Onboarding**: A diagnostic modal on first launch that calibrates initial balance (₹3,000 or ₹5,000) and trust score (50 or 80) based on the user's self-reported UPI familiarity.
- **Haptic Feedback**: Contextual vibrations on reward popups, decisions, and consequences.
- **Confetti & Animations**: Success celebrations with `react-native-confetti-cannon`, animated HUD counters, and full-screen flash effects on consequences.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        App.tsx                           │
│  ┌─────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ GameProvider │  │   SmsListener   │  │RootNavigator │ │
│  │ (Context +   │  │ (Native Module  │  │ (5 screens)  │ │
│  │  Reducer)    │  │  + Permission)  │  │              │ │
│  └──────┬──────┘  └───────┬─────────┘  └──────┬───────┘ │
│         │                 │                    │         │
│         ▼                 ▼                    ▼         │
│  ┌──────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │GameState │◄───│analyzeScam   │    │Dashboard       │  │
│  │(balance, │    │Text()        │    │  → Reward      │  │
│  │ trust,   │    │  → translate │    │  → Chat        │  │
│  │ level,   │    │  → detect    │    │  → Decision    │  │
│  │ flow...) │    │  → alert     │    │  → Result      │  │
│  └──────────┘    └──────────────┘    └────────────────┘  │
│         │                                                │
│         ▼                                                │
│  ┌──────────────┐                                        │
│  │ AsyncStorage │                                        │
│  │ (Persistence)│                                        │
│  └──────────────┘                                        │
└──────────────────────────────────────────────────────────┘
```

**Design patterns used:**
- **Context + useReducer** for global state (17 action types, single source of truth)
- **Screen-per-state** navigation with forced `fade` transitions
- **Service layer** for side effects (storage, detection, translation)
- **Locale-driven content** — all UI strings and scenario data loaded from locale files, not hardcoded in components

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node) or **yarn**
- **Expo CLI**: installed globally or via `npx`
- **Android device or emulator** for SMS interception features (requires native build)
- **Expo Go app** for quick testing (note: SMS interception requires a dev build, not Expo Go)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Sumeet-basfore/BharatQuest.git
cd BharatQuest

# Install dependencies
npm install
```

---

## Running the App

### Quick Start (Expo Go — no SMS features)

```bash
npx expo start
```

Then scan the QR code with the Expo Go app on your phone.

### Full Native Build (required for SMS interception)

```bash
# Generate the android/ directory and build the native project
npx expo run:android
```

This is required because the `expo-sms-interceptor` module includes native Kotlin code that must be compiled into the APK.

### Web (limited features)

```bash
npx expo start --web
```

> **Note:** SMS interception, haptics, speech, and blur effects are not available on web. The web module is a no-op stub.

---

## Project Structure

```
BharatQuest/
├── App.tsx                              # Entry point: GameProvider + SmsListener + RootNavigator
├── index.ts                             # Expo registerRootComponent
├── app.json                             # Expo configuration (permissions, splash, icons)
├── tsconfig.json                        # TypeScript config (strict mode)
├── package.json                         # Dependencies and scripts
│
├── assets/                              # Expo app icons and splash screen
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
│
├── modules/
│   └── expo-sms-interceptor/            # Custom Expo native module
│       ├── android/src/main/java/expo/modules/smsinterceptor/
│       │   ├── ExpoSmsInterceptorModule.kt   # Expo Module API definition
│       │   └── SmsReceiver.kt                # Android BroadcastReceiver for SMS
│       ├── src/
│       │   ├── ExpoSmsInterceptor.types.ts   # TypeScript type definitions
│       │   ├── ExpoSmsInterceptorModule.ts   # JS-side module binding
│       │   └── ExpoSmsInterceptorModule.web.ts  # Web no-op stub
│       └── index.ts                          # Module export
│
└── src/
    ├── assets/
    │   └── images/                      # Game artwork
    │       ├── farm_backdrop.png        # Dashboard village backdrop
    │       ├── scam_defender_badge.png   # Success achievement badge
    │       └── scammer_avatar.png       # NPC chat avatar
    │
    ├── components/
    │   ├── common/                      # Reusable UI primitives
    │   │   ├── HUDStat.tsx              # Animated balance/trust counter chip
    │   │   ├── PrimaryButton.tsx        # Standard action button with icon
    │   │   ├── ScreenShell.tsx          # Screen wrapper with dark background
    │   │   └── VoiceFab.tsx             # Floating voice toggle button
    │   │
    │   └── game/                        # Game-specific components
    │       ├── ConsequenceModal.tsx      # Success/failure result modal (State 5)
    │       ├── DecisionSheet.tsx         # Claim vs. Report choice buttons (State 4)
    │       ├── FarmBackdrop.tsx          # Village wallet background image
    │       ├── OnboardingModal.tsx       # Fortune Teller diagnostic (first launch)
    │       ├── RewardBanner.tsx          # Fake UPI reward popup (State 2)
    │       ├── ScamChat.tsx             # WhatsApp-style scam chat interface (State 3)
    │       ├── SmsInterceptorModal.tsx   # Real SMS alert overlay
    │       └── SyncOverlay.tsx          # Fake cloud sync animation (State 6)
    │
    ├── config/
    │   ├── content.ts                   # useContent() hook — routes to active locale
    │   ├── theme.ts                     # Design tokens: colors, typography, spacing, timing
    │   └── content_locales/
    │       ├── en.ts                    # English content (251 lines)
    │       ├── hi.ts                    # Hindi content (246 lines)
    │       └── as.ts                    # Assamese content (246 lines)
    │
    ├── context/
    │   └── GameContext.tsx              # React Context + useReducer (17 actions)
    │
    ├── hooks/
    │   ├── useVoiceNarration.ts         # expo-speech TTS with deduplication
    │   └── useAnimatedValue.ts          # Animated.Value helper
    │
    ├── navigation/
    │   └── RootNavigator.tsx            # Native stack with 5 screens, state restoration
    │
    ├── screens/
    │   ├── DashboardScreen.tsx          # State 1: Wallet overview + mission list
    │   ├── RewardPopupScreen.tsx        # State 2: Deceptive reward popup
    │   ├── ChatScreen.tsx              # State 3: Scam chat simulation
    │   ├── DecisionScreen.tsx          # State 4: Claim vs. Report
    │   └── ResultScreen.tsx            # State 5+6: Consequence + sync
    │
    ├── services/
    │   ├── aiDetection.ts              # Translation + heuristic scam detection engine
    │   └── storage.ts                  # AsyncStorage CRUD for game snapshots
    │
    └── types/
        └── game.ts                     # TypeScript interfaces (GameState, GameAction, etc.)
```

---

## Game Flow

The app follows a rigid 6-state linear progression per level:

```
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│ Dashboard │───▶│  Reward   │───▶│   Chat    │───▶│ Decision  │───▶│  Result   │───▶│   Sync    │
│ (State 1) │    │ (State 2) │    │ (State 3) │    │ (State 4) │    │ (State 5) │    │ (State 6) │
│           │    │           │    │           │    │           │    │           │    │           │
│ Wallet    │    │ Fake UPI  │    │ Scammer   │    │ Claim or  │    │ Win/Lose  │    │ Fake      │
│ Overview  │    │ reward    │    │ conversa- │    │ Report?   │    │ ₹ & Trust │    │ cloud     │
│ + Missions│    │ banner    │    │ tion      │    │           │    │ update    │    │ sync      │
└───────────┘    └───────────┘    └───────────┘    └───────────┘    └───────────┘    └───────────┘
```

**Three levels, escalating severity:**

| Level | Scenario | Penalty | Trust Loss |
|-------|----------|---------|------------|
| 1 | Fake UPI Reward (phishing link) | ₹2,000 | -20 |
| 2 | QR Code Fraud (fake "receive money" QR) | ₹5,000 | -20 |
| 3 | Bank Impersonator (KYC scam, asks for OTP/CVV) | ₹10,000 | -30 |

Success on any level grants +10 Trust and unlocks the next level.

---

## SMS Interception

The app includes a custom Expo native module (`modules/expo-sms-interceptor/`) that:

1. Registers an Android `BroadcastReceiver` for `SMS_RECEIVED_ACTION`
2. Extracts message body and sender from incoming PDUs
3. Emits an `onSmsReceived` event to JavaScript
4. The JS listener in `App.tsx` pipes the message through `analyzeScamText()`
5. If flagged as scam → dispatches `SET_SMS_ALERT` → shows `SmsInterceptorModal`

**Permissions required:**
- `android.permission.READ_SMS`
- `android.permission.RECEIVE_SMS`

These are declared in `app.json` and also requested at runtime via `PermissionsAndroid.request()`.

**Demo fallback:** A "Simulate Scam SMS" button on the Dashboard dispatches a fake Hindi lottery scam message through the same pipeline — no real SMS needed.

---

## Scam Detection Engine

Located in `src/services/aiDetection.ts`, the engine uses a two-stage pipeline:

### Stage 1: Translation

```
Input message → Language detection → Bhashini API (if configured) → Mock fallback → English text
```

The mock translation maps 200+ Hindi/Assamese keywords to English equivalents. It is designed to **never throw** — any error falls back to returning the original text.

### Stage 2: Heuristic Pattern Matching

| Pattern | Trigger Condition | Example |
|---------|-------------------|---------|
| A: Urgency + Link | "account blocked" + `http://...` | "Your KYC expired, click here" |
| B: Greed + Action | "lottery/reward" + "click/claim" | "You won ₹50,000! Claim now" |
| C: Auth + Warning + Link | "OTP/CVV" + "verify" + link | "Verify your card at..." |
| D: Generic + Link | "free/update" + link | "Free security check: bit.ly/..." |
| E: High Urgency (no link) | 2+ categories match | "OTP expired, account blocked" |
| F: Auth Harvest | "OTP/PIN" + "share/send" | "Please share your OTP" |
| G: Mixed Script | Devanagari/Bengali + scam keywords | Hindi lottery SMS |

The function returns `boolean` and is wrapped in try/catch — it returns `false` (safe) on any error.

---

## Localization

Content is centralized in `src/config/content_locales/` with three locale files (`en.ts`, `hi.ts`, `as.ts`). Each file exports a const object with the full content tree:

```typescript
// Usage in any component:
import { useContent } from "../config/content";

function MyScreen() {
  const content = useContent(); // Automatically uses active language
  return <Text>{content.dashboard.balanceLabel}</Text>;
}
```

Language is switchable at runtime via three toggle buttons on the Dashboard. The selection is persisted to AsyncStorage.

**Supported languages:** English, Hindi (हिन्दी), Assamese (অসমীয়া)

---

## State Management

Global state is managed via React Context + `useReducer` in `src/context/GameContext.tsx`.

### Key State Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `balance` | `number` | 5000 | Virtual wallet balance in ₹ |
| `trustScore` | `number` | 80 | Community trust rating (0-100) |
| `flowStep` | `FlowStep` | `"dashboard"` | Current screen in the game flow |
| `currentLevel` | `number` | 1 | Active mission (1-3) |
| `decision` | `Decision` | `null` | User's choice: `"claim"` or `"report"` |
| `language` | `"en" \| "hi" \| "as"` | `"en"` | Active UI language |
| `voiceEnabled` | `boolean` | `true` | Voice narration toggle |
| `assistedMode` | `boolean` | `false` | Show grandchild teaching tips |
| `activeSmsAlert` | `SmsAlert \| null` | `null` | Intercepted SMS data |

### Persistence

On every level completion, the following are saved to `AsyncStorage` under `bharatquest.*` keys:

```
bharatquest.balance
bharatquest.trustScore
bharatquest.flowStep
bharatquest.decision
bharatquest.currentLevel
bharatquest.language
bharatquest.assistedMode
bharatquest.syncComplete
```

On app launch, `RootNavigator` loads the snapshot and restores state. If the user has progressed past Level 1, onboarding is automatically skipped.

---

## Configuration

### Bhashini API (optional)

To enable real Hindi/Assamese → English translation, edit `src/services/aiDetection.ts`:

```typescript
const BHASHINI_API_KEY = 'your-api-key-here';
const BHASHINI_USER_ID = 'your-user-id';
```

When left empty (default), the app uses the built-in mock translation. This is the **recommended configuration for demos** — it guarantees translation works without network connectivity.

### App Configuration

All Expo settings are in `app.json`:

| Setting | Value | Notes |
|---------|-------|-------|
| `userInterfaceStyle` | `"dark"` | Matches the dark theme |
| `splash.backgroundColor` | `"#0A0E17"` | Prevents white flash on launch |
| `android.permissions` | `READ_SMS`, `RECEIVE_SMS` | Required for SMS interception |
| `android.package` | `com.anonymous.bharatquest_init` | Change for production |

### Design Tokens

All visual constants are in `src/config/theme.ts`:

- **Colors**: 25+ named colors with semantic naming (`failureRed`, `scamGreen`, `trustGold`)
- **Typography**: System fonts, sizes from `xs` (12) to `hero` (48)
- **Spacing**: 7-step scale from `xs` (4) to `xxxl` (48)
- **Timing**: All animation durations centralized (count-up, message reveal, flash, sync)

---

## Demo Controls

### Triple-Tap Reset
Rapidly tap the **"Your Digital Wallet"** title on the Dashboard **3 times** within 500ms to:
- Reset balance to ₹5,000
- Reset trust score to 80/100
- Reset to Level 1
- Clear all persisted AsyncStorage data
- Return to clean initial state

### Simulate Scam SMS
Tap the red **"Simulate Scam SMS"** button in the Demo Tools section on the Dashboard. This dispatches a realistic Hindi lottery scam message through the full interception pipeline, triggering the `SmsInterceptorModal` without requiring a real SMS.

### Voice Toggle
The floating speaker button (bottom-right) toggles voice narration on/off globally.

---

## Dependencies

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0 | Application framework |
| `react-native` | 0.81.5 | UI runtime |
| `react` | 19.1.0 | Component model |
| `@react-navigation/native` | ^7.2 | Screen navigation |
| `@react-navigation/native-stack` | ^7.14 | Native stack navigator |
| `@react-native-async-storage/async-storage` | 2.2.0 | Offline state persistence |
| `expo-speech` | ~14.0 | Text-to-speech voice narration |
| `expo-haptics` | ~15.0 | Vibration feedback on decisions |
| `expo-blur` | ~15.0 | Glassmorphism effects on reward popup |
| `expo-av` | ~16.0 | Audio capabilities |
| `expo-status-bar` | ~3.0 | Status bar styling |
| `react-native-confetti-cannon` | ^1.5 | Success celebration confetti |
| `react-native-safe-area-context` | ~5.6 | Safe area insets |
| `react-native-screens` | ~4.16 | Native screen containers |
| `@expo/vector-icons` | ^15.0 | Material Community Icons |
| `lottie-react-native` | ~7.3 | Animation support |

### Dev

| Package | Purpose |
|---------|---------|
| `typescript` ~5.9 | Type checking (strict mode) |
| `@types/react` ~19.1 | React type definitions |
| `@expo/ngrok` ^4.1 | Remote tunnel for device testing |

---

## Known Limitations

### SMS Interception
- **Android only.** The native `BroadcastReceiver` has no iOS equivalent.
- **Requires a dev build** (`expo run:android`). SMS interception does not work in Expo Go.
- **Requires runtime permission grant.** On Android 6+, the user must explicitly allow `RECEIVE_SMS`.
- The "Simulate Scam SMS" button is the reliable fallback for demos.

### Translation
- **Bhashini API is disabled by default** (empty API key). The mock fallback covers common scam vocabulary but is not a general-purpose translator.
- Mock translation uses keyword replacement, not full sentence translation — grammatical accuracy is not guaranteed.

### Offline
- The app works fully offline for the game flow. SMS detection and translation also work offline (via mock fallback).
- No real cloud sync exists — the "Sync Progress" screen is a simulated animation for the demo.

### Testing
- No automated test suite exists. This is a hackathon MVP optimized for demo reliability over test coverage.
- Manual testing on an Android device with the emulator SMS sender tool is the recommended verification method.

### Content
- Only 3 scam scenarios are implemented. The architecture supports adding more levels by appending to the `levels` array in each locale file.
- Assisted Mode tips are static strings, not dynamically generated.

### Platform
- The app is designed for **portrait, mobile-only** use. It is not optimized for tablets or landscape orientation.
- Web support is limited — SMS, haptics, and speech do not function.

---

## Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Build and run on Android device/emulator
npm run ios        # Build and run on iOS simulator
npm run web        # Start web development server
```

---

## License

This project was built for **HackDays 4.0**. See the repository for license details.

---

*Built with ❤️ for financial empowerment in rural India.*