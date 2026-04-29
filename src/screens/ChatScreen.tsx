// BharatQuest – Chat Screen (State 3)
import React, { useState } from "react";
import { ScreenShell } from "../components/common/ScreenShell";
import { ScamChat } from "../components/game/ScamChat";
import { VoiceFab } from "../components/common/VoiceFab";
import { useGame } from "../context/GameContext";
import { useVoiceNarration } from "../hooks/useVoiceNarration";
import { useContent } from "../config/content";

export function ChatScreen({ navigation }: any) {
  const content = useContent();
  const { state, dispatch } = useGame();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const [isSpeakingWarning, setIsSpeakingWarning] = useState(false);

  // Play warning when phishing link appears
  useVoiceNarration({
    messageId: isSpeakingWarning ? "warning" : null,
    text: levelData.chat.voiceWarning,
    enabled: state.voiceEnabled,
    language: state.language === "en" ? "en-IN" : state.language === "hi" ? "hi-IN" : "as-IN",
  });

  const handlePhishingLinkShown = () => {
    setIsSpeakingWarning(true);
  };

  const handleAllMessagesShown = () => {
    dispatch({ type: "SET_FLOW_STEP", payload: "decision" });
    navigation.replace("DecisionScreen");
  };

  return (
    <ScreenShell>
      <ScamChat 
        onPhishingLinkShown={handlePhishingLinkShown}
        onAllMessagesShown={handleAllMessagesShown} 
      />
      <VoiceFab 
        enabled={state.voiceEnabled} 
        isSpeaking={isSpeakingWarning}
        onPress={() => dispatch({ type: "TOGGLE_VOICE" })} 
      />
    </ScreenShell>
  );
}
