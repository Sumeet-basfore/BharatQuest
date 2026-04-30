import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, typography, radii } from "../../config/theme";
import { useGame } from "../../context/GameContext";
import { PrimaryButton } from "../common/PrimaryButton";
import { saveOnboardingComplete } from "../../services/storage";

export function OnboardingModal() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState<number>(0);

  if (state.hasCompletedOnboarding) return null;

  const handleAnswer = (isExperienced: boolean) => {
    // Dynamic adjustment based on diagnostic (Fortune Teller MVP)
    if (!isExperienced) {
      dispatch({ type: "UPDATE_BALANCE", payload: 3000 });
      dispatch({ type: "UPDATE_TRUST", payload: 50 });
    } else {
      dispatch({ type: "UPDATE_BALANCE", payload: 5000 });
      dispatch({ type: "UPDATE_TRUST", payload: 80 });
    }
    setStep(1);
  };

  const completeOnboarding = () => {
    dispatch({ type: "COMPLETE_ONBOARDING" });
    saveOnboardingComplete();
  };

  return (
    <Modal visible={!state.hasCompletedOnboarding} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="crystal-ball" size={48} color={colors.primary} />
          </View>
          
          {step === 0 ? (
            <>
              <Text style={styles.title}>The Fortune Teller</Text>
              <Text style={styles.message}>
                Welcome to BharatQuest. I am the village Fortune Teller. Before you begin managing your farm, tell me:{"\n\n"}
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
                I have adjusted the village economy based on your experience. {"\n\n"}
                Protect your money and trust score from scammers. Good luck!
              </Text>
              <PrimaryButton label="Enter Village" onPress={completeOnboarding} color={colors.primary} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
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
    fontSize: typography.md,
  },
  optionTextYes: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: typography.md,
  },
});
