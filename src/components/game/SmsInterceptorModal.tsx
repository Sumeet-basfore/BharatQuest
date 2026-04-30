import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useGame } from "../../context/GameContext";
import { colors, typography, spacing, shadows, radii } from "../../config/theme";

export const SmsInterceptorModal: React.FC = () => {
  const { state, dispatch } = useGame();
  const alert = state.activeSmsAlert;

  if (!alert) return null;

  const handleBlock = () => {
    // Reward the user for blocking the scam
    dispatch({ type: "UPDATE_BALANCE", payload: state.balance + 500 });
    dispatch({ type: "UPDATE_TRUST", payload: Math.min(100, state.trustScore + 5) });
    dispatch({ type: "SHOW_BADGE", payload: "Scam Defender 🛡️" });
    dispatch({ type: "SET_SMS_ALERT", payload: null });
  };

  const handleClickLink = () => {
    // Penalize the user for clicking the link
    dispatch({ type: "UPDATE_BALANCE", payload: Math.max(0, state.balance - 1000) });
    dispatch({ type: "UPDATE_TRUST", payload: Math.max(0, state.trustScore - 10) });
    dispatch({ type: "SET_SMS_ALERT", payload: null });
  };

  return (
    <Modal transparent visible={!!alert} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🔮</Text>
            <Text style={styles.title}>Fortune Teller Warns!</Text>
          </View>
          
          <ScrollView style={styles.content}>
            <Text style={styles.warningText}>
              A suspicious message intercepted. This looks like a scam targeting your village.
            </Text>
            
            <View style={styles.messageBox}>
              <Text style={styles.senderText}>From: {alert.sender}</Text>
              <Text style={styles.messageText}>{alert.messageBody}</Text>
            </View>

            <Text style={styles.advice}>
              "My crystal ball shows great loss if you follow this path. Real banks never ask for such actions through text."
            </Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.clickButton]} 
              onPress={handleClickLink}
            >
              <Text style={styles.buttonTextSecondary}>Click Link (Risky)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.blockButton]} 
              onPress={handleBlock}
            >
              <Text style={styles.buttonText}>Block & Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    width: "100%",
    maxHeight: "80%",
    overflow: "hidden",
    ...shadows.card,
  },
  header: {
    padding: spacing.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.white,
    textAlign: "center",
  },
  content: {
    padding: spacing.xl,
  },
  warningText: {
    fontSize: typography.md,
    color: colors.urgencyRed,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  messageBox: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radii.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.failureRed,
    marginBottom: spacing.lg,
  },
  senderText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    fontStyle: "italic",
  },
  advice: {
    fontSize: typography.sm,
    color: colors.trustGold,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: spacing.md,
  },
  actions: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  blockButton: {
    backgroundColor: colors.successGreen,
  },
  clickButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.failureRed,
  },
  buttonText: {
    fontSize: typography.md,
    fontWeight: "bold",
    color: colors.white,
  },
  buttonTextSecondary: {
    fontSize: typography.md,
    fontWeight: "bold",
    color: colors.failureRed,
  },
});
