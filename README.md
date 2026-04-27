# 🌾 BharatQuest MVP

**Protect Your Village. Learn to Fight Fraud.**

BharatQuest is a gamified, behavioral financial literacy simulator designed specifically for rural India. Built for a 3-day hackathon, this MVP demonstrates a "Golden Path" experience that teaches users how to identify and defend against sophisticated UPI phishing scams through experiential learning and immediate consequences.

It combines the experiential methodology of the **Banzai platform** with the authoritative regulatory messaging of the **Reserve Bank of India (RBI)**.

---

## ✨ Key Features & The "Wow Factor"

This MVP is built around a rigid, 6-state progression designed for a flawless live demo, elevated with premium UI features:

1. **Dashboard & Mock Ledger**: Starts with a baseline ₹5,000 balance and an 80/100 Trust Score. Features a simulated recent transactions list to establish normalcy.
2. **Deceptive Event Trigger**: A fake "UPI Reward" popup tests the user's vulnerability, enhanced with **glassmorphism (`expo-blur`)** and aggressive **haptic feedback (`expo-haptics`)**.
3. **Voice-First AI Integration**: Simulates a WhatsApp-style scam chat. When a phishing link appears, a voice assistant actively warns the user (`expo-speech`), accompanied by a dynamic, pulsing waveform animation.
4. **Cognitive Friction Decision Gateway**: Forces the user to choose between a tempting, pulsing "Claim Reward" button (Failure) and a stark "Report & Block" button (Success).
5. **Immediate Consequence Engine**:
   - **Failure Branch**: Heavy error vibration, red flash, animated loss of ₹2,000 and 20 Trust points, followed by a severe RBI educational warning ("Jaankaar Baniye, Satark Rahiye!").
   - **Success Branch**: Pleasant success vibration, green flash, trust score boost, and a massive **confetti burst (`react-native-confetti-cannon`)** alongside a "Scam Defender" achievement badge.
6. **Offline-First Simulation**: Culminates in a CSS-animated cloud sync sequence, proving the offline-capable architecture critical for rural "Shadow Zones."

---

## 🛠️ Tech Stack

- **Framework**: React Native + Expo (Managed Workflow)
- **Language**: TypeScript
- **State Management**: React Context API + `useReducer`
- **Persistence**: `@react-native-async-storage/async-storage`
- **UI / Animations**: React Native Animated API, Expo Blur, Expo Haptics, React Native Confetti Cannon
- **Audio / Voice**: Expo Speech, Expo AV

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm, yarn, or pnpm
- Expo Go app on your iOS or Android device (for physical device testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sumeet-basfore/BharatQuest.git
   cd BharatQuest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. **To view on your phone** (Highly Recommended for Haptics & Blur):
   - Scan the QR code in your terminal using the Expo Go app.
5. **To view on the web**:
   - Press `w` in the terminal to open the web simulator.

---

## 💡 Demo Controls

For presentation purposes, the app includes a hidden reset mechanism:
- **One-Tap Reset**: Rapidly tap the "Your Village Farm" title on the Dashboard **3 times** to instantly reset the balance to ₹5,000, Trust Score to 80/100, and restart the demo flow.

---

## 📁 Project Structure

```text
BharatQuest/
├── App.tsx                     # Entry point & Providers
├── src/
│   ├── assets/                 # Generated images & visual assets
│   ├── components/
│   │   ├── common/             # Reusable UI (Buttons, HUDStats, VoiceFab)
│   │   └── game/               # Game-specific UI (Chat, Modals, Overlays)
│   ├── config/
│   │   ├── content.ts          # Centralized copy, scripts, and narrative
│   │   └── theme.ts            # Design tokens (colors, typography, timing)
│   ├── context/
│   │   └── GameContext.tsx     # Global state management
│   ├── hooks/                  # Custom hooks (Voice narration, animations)
│   ├── navigation/             # React Navigation stack
│   ├── screens/                # The 5 primary flow screens
│   ├── services/               # AsyncStorage and Mock APIs
│   └── types/                  # TypeScript interfaces
└── ...
```

---

*Built with ❤️ for financial empowerment in rural India.*