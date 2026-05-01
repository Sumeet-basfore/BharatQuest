# 🛡️ BharatQuest

**India's first gamified scam defense trainer — built for the 800M who are most vulnerable.**

---

## Why It Matters

- **₹1.25 lakh crore** lost to digital fraud in India in 2024 (RBI)
- Rural users receive scam SMS in Hindi, Assamese, and mixed scripts
- Traditional warnings don't work — people forget, but they remember losing money
- BharatQuest makes them **experience the loss** in a safe simulation

## Key Features

| Feature | What It Does |
|---------|-------------|
| 📱 **Real-time SMS Interception** | Scans every incoming SMS for scam patterns |
| 🧠 **7-Pattern AI Detection** | Urgency traps, phishing links, OTP harvesting, mixed-script |
| 🌐 **3 Languages** | English, Hindi (हिन्दी), Assamese (অসমীয়া) — switchable live |
| 📴 **100% Offline** | No internet needed. Works in India's "shadow zones" |
| 🎮 **Consequence-Driven** | Wrong choice = money deducted. Right = badge |
| 🗣️ **Voice-First** | Text-to-speech warnings for low-literacy users |

## Quick Demo (Under 2 Minutes)

1. **Open App** → Dashboard shows ₹5,000 wallet + 80 Trust Score
2. **Tap "Simulate Scam SMS"** → Sends a Hindi lottery scam through detection
3. **AI Detects** → Shows threat analysis alert
4. **Play a Mission** → Fake offer → WhatsApp-style chat → Decision point
5. **See Consequence** → Wrong = ₹ deducted, trust drops / Right = confetti + badge
6. **Reset** → Triple-tap "Digital Wallet" title

> Pro tip: Switch to **Hindi** in Settings before running a mission

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 + Expo 54 |
| Language | TypeScript 5.9 |
| Navigation | React Navigation 7 |
| State | Context API + useReducer |
| Voice | expo-speech |
| Haptics | expo-haptics |
| Effects | expo-blur, confetti-cannon |
| Native | Custom Kotlin BroadcastReceiver |

## Get Started

```bash
npm install
npx expo start          # Quick preview
npx expo run:android    # Full native build (SMS features)
```

> **Requirements:** Node.js v18+, Android device/emulator

## Architecture

```
App.tsx → GameProvider → RootNavigator → Screens
                              ↓
                    SmsListener (Native Module)
                              ↓
                    analyzeScamText() → SmsInterceptorModal
```

## Project Structure

```
src/
├── components/game/    # ScamChat, DecisionSheet, RewardBanner...
├── config/            # theme.ts, content_locales/
├── context/           # GameContext.tsx (17 actions)
├── navigation/        # RootNavigator.tsx
├── screens/           # Dashboard, Reward, Chat, Decision, Result
├── services/         # aiDetection.ts, storage.ts
└── types/             # game.ts
```

## Demo Controls

- **Reset**: Triple-tap "Digital Wallet" title
- **Simulate Scam SMS**: Red button in Demo Tools
- **Voice Toggle**: Floating speaker button
- **Language Switch**: EN/HI/AS in Settings

---

<p align="center">
  <strong>Built for HackDays 4.0</strong><br/>
  Financial literacy shouldn't be a privilege — it should be an experience.
</p>