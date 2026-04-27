// BharatQuest – Design System Tokens
// Centralized theme for consistent styling across all screens

export const colors = {
  // Core background
  background: "#0A0E17",
  surface: "#111827",
  surfaceLight: "#1F2937",
  cardBg: "#162032",

  // Text
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",

  // Brand & Game
  balanceGreen: "#105C2E",
  trustGold: "#D4AF37",
  trustGoldDim: "#8B7536",

  // Decision buttons
  deceptiveBlue: "#007BFF",
  warningRed: "#DC3545",

  // Consequence states
  successGreen: "#28A745",
  failureRed: "#DC3545",
  flashRed: "rgba(220, 53, 69, 0.65)",
  flashGreen: "rgba(40, 167, 69, 0.55)",

  // Scam UI elements
  scamGreen: "#25D366",     // WhatsApp-like green
  scamCheckmark: "#4CAF50",
  urgencyRed: "#FF1744",

  // Misc
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(0, 0, 0, 0.75)",
  overlayLight: "rgba(0, 0, 0, 0.5)",
  shimmer: "rgba(255, 255, 255, 0.05)",

  // Chat
  chatBubbleNpc: "#1E3A5F",
  chatBubbleUser: "#2E5A3E",
  chatBg: "#0D1117",
  typingIndicator: "#4B5563",
} as const;

export const typography = {
  // Font families — system defaults, no external fonts needed
  fontFamily: "System",

  // Sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 48,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  }),
} as const;

// Timing constants from TDD §11
export const timing = {
  dashboardCountUp: 1500,       // 1.5s count-up animation
  dashboardToReward: 3000,      // 3.0s before reward popup
  rewardToChat: 2500,           // 2.5s reward visible
  chatTypingDelay: 1200,        // 1.2s between messages
  chatMessageReveal: 800,       // 0.8s per message fade-in
  decisionToResult: 0,          // instant on tap
  flashDuration: 400,           // 0.4s full-screen flash
  balanceCountdown: 1500,       // 1.5s balance deduction
  syncDuration: 3000,           // 3.0s Lottie sync
  countdownStart: 179,          // 02:59 in seconds
} as const;
