// BharatQuest – Dashboard Screen (State 1)
import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenShell } from "../components/common/ScreenShell";
import { HUDStat } from "../components/common/HUDStat";
import { FarmBackdrop } from "../components/game/FarmBackdrop";
import { VoiceFab } from "../components/common/VoiceFab";
import { useGame } from "../context/GameContext";
import { colors, spacing, timing, typography, radii } from "../config/theme";
import { content } from "../config/content";
import { PrimaryButton } from "../components/common/PrimaryButton";

export function DashboardScreen({ navigation }: any) {
  const { state, dispatch } = useGame();

  // Hidden triple-tap to reset demo
  let tapCount = 0;
  let tapTimer: NodeJS.Timeout;
  const handleTitleTap = () => {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 500);
    if (tapCount >= 3) {
      dispatch({ type: "RESET_GAME" });
      tapCount = 0;
    }
  };

  useEffect(() => {
    // Only auto-advance if we're at the very beginning of the flow and haven't seen the banner
    if (state.flowStep === "dashboard" && !state.hasSeenRewardBanner) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_FLOW_STEP", payload: "reward" });
        navigation.replace("RewardPopupScreen");
      }, timing.dashboardToReward);
      return () => clearTimeout(timer);
    }
  }, [state.flowStep, state.hasSeenRewardBanner]);

  return (
    <ScreenShell>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={1} onPress={handleTitleTap}>
          <Text style={styles.title}>{content.dashboard.farmTitle}</Text>
        </TouchableOpacity>
        <View style={styles.hudRow}>
          <HUDStat 
            icon="currency-inr" 
            label={content.dashboard.balanceLabel} 
            value={state.balance} 
            iconColor={colors.balanceGreen} 
            animateTo={state.balance} 
          />
          <HUDStat 
            icon="shield-check" 
            label={content.dashboard.trustLabel} 
            value={state.trustScore} 
            suffix="/100" 
            animateTo={state.trustScore} 
            showProgressBar={true}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.backdropContainer}>
          <FarmBackdrop />
        </View>

        {/* Mock Ledger: Recent Transactions to make it look like a real app */}
        <View style={styles.ledgerSection}>
          <Text style={styles.ledgerTitle}>Recent Transactions</Text>
          
          <View style={styles.transactionCard}>
            <View style={styles.txIconContainer}>
              <MaterialCommunityIcons name="wheat" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>Sold Wheat Harvest</Text>
              <Text style={styles.txDate}>Yesterday</Text>
            </View>
            <Text style={[styles.txAmount, { color: colors.successGreen }]}>+₹1,500</Text>
          </View>
          
          <View style={styles.transactionCard}>
            <View style={styles.txIconContainer}>
              <MaterialCommunityIcons name="sprout" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>Bought Seeds</Text>
              <Text style={styles.txDate}>3 Days Ago</Text>
            </View>
            <Text style={styles.txAmount}>-₹300</Text>
          </View>
        </View>

        {/* Show Sync button if returning from ResultScreen */}
        {state.flowStep === "dashboard" && state.decision !== null && (
          <View style={styles.syncBtnContainer}>
            <PrimaryButton 
              label={content.sync.buttonLabel} 
              color={colors.scamGreen} 
              icon="cloud-sync" 
              onPress={() => {
                dispatch({ type: "SET_FLOW_STEP", payload: "sync" });
              }} 
            />
          </View>
        )}
      </ScrollView>

      <VoiceFab 
        enabled={state.voiceEnabled} 
        onPress={() => dispatch({ type: "TOGGLE_VOICE" })} 
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 24, fontWeight: "800", color: colors.textPrimary, textAlign: "center" },
  hudRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  scrollContent: { flex: 1 },
  backdropContainer: { height: 200, marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  ledgerSection: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  ledgerTitle: { fontSize: typography.md, fontWeight: "700", color: colors.textSecondary, marginBottom: spacing.md, textTransform: "uppercase", letterSpacing: 0.5 },
  transactionCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.md, marginBottom: spacing.sm },
  txIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceLight, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  txDetails: { flex: 1 },
  txTitle: { fontSize: typography.md, fontWeight: "600", color: colors.textPrimary },
  txDate: { fontSize: typography.xs, color: colors.textMuted, marginTop: 2 },
  txAmount: { fontSize: typography.md, fontWeight: "700", color: colors.textPrimary },
  syncBtnContainer: { padding: spacing.lg, paddingBottom: spacing.xxxl },
});
