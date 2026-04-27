// BharatQuest – Chat Screen (State 3)
import React, { useState } from "react";
import { ScreenShell } from "../components/common/ScreenShell";
import { ScamChat } from "../components/game/ScamChat";
import { VoiceFab } from "../components/common/VoiceFab";
import { useGame } from "../context/GameContext";
import { useVoiceNarration } from "../hooks/useVoiceNarration";
import { content } from "../config/content";

export function ChatScreen({ navigation }: any) {
  const { state, dispatch } = useGame();
  const [isSpeakingWarning, setIsSpeakingWarning] = useState(false);

  // Play warning when phishing link appears
  useVoiceNarration({
    messageId: isSpeakingWarning ? "warning" : null,
    text: content.chat.voiceWarning,
    enabled: state.voiceEnabled,
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
