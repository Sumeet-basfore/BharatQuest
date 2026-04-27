// BharatQuest – Decision Screen (State 4)
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ScreenShell } from "../components/common/ScreenShell";
import { ScamChat } from "../components/game/ScamChat";
import { DecisionSheet } from "../components/game/DecisionSheet";
import { useGame } from "../context/GameContext";

export function DecisionScreen({ navigation }: any) {
  const { dispatch } = useGame();

  const handleClaim = () => {
    dispatch({ type: "SET_DECISION", payload: "claim" });
    dispatch({ type: "SET_FLOW_STEP", payload: "result" });
    navigation.replace("ResultScreen");
  };

  const handleReport = () => {
    dispatch({ type: "SET_DECISION", payload: "report" });
    dispatch({ type: "SET_FLOW_STEP", payload: "result" });
    navigation.replace("ResultScreen");
  };

  return (
    <ScreenShell>
      {/* Background stays as ChatScreen */}
      <View style={styles.bgOverlay} pointerEvents="none">
        <ScamChat 
          onPhishingLinkShown={() => {}} 
          onAllMessagesShown={() => {}} 
        />
      </View>
      
      {/* State 4 Overlay */}
      <DecisionSheet onClaim={handleClaim} onReport={handleReport} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  bgOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.5 },
});
