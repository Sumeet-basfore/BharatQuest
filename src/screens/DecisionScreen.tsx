// BharatQuest – Decision Screen (State 4)
import React from "react";
import { View, StyleSheet } from "react-native";
import { ScreenShell } from "../components/common/ScreenShell";
import { DecisionSheet } from "../components/game/DecisionSheet";
import { useGame } from "../context/GameContext";
import { useContent } from "../config/content";
import { colors } from "../config/theme";

export function DecisionScreen({ navigation }: any) {
  const content = useContent();
  const { state, dispatch } = useGame();

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
      {/* Static dark background instead of live ScamChat (prevents duplicate timers + memory leaks) */}
      <View style={styles.bgOverlay} pointerEvents="none" />
      
      {/* State 4 Overlay */}
      <DecisionSheet onClaim={handleClaim} onReport={handleReport} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.chatBg,
    opacity: 0.5,
  },
});
