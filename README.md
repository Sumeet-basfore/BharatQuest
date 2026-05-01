# 🛡️ BharatQuest: Empowering Digital Defense

**India's first gamified behavioral trainer for digital financial literacy — designed for the next 800M users.**

---

##  The Vision
In 2024, India lost over **₹1.25 lakh crore** to digital fraud. Rural users are the most vulnerable, often receiving scam SMS in regional scripts (Hindi, Assamese) that bypass traditional filters. **BharatQuest** transforms "boring" warnings into an immersive game, letting users experience the consequences of scams in a safe, simulated environment.

##  Core Innovations

###  7-Pattern "Heuristic AI" Detection
Built with a custom translation layer, our engine detects scams even in regional scripts:
- **Urgency Traps**: Detects "Account Blocked" or "KYC Expired" pressure tactics.
- **Greed Signals**: Identifies fake lottery, cashback, and reward promises.
- **Mixed-Script Detection**: Analyzes Hindi/Assamese mixed with English (Hinglish).
- **Link-less Analysis**: Catches scams that use social engineering without a URL.

###  Real-Time SMS Interceptor
A custom-built **Kotlin Native Module** that scans incoming SMS on Android. If a scam is detected, the app triggers a real-time intervention, educating the user *before* they click.

###  Voice-First & Multi-Language
Designed for low-literacy users with **Expo Speech (TTS)** and native support for:
-  **Hindi (हिन्दी)**
-  **Assamese (অসমীয়া)**
-  **English**

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core** | React Native (0.81) & Expo (54) |
| **Logic** | TypeScript 5.9 |
| **Native** | Custom Kotlin BroadcastReceiver (SMS Interception) |
| **State** | React Context API + useReducer |
| **Database**| SQLite (expo-sqlite) & Async Storage |
| **AI/ML** | Heuristic Detection Engine + Bhashini Translation API |
| **UX** | Expo Speech (TTS), Expo Haptics, Lottie Animations |

## The Game Loop
Users navigate a structured journey across multiple levels:
1. **Dashboard**: Manage a virtual wallet of ₹5,000.
2. **Mission**: Encounter realistic scenarios (WhatsApp scams, QR code fraud, UPI phishing).
3. **Decision**: Choose an action (Pay, Block, Report, Share).
4. **Result**: Real-time feedback. Wrong choices lead to "lost money" (virtual), while right choices earn badges and trust scores.

## 📁 Project Structure
```text
src/
├── components/game/    # Interactive mission UI, SMS alerts, Reward banners
├── config/            # Localization (EN/HI/AS), Theme, Level definitions
├── context/           # GameState management (Level tracking, Wallet, Inventory)
├── services/          # aiDetection.ts (Heuristic model), database.ts
├── screens/           # Dashboard, Chat, Decision, Result, Onboarding
└── modules/           # expo-sms-interceptor (Custom Native Android Module)
```

## ⚙️ Installation & Setup

1. **Clone & Install**
   ```bash
   npm install
   ```
2. **Run Preview (Web/iOS)**
   ```bash
   npx expo start
   ```
3. **Run Full Experience (Android)**
   *Requires a physical device or emulator for SMS features.*
   ```bash
   npx expo run:android
   ```

##  Demo Controls
- **Simulate Scam**: Use the red button in "Demo Tools" to trigger the SMS Interceptor.
- **Reset Progress**: Triple-tap the "Digital Wallet" title on the Dashboard.
- **Language**: Switch languages live via the Settings toggle.

---

<p align="center">
  <strong>Built for HackDays 4.0</strong><br/>
  "Empowering every citizen to be their own digital shield."
</p>
