// BharatQuest – All Hardcoded Content
// Per TDD §12: all copy lives in one file so the team can tweak without touching components

import { ChatMessage } from "../types/game";

export const content = {
  // App meta
  appName: "BharatQuest",
  appTagline: "Protect Your Village. Learn to Fight Fraud.",

  // State 1: Dashboard
  dashboard: {
    balanceLabel: "Balance",
    trustLabel: "Trust Score",
    farmTitle: "Your Village Farm",
    voiceGreeting:
      "Welcome to BharatQuest! You are managing your village farm. Keep your balance safe and your trust high.",
  },

  // State 2: Reward popup (fake UPI scam)
  reward: {
    title: "🎉 Congratulations!",
    subtitle: "You have won a UPI Reward of ₹2,000.",
    cta: "Claim immediately.",
    timerLabel: "Offer expires in",
    brandName: "UPI Rewards™",
    brandTag: "Verified Payment Partner",
  },

  // State 3: Scammer chat
  chat: {
    npcName: "Raj Kumar — UPI Support",
    npcRole: "Verified Agent",
    messages: [
      {
        id: "m1",
        role: "npc" as const,
        text: "Hello! Congratulations on winning the ₹2,000 UPI Reward! I am Raj Kumar from the UPI Rewards verification team.",
      },
      {
        id: "m2",
        role: "npc" as const,
        text: "To process your reward, I need to verify your account details. This is a mandatory security step.",
      },
      {
        id: "m3",
        role: "npc" as const,
        text: "⚠️ URGENT: Your account will be BLOCKED if you do not verify within 3 minutes. Please act immediately to avoid losing access to your funds.",
      },
      {
        id: "m4",
        role: "npc" as const,
        text: "👉 Click this secure link to verify and receive your ₹2,000 reward:",
        isLink: false,
      },
      {
        id: "m5",
        role: "npc" as const,
        text: "🔗 https://upi-rewards-verify.secure-pay.in/claim",
        isLink: true,
      },
    ] as ChatMessage[],
    voiceWarning:
      "Caution. Real banks never ask you to click links to receive money. This may be a scam.",
  },

  // State 4: Decision gateway
  decision: {
    title: "What will you do?",
    claimButton: "Claim Reward",
    claimIcon: "gift",
    reportButton: "Report & Block",
    reportIcon: "shield-off",
  },

  // State 5: Consequence engine
  result: {
    failure: {
      flashColor: "red",
      title: "⚠️ You Got Scammed!",
      rbiSlogan: "Jaankaar Baniye, Satark Rahiye!",
      rbiTranslation: "Be Aware, Be Alert!",
      rbiSource: "RBI Kehta Hai",
      explanation:
        "You clicked a fraudulent link. Real banks and UPI services NEVER ask you to click links or share PINs to receive money. Scammers use urgency and fake rewards to trick you into authorizing payments FROM your account.",
      balanceLost: "₹2,000 deducted from your balance!",
      trustLost: "Trust Score dropped by 20 points.",
      tipTitle: "How to Stay Safe:",
      tips: [
        "Never click links from unknown senders",
        "Real rewards don't need your PIN or OTP",
        "Report suspicious messages to your bank",
        "If it sounds too good to be true, it probably is",
      ],
      voiceNarration:
        "You fell for the scam. Two thousand rupees have been stolen from your account. Remember: real banks never ask you to click links or enter PINs to receive funds. Always verify with your bank directly.",
      dismissLabel: "I Understand",
    },
    success: {
      flashColor: "green",
      title: "🛡️ Excellent Decision!",
      badgeTitle: "Scam Defender",
      badgeSubtitle: "You protected your village!",
      explanation:
        "You correctly identified the phishing attempt and reported it! Your quick thinking saved ₹2,000 and protected your village's economy.",
      trustGained: "Trust Score increased by 10 points!",
      celebration:
        "Your neighbors look up to you as a digital safety champion!",
      voiceNarration:
        "Congratulations! You correctly identified the phishing attempt and protected your account. You are now a Scam Defender! Keep protecting your village.",
      dismissLabel: "Continue",
    },
  },

  // State 6: Sync fake-out
  sync: {
    buttonLabel: "Sync Progress",
    syncingText: "Syncing to cloud...",
    successText: "Progress saved!",
    subtitle: "Your achievements have been securely backed up.",
  },

  // Demo reset
  reset: {
    confirmTitle: "Reset Demo?",
    confirmMessage:
      "This will reset balance to ₹5,000 and Trust Score to 80/100.",
    confirmYes: "Reset",
    confirmNo: "Cancel",
  },
} as const;
