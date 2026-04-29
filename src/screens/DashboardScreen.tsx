// BharatQuest – Dashboard Screen (State 1)
import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenShell } from "../components/common/ScreenShell";
import { HUDStat } from "../components/common/HUDStat";
import { FarmBackdrop } from "../components/game/FarmBackdrop";
import { OnboardingModal } from "../components/game/OnboardingModal";
import { VoiceFab } from "../components/common/VoiceFab";
import { useGame } from "../context/GameContext";
import { colors, spacing, timing, typography, radii, shadows } from "../config/theme";
import { useContent } from "../config/content";
import { PrimaryButton } from "../components/common/PrimaryButton";

export function DashboardScreen({ navigation }: any) {
  const content = useContent();
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
    // Only auto-advance if we're at the very beginning of the flow, have finished onboarding, and haven't seen the banner
    if (state.flowStep === "dashboard" && state.hasCompletedOnboarding && !state.hasSeenRewardBanner) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_FLOW_STEP", payload: "reward" });
        navigation.replace("RewardPopupScreen");
      }, timing.dashboardToReward);
      return () => clearTimeout(timer);
    }
  }, [state.flowStep, state.hasCompletedOnboarding, state.hasSeenRewardBanner]);

  return (
    <ScreenShell>
      <OnboardingModal />
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

        <View style={styles.ledgerSection}>
          <Text style={styles.ledgerTitle}>{content.dashboard.transactionsTitle}</Text>
          
          <View style={styles.transactionCard}>
            <View style={styles.txIconContainer}>
              <MaterialCommunityIcons name="account-cash" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>{content.dashboard.tx1Title}</Text>
              <Text style={styles.txDate}>{content.dashboard.tx1Date}</Text>
            </View>
            <Text style={[styles.txAmount, { color: colors.successGreen }]}>{content.dashboard.tx1Amount}</Text>
          </View>
          
          <View style={styles.transactionCard}>
            <View style={styles.txIconContainer}>
              <MaterialCommunityIcons name="cellphone" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>{content.dashboard.tx2Title}</Text>
              <Text style={styles.txDate}>{content.dashboard.tx2Date}</Text>
            </View>
            <Text style={styles.txAmount}>{content.dashboard.tx2Amount}</Text>
          </View>
        </View>

        <View style={styles.ledgerSection}>
          <Text style={styles.ledgerTitle}>{content.dashboard.missionsTitle}</Text>
          
          {content.levels.map((level) => {
            const isUnlocked = state.currentLevel >= level.id;
            const isCompleted = state.currentLevel > level.id;
            const isActive = state.currentLevel === level.id;

            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.transactionCard,
                  isActive && { borderColor: colors.primary, borderWidth: 1 },
                  !isUnlocked && { opacity: 0.6 }
                ]}
                activeOpacity={isUnlocked ? 0.7 : 1}
                onPress={() => {
                  if (!isActive) return; // Only allow playing the current active level
                  dispatch({ type: "SET_DECISION", payload: null });
                  dispatch({ type: "SET_CHAT_INDEX", payload: -1 });
                  dispatch({ type: "SET_SYNC_STATUS", payload: "idle" });
                  dispatch({ type: "SET_FLOW_STEP", payload: "reward" });
                  navigation.replace("RewardPopupScreen");
                }}
              >
                <View style={[
                  styles.txIconContainer,
                  isActive && { backgroundColor: "rgba(99, 102, 241, 0.1)" }
                ]}>
                  <MaterialCommunityIcons 
                    name={level.id === 1 ? "gift" : level.id === 2 ? "qrcode-scan" : "phone-incoming"} 
                    size={24} 
                    color={isActive ? colors.primary : colors.textSecondary} 
                  />
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txTitle}>{level.title}</Text>
                  <Text style={styles.txDate}>
                    {isCompleted ? "Completed" : isActive ? "Active Threat" : `Locked (Complete Mission ${level.id - 1})`}
                  </Text>
                </View>
                {isUnlocked ? (
                  isCompleted ? (
                    <MaterialCommunityIcons name="check-circle" size={24} color={colors.successGreen} />
                  ) : (
                    <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
                  )
                ) : (
                  <MaterialCommunityIcons name="lock" size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            );
          })}
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
        
        {/* Settings Section */}
        <View style={styles.ledgerSection}>
          <Text style={styles.ledgerTitle}>Settings</Text>

          <View style={styles.settingsRow}>
            <Text style={styles.txTitle}>{content.settings?.language || "Language"}</Text>
            <View style={styles.langButtonGroup}>
              <TouchableOpacity style={[styles.langBtn, state.language === "en" && styles.langBtnActive]} onPress={() => dispatch({ type: "SET_LANGUAGE", payload: "en" })}>
                <Text style={[styles.langBtnText, state.language === "en" && styles.langBtnTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.langBtn, state.language === "hi" && styles.langBtnActive]} onPress={() => dispatch({ type: "SET_LANGUAGE", payload: "hi" })}>
                <Text style={[styles.langBtnText, state.language === "hi" && styles.langBtnTextActive]}>HI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.langBtn, state.language === "as" && styles.langBtnActive]} onPress={() => dispatch({ type: "SET_LANGUAGE", payload: "as" })}>
                <Text style={[styles.langBtnText, state.language === "as" && styles.langBtnTextActive]}>AS</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.txTitle}>{content.settings?.assistedMode || "Assisted Mode"}</Text>
              <Text style={styles.txDate}>{content.settings?.assistedModeDesc}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleBtn, state.assistedMode && styles.toggleBtnActive]} 
              onPress={() => dispatch({ type: "TOGGLE_ASSISTED_MODE" })}
            >
              <View style={[styles.toggleNub, state.assistedMode && styles.toggleNubActive]} />
            </TouchableOpacity>
          </View>
        </View>
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
  settingsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.md, marginBottom: spacing.sm },
  langButtonGroup: { flexDirection: "row", gap: spacing.xs },
  langBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.surfaceLight },
  langBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langBtnText: { color: colors.textSecondary, fontWeight: "600", fontSize: typography.sm },
  langBtnTextActive: { color: "#FFFFFF" },
  toggleBtn: { width: 50, height: 28, borderRadius: 14, backgroundColor: colors.surfaceLight, padding: 2, justifyContent: "center" },
  toggleBtnActive: { backgroundColor: colors.successGreen },
  toggleNub: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#FFFFFF", ...shadows.card },
  toggleNubActive: { transform: [{ translateX: 22 }] },
});
