// BharatQuest – Welcome Card (Replaces OnboardingModal)
// Shows on HomeScreen for first-time users - non-blocking, dismissible

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, typography, radii, shadows } from "../../config/theme";
import { useGame } from "../../context/GameContext";
import { saveGameSnapshot } from "../../services/storage";
import { PrimaryButton } from "../common/PrimaryButton";

export function WelcomeCard() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (state.hasCompletedOnboarding || dismissed) return null;

  const handleAnswer = async (isExperienced: boolean) => {
    if (!isExperienced) {
      dispatch({ type: "UPDATE_BALANCE", payload: 3000 });
      dispatch({ type: "UPDATE_TRUST", payload: 50 });
    } else {
      dispatch({ type: "UPDATE_BALANCE", payload: 5000 });
      dispatch({ type: "UPDATE_TRUST", payload: 80 });
    }
    setStep(1);
  };

  const completeOnboarding = async () => {
    dispatch({ type: "COMPLETE_ONBOARDING" });
    setDismissed(true);
    await saveGameSnapshot({
      balance: state.balance,
      trustScore: state.trustScore,
      flowStep: state.flowStep,
      decision: state.decision,
      syncComplete: false,
      currentLevel: state.currentLevel,
      language: state.language,
      assistedMode: state.assistedMode,
      onboardingComplete: true,
    });
  };

  const handleDismiss = async () => {
    if (step === 0) {
      setDismissed(true);
      dispatch({ type: "UPDATE_BALANCE", payload: 5000 });
      dispatch({ type: "UPDATE_TRUST", payload: 80 });
      dispatch({ type: "COMPLETE_ONBOARDING" });
      await saveGameSnapshot({
        balance: state.balance,
        trustScore: state.trustScore,
        flowStep: state.flowStep,
        decision: state.decision,
        syncComplete: false,
        currentLevel: state.currentLevel,
        language: state.language,
        assistedMode: state.assistedMode,
        onboardingComplete: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
          <MaterialCommunityIcons name="close" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="crystal-ball" size={32} color={colors.primary} />
        </View>

        {step === 0 ? (
          <>
            <Text style={styles.title}>The Fortune Teller</Text>
            <Text style={styles.message}>
              Welcome to BharatQuest. Before you begin managing your farm, tell me:{"\n"}
              Have you ever used a digital payment app like UPI before?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.optionBtn, styles.optionNo]} onPress={() => handleAnswer(false)}>
                <Text style={styles.optionTextNo}>No, I am new</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.optionBtn, styles.optionYes]} onPress={() => handleAnswer(true)}>
                <Text style={styles.optionTextYes}>Yes, I have</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Your Journey Begins</Text>
            <Text style={styles.message}>
              I've adjusted the village economy based on your experience. {"\n"}
              Protect your money and trust score from scammers. Good luck!
            </Text>
            <PrimaryButton label="Enter Village" onPress={completeOnboarding} color={colors.primary} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.card,
  },
  closeBtn: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
    zIndex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    borderWidth: 2,
  },
  optionNo: {
    borderColor: colors.textMuted,
    backgroundColor: "transparent",
  },
  optionYes: {
    borderColor: colors.primary,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  optionTextNo: {
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: typography.sm,
  },
  optionTextYes: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: typography.sm,
  },
});