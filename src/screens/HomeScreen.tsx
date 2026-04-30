// BharatQuest – Home Tab Screen
// Shows credit score, recent transactions & sync progress
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenShell } from "../components/common/ScreenShell";
import { HUDStat } from "../components/common/HUDStat";
import { OnboardingModal } from "../components/game/OnboardingModal";
import { ScamNotificationCard } from "../components/game/ScamNotificationCard";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { useGame } from "../context/GameContext";
import { saveRewardBannerSeen } from "../services/storage";
import { colors, spacing, typography, radii, shadows, timing } from "../config/theme";
import { useContent } from "../config/content";

export function HomeScreen({ navigation }: any) {
  const content = useContent();
  const { state, dispatch } = useGame();
  const [showNotification, setShowNotification] = useState(false);

  // Hidden triple-tap to reset demo
  let tapCount = 0;
  let tapTimer: NodeJS.Timeout;
  const handleTitleTap = () => {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 500);
    if (tapCount >= 3) {
      dispatch({ type: "RESET_GAME" });
      setShowNotification(false);
      tapCount = 0;
    }
  };

  // Show inline scam notification after a delay (replaces auto-navigate to RewardPopupScreen)
  useEffect(() => {
    if (state.flowStep === "dashboard" && state.hasCompletedOnboarding && !state.hasSeenRewardBanner) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, timing.dashboardToReward);
      return () => clearTimeout(timer);
    }
  }, [state.flowStep, state.hasCompletedOnboarding, state.hasSeenRewardBanner]);

  const handleNotificationTap = () => {
    dispatch({ type: "MARK_REWARD_SEEN" });
    saveRewardBannerSeen();
    dispatch({ type: "SET_FLOW_STEP", payload: "chat" });
    navigation.navigate("ChatScreen");
  };

  // Dynamic theme
  const isDark = state.darkMode;
  const bg = isDark ? colors.background : "#F0F4FF";
  const cardBg = isDark ? colors.surface : "#FFFFFF";
  const cardBorder = isDark ? colors.surfaceLight : "#E2E8F0";
  const textPrimary = isDark ? colors.textPrimary : "#1A202C";
  const textSecondary = isDark ? colors.textSecondary : "#4A5568";
  const textMuted = isDark ? colors.textMuted : "#718096";

  const fontScale =
    state.fontSize === "small" ? 0.88 :
    state.fontSize === "large" ? 1.14 : 1;

  // Credit score derived from trustScore
  const creditScore = 300 + Math.round(state.trustScore * 6.5);

  // Sync progress percentage
  const syncProgress =
    state.syncStatus === "success" ? 100 :
    state.syncStatus === "syncing" ? 60 :
    state.syncStatus === "idle" && state.decision !== null ? 30 : 0;

  const creditColor =
    creditScore >= 750 ? colors.successGreen :
    creditScore >= 650 ? colors.trustGold : colors.warningRed;

  return (
    <ScreenShell>
      <OnboardingModal />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: bg }]}>
        <TouchableOpacity activeOpacity={1} onPress={handleTitleTap}>
          <Text style={[styles.title, { color: textPrimary, fontSize: 24 * fontScale }]}>
            {content.dashboard.farmTitle}
          </Text>
        </TouchableOpacity>
        <View style={styles.hudRow}>
          <HUDStat
            icon="currency-inr"
            label={content.dashboard.balanceLabel}
            value={state.balance}
            iconColor={colors.trustGold}
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

      <ScrollView
        style={[styles.scroll, { backgroundColor: bg }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── Incoming Scam Notification (replaces full-screen RewardPopup) ── */}
        {showNotification && (
          <ScamNotificationCard onPress={handleNotificationTap} />
        )}

        {/* ── Credit Score Card ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            {content.home.creditScoreTitle}
          </Text>
          <View style={[styles.creditCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.creditLeft}>
              <Text style={[styles.creditScore, { color: creditColor, fontSize: 48 * fontScale }]}>
                {creditScore}
              </Text>
              <Text style={[styles.creditLabel, { color: textMuted, fontSize: 13 * fontScale }]}>
                {creditScore >= 750 ? content.home.excellent : creditScore >= 650 ? content.home.good : content.home.fair}
              </Text>
            </View>
            <View style={styles.creditRight}>
              <MaterialCommunityIcons name="chart-arc" size={64} color={creditColor} />
              <Text style={[styles.creditRange, { color: textMuted, fontSize: 11 * fontScale }]}>
                {content.home.range}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Sync Progress ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            {content.home.syncProgressTitle}
          </Text>
          <View style={[styles.syncCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.syncRow}>
              <MaterialCommunityIcons
                name="cloud-sync"
                size={22}
                color={syncProgress === 100 ? colors.successGreen : colors.primary}
              />
              <Text style={[styles.syncLabel, { color: textPrimary, fontSize: 14 * fontScale }]}>
                {syncProgress === 100
                  ? content.home.syncedSuccess
                  : syncProgress === 60
                  ? content.home.syncingData
                  : syncProgress === 30
                  ? content.home.readyToSync
                  : content.home.noPendingSync}
              </Text>
              <Text style={[styles.syncPct, { color: syncProgress === 100 ? colors.successGreen : colors.primary, fontSize: 14 * fontScale }]}>
                {syncProgress}%
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? colors.surfaceLight : "#E2E8F0" }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${syncProgress}%` as any,
                    backgroundColor: syncProgress === 100 ? colors.successGreen : colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* ── Recent Transactions ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            {content.dashboard.transactionsTitle}
          </Text>

          <View style={[styles.txCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.txIcon, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}>
              <MaterialCommunityIcons name="account-cash" size={22} color={colors.primary} />
            </View>
            <View style={styles.txDetails}>
              <Text style={[styles.txTitle, { color: textPrimary, fontSize: 15 * fontScale }]}>
                {content.dashboard.tx1Title}
              </Text>
              <Text style={[styles.txDate, { color: textMuted, fontSize: 12 * fontScale }]}>
                {content.dashboard.tx1Date}
              </Text>
            </View>
            <Text style={[styles.txAmount, { color: colors.successGreen, fontSize: 15 * fontScale }]}>
              {content.dashboard.tx1Amount}
            </Text>
          </View>

          <View style={[styles.txCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.txIcon, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}>
              <MaterialCommunityIcons name="cellphone" size={22} color={colors.primary} />
            </View>
            <View style={styles.txDetails}>
              <Text style={[styles.txTitle, { color: textPrimary, fontSize: 15 * fontScale }]}>
                {content.dashboard.tx2Title}
              </Text>
              <Text style={[styles.txDate, { color: textMuted, fontSize: 12 * fontScale }]}>
                {content.dashboard.tx2Date}
              </Text>
            </View>
            <Text style={[styles.txAmount, { color: textPrimary, fontSize: 15 * fontScale }]}>
              {content.dashboard.tx2Amount}
            </Text>
          </View>
        </View>

        {/* Sync CTA if decision was made */}
        {state.flowStep === "dashboard" && state.decision !== null && (
          <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: spacing.md },
  title: { fontWeight: "800", textAlign: "center" },
  hudRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  scroll: { flex: 1 },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: {
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  creditCard: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    ...shadows.card,
  },
  creditLeft: { gap: 4 },
  creditScore: { fontWeight: "900" },
  creditLabel: { fontWeight: "600" },
  creditRight: { alignItems: "center", gap: 4 },
  creditRange: {},
  syncCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    gap: spacing.sm,
    ...shadows.card,
  },
  syncRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  syncLabel: { flex: 1, fontWeight: "500" },
  syncPct: { fontWeight: "700" },
  progressTrack: {
    height: 8,
    borderRadius: radii.full,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: radii.full,
  },
  txCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  txDetails: { flex: 1 },
  txTitle: { fontWeight: "600" },
  txDate: { marginTop: 2 },
  txAmount: { fontWeight: "700" },
});
