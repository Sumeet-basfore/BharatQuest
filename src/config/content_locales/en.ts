import { ChatMessage } from "../../types/game";

export const en = {
  // App meta
  appName: "BharatQuest",
  appTagline: "Protect Your Money. Learn to Fight Fraud.",

  // State 1: Dashboard
  dashboard: {
    balanceLabel: "Balance",
    trustLabel: "Trust Score",
    farmTitle: "Your Digital Wallet",
    voiceGreeting:
      "Welcome to BharatQuest! You are viewing your digital wallet. Keep your balance safe and your trust high.",
    transactionsTitle: "Recent Transactions",
    tx1Title: "Money from Family",
    tx1Date: "Yesterday",
    tx1Amount: "+₹1,500",
    tx2Title: "Mobile Recharge",
    tx2Date: "3 Days Ago",
    tx2Amount: "-₹299",
    missionsTitle: "Scam Defense Missions",
  },

  // Levels
  levels: [
    {
      id: 1,
      title: "1. The Fake UPI Reward",
      reward: {
        title: "🎉 Congratulations!",
        subtitle: "You have won a UPI Reward of ₹2,000.",
        cta: "Claim immediately.",
        timerLabel: "Offer expires in",
        brandName: "UPI Rewards™",
        brandTag: "Verified Payment Partner",
      },
      chat: {
        npcName: "Raj Kumar — UPI Support",
        npcRole: "Verified Agent",
        messages: [
          { id: "m1", role: "npc", text: "Hello! Congratulations on winning the ₹2,000 UPI Reward! I am Raj Kumar from the UPI Rewards verification team." },
          { id: "m2", role: "npc", text: "To process your reward, I need to verify your account details. This is a mandatory security step." },
          { id: "m3", role: "npc", text: "⚠️ URGENT: Your account will be BLOCKED if you do not verify within 3 minutes. Please act immediately to avoid losing access to your funds." },
          { id: "m4", role: "npc", text: "👉 Click this secure link to verify and receive your ₹2,000 reward:", isLink: false },
          { id: "m5", role: "npc", text: "🔗 https://upi-rewards-verify.secure-pay.in/claim", isLink: true },
        ] as ChatMessage[],
        voiceWarning: "Caution. Real banks never ask you to click links to receive money. This may be a scam.",
      },
      decision: {
        title: "What will you do?",
        claimButton: "Claim Reward",
        claimIcon: "gift",
        reportButton: "Report & Block",
        reportIcon: "shield-off",
      },
      result: {
        failure: {
          flashColor: "red",
          title: "⚠️ You Got Scammed!",
          rbiSlogan: "Jaankaar Baniye, Satark Rahiye!",
          rbiTranslation: "Be Aware, Be Alert!",
          rbiSource: "RBI Kehta Hai",
          explanation: "You clicked a fraudulent link. Real banks and UPI services NEVER ask you to click links or share PINs to receive money. Scammers use urgency and fake rewards to trick you into authorizing payments FROM your account.",
          balanceLost: "₹2,000 deducted from your balance!",
          trustLost: "Trust Score dropped by 20 points.",
          tipTitle: "How to Stay Safe:",
          tips: [
            "Never click links from unknown senders",
            "Real rewards don't need your PIN or OTP",
            "Report suspicious messages to your bank",
            "If it sounds too good to be true, it probably is",
          ],
          voiceNarration: "You fell for the scam. Two thousand rupees have been stolen from your account. Remember: real banks never ask you to click links or enter PINs to receive funds. Always verify with your bank directly.",
          dismissLabel: "I Understand",
          grandchildTip: "Tip for Grandchild: Explain that scammers create fake urgency. Show them how to check if a website link looks suspicious.",
        },
        success: {
          flashColor: "green",
          title: "🛡️ Excellent Decision!",
          badgeTitle: "Scam Defender",
          badgeSubtitle: "You protected your community!",
          explanation: "You correctly identified the phishing attempt and reported it! Your quick thinking saved ₹2,000 and protected your community's economy.",
          trustGained: "Trust Score increased by 10 points!",
          celebration: "Your neighbors look up to you as a digital safety champion!",
          voiceNarration: "Congratulations! You correctly identified the phishing attempt and protected your account. You are now a Scam Defender! Keep protecting your community.",
          dismissLabel: "Continue",
          grandchildTip: "Tip for Grandchild: Congratulate them! Ask them what made them realize it was a scam to reinforce their learning.",
        },
      },
    },
    {
      id: 2,
      title: "2. The QR Code Fraud",
      reward: {
        title: "💸 Subsidy Pending!",
        subtitle: "You are eligible for a ₹5,000 scheme benefit.",
        cta: "Scan to Receive",
        timerLabel: "Transaction expires in",
        brandName: "Govt Subsidy Portal",
        brandTag: "Official Alert",
      },
      chat: {
        npcName: "Amit Singh — Scheme Officer",
        npcRole: "Govt Official",
        messages: [
          { id: "m1", role: "npc", text: "Namaste! You have been selected for a ₹5,000 rural development subsidy." },
          { id: "m2", role: "npc", text: "To receive this money directly into your bank account, please scan the QR code I am sending you." },
          { id: "m3", role: "npc", text: "This is a direct 'Receive Money' QR code. Your funds are ready to be transferred." },
          { id: "m4", role: "npc", text: "Once you scan it, the funds will be credited instantly." },
          { id: "m5", role: "npc", text: "🖼️ [QR Code Image: SCAN TO RECEIVE ₹5,000]", isLink: true },
        ] as ChatMessage[],
        voiceWarning: "Caution. You only need to scan a QR code or enter your UPI PIN when you are PAYING money, never when receiving.",
      },
      decision: {
        title: "What will you do?",
        claimButton: "Scan QR Code",
        claimIcon: "qrcode-scan",
        reportButton: "Decline & Block",
        reportIcon: "shield-off",
      },
      result: {
        failure: {
          flashColor: "red",
          title: "⚠️ You Got Scammed!",
          rbiSlogan: "Jaankaar Baniye, Satark Rahiye!",
          rbiTranslation: "Be Aware, Be Alert!",
          rbiSource: "RBI Kehta Hai",
          explanation: "You scanned the QR code. Scanning a QR code and entering your UPI PIN ALWAYS deducts money from your account. Scammers trick you into thinking you are receiving money when you are actually sending it.",
          balanceLost: "₹5,000 deducted from your balance!",
          trustLost: "Trust Score dropped by 20 points.",
          tipTitle: "How to Stay Safe:",
          tips: [
            "QR codes are only for SENDING money, never for receiving",
            "Never enter your UPI PIN to receive money",
            "Verify the exact name that appears after scanning",
            "Report fraudulent merchants to your bank",
          ],
          voiceNarration: "You fell for the scam. Five thousand rupees have been stolen from your account. Remember: you never need to scan a QR code or enter your UPI PIN to receive money. Scanning a QR code means you are paying someone.",
          dismissLabel: "I Understand",
          grandchildTip: "Tip for Grandchild: Remind them that entering a UPI PIN is like handing over cash. If they are receiving money, the PIN is never needed.",
        },
        success: {
          flashColor: "green",
          title: "🛡️ Excellent Decision!",
          badgeTitle: "Smart Citizen",
          badgeSubtitle: "You saw through the trick!",
          explanation: "You correctly identified that QR codes are only for paying, not receiving. Your knowledge protected your hard-earned money.",
          trustGained: "Trust Score increased by 10 points!",
          celebration: "Other community members are learning from your smart digital habits!",
          voiceNarration: "Congratulations! You correctly identified the QR code scam. You knew that scanning a QR code is only for paying money. Keep protecting your community.",
          dismissLabel: "Continue",
          grandchildTip: "Tip for Grandchild: Great job! Tell them they can always call you if someone sends a QR code they are unsure about.",
        },
      },
    },
    {
      id: 3,
      title: "3. The Bank Impersonator",
      reward: {
        title: "🏦 KYC Alert!",
        subtitle: "Your bank account requires immediate KYC update.",
        cta: "Update Now",
        timerLabel: "Account freezes in",
        brandName: "State Bank Support",
        brandTag: "Official Alert",
      },
      chat: {
        npcName: "Priya Sharma — Bank KYC Team",
        npcRole: "Bank Official",
        messages: [
          { id: "m1", role: "npc", text: "Dear Customer, your bank account KYC has expired. Your account will be frozen in 24 hours." },
          { id: "m2", role: "npc", text: "To prevent your account from being blocked, we need to update your KYC immediately." },
          { id: "m3", role: "npc", text: "Please share your 16-digit ATM card number and the CVV on the back for verification." },
          { id: "m4", role: "npc", text: "We have also sent a 6-digit OTP to your mobile number. Please share it to complete the process.", isLink: true },
          { id: "m5", role: "npc", text: "⚠️ Do not ignore this message, or you will lose access to your funds.", isLink: false },
        ] as ChatMessage[],
        voiceWarning: "Caution. Bank officials will NEVER ask for your CVV, ATM card details, or OTP over chat or a phone call.",
      },
      decision: {
        title: "What will you do?",
        claimButton: "Share Details",
        claimIcon: "card-account-details",
        reportButton: "Ignore & Report",
        reportIcon: "shield-off",
      },
      result: {
        failure: {
          flashColor: "red",
          title: "⚠️ You Got Scammed!",
          rbiSlogan: "Jaankaar Baniye, Satark Rahiye!",
          rbiTranslation: "Be Aware, Be Alert!",
          rbiSource: "RBI Kehta Hai",
          explanation: "You shared your card details and OTP. Scammers posing as bank officials use these details to make unauthorized transactions from your account. Banks NEVER ask for these sensitive details.",
          balanceLost: "₹10,000 deducted from your balance!",
          trustLost: "Trust Score dropped by 30 points.",
          tipTitle: "How to Stay Safe:",
          tips: [
            "Never share your OTP, PIN, or CVV with anyone",
            "Banks will never ask for your card details over a call or chat",
            "Visit your branch for KYC updates",
            "Always call the official bank number on your card",
          ],
          voiceNarration: "You fell for the scam. Ten thousand rupees have been stolen from your account. Remember: bank officials will never ask for your OTP or card details. If someone asks for an OTP, it is a scam.",
          dismissLabel: "I Understand",
          grandchildTip: "Tip for Grandchild: Explain that OTPs are like keys to their house. You never give your keys to a stranger calling on the phone.",
        },
        success: {
          flashColor: "green",
          title: "🛡️ Excellent Decision!",
          badgeTitle: "Privacy Protector",
          badgeSubtitle: "You guarded your secrets!",
          explanation: "You correctly refused to share your sensitive banking details. You know that banks never ask for OTPs or CVVs over chat.",
          trustGained: "Trust Score increased by 10 points!",
          celebration: "Your financial security is an inspiration to the community!",
          voiceNarration: "Congratulations! You correctly identified the bank impersonator. You knew to never share your OTP or card details. Your account is safe.",
          dismissLabel: "Continue",
          grandchildTip: "Tip for Grandchild: Tell them you are proud of them! Reiterate that real bank work is done at the branch or through the official app.",
        },
      },
    }
  ],
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
    confirmMessage: "This will reset balance to ₹5,000 and Trust Score to 80/100.",
    confirmYes: "Reset",
    confirmNo: "Cancel",
  },
  
  // Settings & Sharing
  settings: {
    language: "Language",
    assistedMode: "Assisted Mode",
    assistedModeDesc: "Show tips for teaching relatives",
    voiceNarration: "Voice Narration",
  },
  share: {
    button: "Share on WhatsApp",
    message: "I just proved my digital safety on BharatQuest! I am a Scam Defender with a Trust Score of {score}/100. Protect your digital wallet too! Can you beat my score?",
  }
} as const;
