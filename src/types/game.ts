// BharatQuest – Game State Types
// Derived from TDD §4: Data and state model

export type FlowStep =
  | "dashboard"
  | "reward"
  | "chat"
  | "decision"
  | "result"
  | "sync";

export type Decision = "claim" | "report" | null;

export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface GameState {
  balance: number;
  trustScore: number;
  flowStep: FlowStep;
  chatIndex: number;
  decision: Decision;
  syncStatus: SyncStatus;
  voiceEnabled: boolean;
  lastSpokenMessageId: string | null;
  hasSeenRewardBanner: boolean;
  hasCompletedOnboarding: boolean;
  currentLevel: number;
  language: "en" | "hi" | "as";
  assistedMode: boolean;
  darkMode: boolean;
  fontSize: "small" | "medium" | "large";
}

export type GameAction =
  | { type: "SET_FLOW_STEP"; payload: FlowStep }
  | { type: "SET_DECISION"; payload: Decision }
  | { type: "UPDATE_BALANCE"; payload: number }
  | { type: "UPDATE_TRUST"; payload: number }
  | { type: "SET_CHAT_INDEX"; payload: number }
  | { type: "INCREMENT_CHAT" }
  | { type: "SET_SYNC_STATUS"; payload: SyncStatus }
  | { type: "TOGGLE_VOICE" }
  | { type: "SET_LAST_SPOKEN"; payload: string | null }
  | { type: "MARK_REWARD_SEEN" }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "SET_LEVEL"; payload: number }
  | { type: "SET_LANGUAGE"; payload: "en" | "hi" | "as" }
  | { type: "TOGGLE_ASSISTED_MODE" }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_FONT_SIZE"; payload: "small" | "medium" | "large" }
  | { type: "RESET_GAME" };

export interface ChatMessage {
  id: string;
  role: "npc" | "system" | "user";
  text: string;
  isLink?: boolean;
}

export const INITIAL_BALANCE = 5000;
export const INITIAL_TRUST = 80;
export const FAILURE_PENALTY = 2000;
export const FAILURE_TRUST_LOSS = 20;
export const SUCCESS_TRUST_GAIN = 10;
