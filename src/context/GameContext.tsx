// BharatQuest – Game Context & Reducer
// Per TDD §4: React Context + useReducer for all runtime game state

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  GameState,
  GameAction,
  INITIAL_BALANCE,
  INITIAL_TRUST,
} from "../types/game";

const initialState: GameState = {
  balance: INITIAL_BALANCE,
  trustScore: INITIAL_TRUST,
  flowStep: "dashboard",
  chatIndex: -1,
  decision: null,
  syncStatus: "idle",
  voiceEnabled: true,
  lastSpokenMessageId: null,
  hasSeenRewardBanner: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_FLOW_STEP":
      return { ...state, flowStep: action.payload };
    case "SET_DECISION":
      return { ...state, decision: action.payload };
    case "UPDATE_BALANCE":
      return { ...state, balance: action.payload };
    case "UPDATE_TRUST":
      return { ...state, trustScore: action.payload };
    case "SET_CHAT_INDEX":
      return { ...state, chatIndex: action.payload };
    case "INCREMENT_CHAT":
      return { ...state, chatIndex: state.chatIndex + 1 };
    case "SET_SYNC_STATUS":
      return { ...state, syncStatus: action.payload };
    case "TOGGLE_VOICE":
      return { ...state, voiceEnabled: !state.voiceEnabled };
    case "SET_LAST_SPOKEN":
      return { ...state, lastSpokenMessageId: action.payload };
    case "MARK_REWARD_SEEN":
      return { ...state, hasSeenRewardBanner: true };
    case "RESET_GAME":
      return { ...initialState };
    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
