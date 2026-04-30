<p align="center">
  <h1 align="center">🛡️ BharatQuest</h1>
  <p align="center"><strong>India's first gamified scam defense trainer — built for the 800M who are most vulnerable.</strong></p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Expo-54-000020?logo=expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?logo=android" />
  <img src="https://img.shields.io/badge/Offline-First-28A745" />
</p>

---

> **BharatQuest intercepts real SMS messages, detects scam patterns using heuristic AI, and teaches users to protect their money — through consequences they feel, not lectures they forget.**
>
> It works offline. It speaks Hindi, English, and Assamese. It runs on the cheapest Android phones. And it needs zero internet to save a family from losing ₹10,000 to a fake KYC scam.

---

## 🔥 Why This Matters

- **₹1.25 lakh crore** lost to digital fraud in India in 2024 alone ([RBI Annual Report](https://www.rbi.org.in))
- Rural users receive scam SMS in **Hindi, Assamese, and mixed scripts** — existing tools don't understand these languages
- Traditional awareness campaigns **don't work** — people forget warnings, but they remember losing money
- BharatQuest makes them **experience the loss in a safe simulation** so they recognize real scams before it's too late

---

## ⚡ Key Highlights

| | Feature | Why It Matters |
|---|---------|----------------|
| 📱 | **Real-time SMS Interception** | Custom Android native module scans every incoming SMS for scam patterns |
| 🧠 | **7-Pattern Heuristic AI** | Detects urgency traps, phishing links, OTP harvesting, and mixed-script scams |
| 🌐 | **3 Languages** | Full UI + content in English, Hindi (हिन्दी), and Assamese (অসমীয়া) — switchable live |
| 📴 | **100% Offline** | No internet needed. No API keys needed. Works in India's "shadow zones" |
| 🎮 | **Consequence-Driven Learning** | Wrong choice = ₹ deducted + trust lost. Right choice = badge + confetti |
| 🗣️ | **Voice-First Design** | Text-to-speech warnings for low-literacy users |

---

## 🎯 Demo Flow (For Judges)

Here's how to experience BharatQuest in **under 2 minutes**:

### Step 1 — Open the App
You land on the **Dashboard** showing a ₹5,000 wallet balance and 80/100 Trust Score.

### Step 2 — Simulate a Scam SMS
Tap the red **"Simulate Scam SMS"** button in the Demo Tools section. This sends a realistic Hindi lottery scam through the full detection pipeline.

### Step 3 — AI Detects the Scam
The heuristic engine analyzes the message, identifies it as a scam (greed + action + mixed script), and triggers an **alert modal** with the threat analysis.

### Step 4 — Play a Scam Mission
Tap any **active mission** on the Dashboard. You'll experience:
- A **fake reward popup** designed to look legitimate
- A **WhatsApp-style scam chat** with a convincing NPC
- A **voice warning** when the phishing link appears
- A **decision point**: Claim the reward or Report & Block?

### Step 5 — See the Consequence
- **Wrong choice** → Red flash, haptic buzz, ₹2,000 deducted, trust drops, RBI warning displayed
- **Right choice** → Green flash, confetti burst, "Scam Defender" badge earned

### Step 6 — Reset for Next Judge
**Triple-tap** the "Your Digital Wallet" title → instant clean reset to ₹5,000 / 80 trust / Level 1.

> 💡 **Pro tip:** Try switching to **Hindi (HI)** in Settings before running a mission — the entire experience transforms.

---

## 🏗️ Architecture

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

**Design patterns:**
- **Context + useReducer** — 17 action types, single source of truth
- **Screen-per-state** navigation with `fade` transitions
- **Service layer** — storage, detection, and translation decoupled from UI
- **Locale-driven content** — all strings loaded from locale files, zero hardcoding

---

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/Sumeet-basfore/BharatQuest.git
cd BharatQuest
npm install

# Option 1: Quick preview (no SMS features)
npx expo start

# Option 2: Full native build (SMS interception enabled)
npx expo run:android
```

> **Requirements:** Node.js v18+, npm, Android device/emulator. SMS interception requires a native build (`expo run:android`), not Expo Go.

---

## 🎮 Game Flow

```
Dashboard ──▶ Reward Popup ──▶ Scam Chat ──▶ Decision ──▶ Result ──▶ Sync
(Wallet)      (Fake offer)    (NPC scam)    (Claim/Report) (Win/Lose) (Cloud)
```

**Three escalating missions:**

| Level | Scenario | Penalty (if fooled) | Trust Lost |
|:-----:|----------|:-------------------:|:----------:|
| 1 | Fake UPI Reward — phishing link | ₹2,000 | -20 |
| 2 | QR Code Fraud — fake "receive money" | ₹5,000 | -20 |
| 3 | Bank Impersonator — KYC scam, asks for OTP/CVV | ₹10,000 | -30 |

Correct decisions earn **+10 Trust** and unlock the next level.

---

## 📱 SMS Interception

Custom Expo native module written in Kotlin (`modules/expo-sms-interceptor/`):

1. Android `BroadcastReceiver` listens for `SMS_RECEIVED_ACTION`
2. Extracts message body + sender from incoming PDUs
3. Emits `onSmsReceived` event to JavaScript
4. JS listener pipes message through `analyzeScamText()`
5. If flagged → `SmsInterceptorModal` shows threat alert

**Permissions:** `READ_SMS` + `RECEIVE_SMS` — declared in `app.json`, requested at runtime.

**Demo fallback:** The "Simulate Scam SMS" button triggers the exact same pipeline with no real SMS needed.

---

## 🧠 Scam Detection Engine

Two-stage pipeline in `src/services/aiDetection.ts`:

**Stage 1 — Translation:** Hindi/Assamese → English via Bhashini API (if configured) or built-in mock translator (200+ keyword mappings). **Never throws** — always returns usable text.

**Stage 2 — 7 Heuristic Patterns:**

| Pattern | Detection Logic | Example |
|---------|-----------------|---------|
| A | Urgency + Link | "KYC expired, click here" |
| B | Greed + Action | "You won ₹50,000! Claim now" |
| C | Auth + Warning + Link | "Verify your card at..." |
| D | Generic + Link | "Free security check: bit.ly/..." |
| E | High Urgency (no link) | "OTP expired, account blocked" |
| F | Auth Harvest | "Please share your OTP" |
| G | Mixed Script | Devanagari/Bengali + scam keywords |

Wrapped in try/catch — returns `false` (safe) on any error. **Zero crash risk.**

---

## 🌐 Localization

Three full locale files in `src/config/content_locales/`:

- `en.ts` — English (251 lines)
- `hi.ts` — Hindi (246 lines)
- `as.ts` — Assamese (246 lines)

```typescript
const content = useContent(); // Auto-selects based on active language
```

Switchable at runtime via Dashboard toggle. Selection persists across app restarts.

---

## 📁 Project Structure

```
BharatQuest/
├── App.tsx                           # Entry: GameProvider + SmsListener + Navigator
├── app.json                          # Expo config (permissions, splash, icons)
│
├── modules/expo-sms-interceptor/     # Custom native Android module
│   ├── android/.../ExpoSmsInterceptorModule.kt
│   ├── android/.../SmsReceiver.kt    # BroadcastReceiver
│   └── src/                          # TS bindings + web stub
│
└── src/
    ├── components/
    │   ├── common/                   # HUDStat, PrimaryButton, ScreenShell, VoiceFab
    │   └── game/                     # ScamChat, ConsequenceModal, DecisionSheet,
    │                                 # OnboardingModal, RewardBanner, SmsInterceptorModal,
    │                                 # FarmBackdrop, SyncOverlay
    ├── config/
    │   ├── theme.ts                  # Colors, typography, spacing, animation timing
    │   ├── content.ts                # useContent() hook — locale router
    │   └── content_locales/          # en.ts, hi.ts, as.ts
    ├── context/GameContext.tsx        # React Context + useReducer (17 actions)
    ├── hooks/                        # useVoiceNarration, useAnimatedValue
    ├── navigation/RootNavigator.tsx   # 5-screen native stack
    ├── screens/                      # Dashboard, Reward, Chat, Decision, Result
    ├── services/
    │   ├── aiDetection.ts            # Translation + heuristic scam detection
    │   └── storage.ts                # AsyncStorage persistence layer
    └── types/game.ts                 # GameState, GameAction, FlowStep, Decision
```

---

## ⚙️ State Management

React Context + `useReducer` with 17 action types.

| Field | Default | Description |
|-------|---------|-------------|
| `balance` | ₹5,000 | Virtual wallet balance |
| `trustScore` | 80/100 | Community trust rating |
| `currentLevel` | 1 | Active mission (1–3) |
| `language` | `"en"` | UI language (`en` / `hi` / `as`) |
| `voiceEnabled` | `true` | Text-to-speech toggle |
| `assistedMode` | `false` | Intergenerational teaching tips |

**Persistence:** All state saved to `AsyncStorage` under `bharatquest.*` keys. Restored on app launch. Onboarding auto-skipped if user has progressed past Level 1.

---

## 🔧 Configuration

### Bhashini API (optional — disabled by default)

```typescript
// src/services/aiDetection.ts
const BHASHINI_API_KEY = ''; // Leave empty for offline demo (recommended)
const BHASHINI_USER_ID = '';
```

> **For demos:** Keep these empty. The built-in mock translator works offline and covers all scam vocabulary.

### Key `app.json` Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `userInterfaceStyle` | `"dark"` | Dark theme |
| `splash.backgroundColor` | `"#0A0E17"` | No white flash on launch |
| `android.permissions` | `READ_SMS`, `RECEIVE_SMS` | SMS interception |

---

## 🎮 Demo Controls

| Control | How | What It Does |
|---------|-----|-------------|
| **Reset Demo** | Triple-tap "Your Digital Wallet" title | Resets to ₹5,000, 80 trust, Level 1, clears storage |
| **Simulate SMS** | Red button in Demo Tools section | Sends fake Hindi scam through full detection pipeline |
| **Voice Toggle** | Floating speaker button (bottom-right) | Toggles TTS narration on/off |
| **Language Switch** | EN / HI / AS buttons in Settings | Changes entire UI + content language live |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native 0.81 + Expo 54 |
| **Language** | TypeScript 5.9 (strict mode) |
| **Navigation** | React Navigation 7 (native-stack) |
| **State** | Context API + useReducer |
| **Persistence** | AsyncStorage |
| **Voice** | expo-speech |
| **Haptics** | expo-haptics |
| **Effects** | expo-blur, react-native-confetti-cannon |
| **Icons** | @expo/vector-icons (Material Community) |
| **Native Module** | Custom Kotlin BroadcastReceiver |

---

## ⚠️ Known Limitations

| Area | Limitation | Workaround |
|------|-----------|------------|
| **SMS** | Android only, requires native build | "Simulate SMS" button for demos |
| **Translation** | Mock translator, not full NLP | Covers 200+ scam keywords — sufficient for detection |
| **Sync** | Cloud sync is simulated | Deliberate UX choice for offline-first demo |
| **Tests** | No automated test suite | Hackathon MVP — optimized for demo reliability |
| **Platform** | Portrait mobile only | Designed for the most common rural use case |

---

## 📜 Scripts

```bash
npm start          # Expo dev server
npm run android    # Native Android build
npm run ios        # iOS simulator
npm run web        # Web (limited features)
```

---

<p align="center">
  <strong>Built for HackDays 4.0</strong><br/>
  <em>Because financial literacy shouldn't be a privilege — it should be an experience.</em>
</p>

---

*Built with ❤️ for financial empowerment in rural India.*