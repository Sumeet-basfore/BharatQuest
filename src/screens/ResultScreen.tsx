// BharatQuest – Result Screen (State 5)
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { ScreenShell } from "../components/common/ScreenShell";
import { ConsequenceModal } from "../components/game/ConsequenceModal";
import { SyncOverlay } from "../components/game/SyncOverlay";
import { HUDStat } from "../components/common/HUDStat";
import { FarmBackdrop } from "../components/game/FarmBackdrop";
import { useGame } from "../context/GameContext";
import { useVoiceNarration } from "../hooks/useVoiceNarration";
import { colors, spacing } from "../config/theme";
import { useContent } from "../config/content";
import { FAILURE_PENALTY, FAILURE_TRUST_LOSS, SUCCESS_TRUST_GAIN } from "../types/game";
import { saveGameSnapshot } from "../services/storage";

const { width, height } = Dimensions.get("window");

export function ResultScreen({ navigation }: any) {
  const content = useContent();
  const { state, dispatch } = useGame();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const [showSync, setShowSync] = useState(false);
  const isFail = state.decision === "claim";
  const [showConfetti, setShowConfetti] = useState(!isFail);

  // Animated flash overlay — fades out after 400ms
  const flashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Narration
  useVoiceNarration({
    messageId: isFail ? "result_fail" : "result_success",
    text: isFail ? levelData.result.failure.voiceNarration : levelData.result.success.voiceNarration,
    enabled: state.voiceEnabled,
    language: state.language === "en" ? "en-IN" : state.language === "hi" ? "hi-IN" : "as-IN",
  });

  useEffect(() => {
    // Apply consequence — clamp values to valid ranges
    let newBalance = state.balance;
    let newTrust = state.trustScore;
    let newLevel = state.currentLevel;

    if (isFail) {
      newBalance = Math.max(0, state.balance - FAILURE_PENALTY);
      newTrust = Math.max(0, state.trustScore - FAILURE_TRUST_LOSS);
    } else {
      newTrust = Math.min(100, state.trustScore + SUCCESS_TRUST_GAIN);
      if (state.currentLevel < content.levels.length) {
         newLevel = state.currentLevel + 1;
         dispatch({ type: "SET_LEVEL", payload: newLevel });
      }
    }

    dispatch({ type: "UPDATE_BALANCE", payload: newBalance });
    dispatch({ type: "UPDATE_TRUST", payload: newTrust });
    
    // Save to async storage
    saveGameSnapshot({
      balance: newBalance,
      trustScore: newTrust,
      flowStep: "dashboard", // Demo is effectively done, return to dashboard
      decision: state.decision,
      syncComplete: false,
      currentLevel: newLevel,
      language: state.language,
      assistedMode: state.assistedMode,
    });
  }, []);

  const handleDismissResult = () => {
    setShowConfetti(false);
    dispatch({ type: "SET_FLOW_STEP", payload: "sync" });
    setShowSync(true);
  };

  const handleSyncComplete = () => {
    dispatch({ type: "SET_FLOW_STEP", payload: "dashboard" });
    navigation.replace("DashboardScreen");
  };

  return (
    <ScreenShell>
      <View style={styles.header}>
        <View style={styles.hudRow}>
          <HUDStat 
            icon="currency-inr" 
            label={content.dashboard.balanceLabel} 
            value={state.balance} 
            iconColor={colors.balanceGreen} 
            flashColor={isFail ? colors.failureRed : colors.successGreen}
          />
          <HUDStat 
            icon="shield-check" 
            label={content.dashboard.trustLabel} 
            value={state.trustScore} 
            suffix="/100" 
            flashColor={isFail ? colors.failureRed : colors.successGreen}
            showProgressBar={true}
          />
        </View>
      </View>

      <View style={styles.content}>
        <FarmBackdrop />
      </View>

      {/* Animated flash — fades out after 400ms */}
      <Animated.View
        style={[
          styles.flash,
          {
            backgroundColor: isFail ? colors.flashRed : colors.flashGreen,
            opacity: flashOpacity,
          },
        ]}
        pointerEvents="none"
      />

      {/* State 5 Consequence Modal */}
      {!showSync && <ConsequenceModal branch={isFail ? "claim" : "report"} onDismiss={handleDismissResult} />}

      {/* State 6 Sync Overlay */}
      {showSync && <SyncOverlay onComplete={handleSyncComplete} />}

      {/* Confetti overlay for success */}
      {showConfetti && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <ConfettiCannon
            count={200}
            origin={{ x: width / 2, y: -20 }}
            fallSpeed={3000}
            explosionSpeed={350}
            colors={[colors.trustGold, colors.successGreen, colors.deceptiveBlue, '#FFFFFF']}
          />
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, paddingBottom: 0 },
  hudRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  content: { flex: 1 },
  flash: { ...StyleSheet.absoluteFillObject, zIndex: 65 },
});
