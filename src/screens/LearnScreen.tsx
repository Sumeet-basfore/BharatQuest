// BharatQuest – Learn Tab Screen
// Displays Scam Defense Missions content
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenShell } from "../components/common/ScreenShell";
import { useGame } from "../context/GameContext";
import { useContent } from "../config/content";
import { colors, spacing, radii, shadows } from "../config/theme";

const MISSION_ICONS: Record<number, string> = {
  1: "gift",
  2: "qrcode-scan",
  3: "phone-incoming",
};

const TIPS = [
  {
    id: "t1",
    icon: "alert-circle-outline",
    title: "Never share OTPs",
    body: "No bank, UPI app, or government body will ever ask for your OTP. Sharing it gives strangers full access to your money.",
    color: "#EF4444",
  },
  {
    id: "t2",
    icon: "qrcode-scan",
    title: "QR codes only send money",
    body: "Scanning a QR code to 'receive' money is always a scam. Legitimate payments only require you to enter a UPI ID or phone number.",
    color: "#F59E0B",
  },
  {
    id: "t3",
    icon: "phone-incoming",
    title: "Verify caller identity",
    body: "Scammers impersonate bank officials. Always hang up and call the official bank helpline to verify any suspicious call.",
    color: "#6366F1",
  },
  {
    id: "t4",
    icon: "shield-check",
    title: "Too good to be true",
    body: "Promises of instant rewards, lottery wins, or free cash transfers are bait. Legitimate schemes never require you to pay first.",
    color: colors.successGreen,
  },
];

export function LearnScreen({ navigation }: any) {
  const content = useContent();
  const { state, dispatch } = useGame();

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

  return (
    <ScreenShell>
      <ScrollView
        style={[styles.scroll, { backgroundColor: bg }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Page title */}
        <View style={[styles.pageHeader, { backgroundColor: bg }]}>
          <Text style={[styles.pageTitle, { color: textPrimary, fontSize: 26 * fontScale }]}>
            Scam Defence Missions
          </Text>
          <Text style={[styles.pageSubtitle, { color: textSecondary, fontSize: 14 * fontScale }]}>
            Train yourself to spot & defeat financial fraud
          </Text>
        </View>

        {/* ── Missions ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            YOUR MISSIONS
          </Text>
          {content.levels.map((level) => {
            const isCompleted = state.currentLevel > level.id;
            const isActive = state.currentLevel === level.id;
            const isLocked = state.currentLevel < level.id;

            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.missionCard,
                  { backgroundColor: cardBg, borderColor: isActive ? colors.primary : cardBorder },
                  isActive && styles.missionCardActive,
                  isLocked && { opacity: 0.55 },
                ]}
                activeOpacity={isActive ? 0.75 : 1}
                onPress={() => {
                  if (!isActive) return;
                  dispatch({ type: "SET_DECISION", payload: null });
                  dispatch({ type: "SET_CHAT_INDEX", payload: -1 });
                  dispatch({ type: "SET_SYNC_STATUS", payload: "idle" });
                  dispatch({ type: "SET_FLOW_STEP", payload: "reward" });
                  navigation.navigate("RewardPopupScreen");
                }}
              >
                {/* Left accent bar */}
                {isActive && <View style={styles.activeBar} />}

                <View
                  style={[
                    styles.missionIconBox,
                    {
                      backgroundColor: isActive
                        ? "rgba(99,102,241,0.15)"
                        : isDark ? colors.surfaceLight : "#EBF4FF",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={MISSION_ICONS[level.id] as any}
                    size={26}
                    color={isCompleted ? colors.successGreen : isActive ? colors.primary : textMuted}
                  />
                </View>

                <View style={styles.missionInfo}>
                  <Text style={[styles.missionTitle, { color: textPrimary, fontSize: 15 * fontScale }]}>
                    {level.id}. {level.title}
                  </Text>
                  <Text style={[styles.missionStatus, { color: textMuted, fontSize: 12 * fontScale }]}>
                    {isCompleted ? "Completed" : isActive ? "Active Threat" : `Locked – complete Mission ${level.id - 1}`}
                  </Text>
                </View>

                {isCompleted ? (
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.successGreen} />
                ) : isActive ? (
                  <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} />
                ) : (
                  <MaterialCommunityIcons name="lock-outline" size={20} color={textMuted} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Safety Tips ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            FRAUD SAFETY TIPS
          </Text>
          {TIPS.map((tip) => (
            <View
              key={tip.id}
              style={[styles.tipCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            >
              <View style={[styles.tipIconBox, { backgroundColor: `${tip.color}22` }]}>
                <MaterialCommunityIcons name={tip.icon as any} size={22} color={tip.color} />
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: textPrimary, fontSize: 14 * fontScale }]}>
                  {tip.title}
                </Text>
                <Text style={[styles.tipBody, { color: textMuted, fontSize: 12 * fontScale }]}>
                  {tip.body}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Progress Banner ── */}
        <View style={[styles.progressBanner, { backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "#EBF4FF", borderColor: colors.primary }]}>
          <MaterialCommunityIcons name="trophy-outline" size={32} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: textPrimary, fontSize: 15 * fontScale }]}>
              Mission Progress
            </Text>
            <Text style={[styles.bannerBody, { color: textSecondary, fontSize: 13 * fontScale }]}>
              {state.currentLevel - 1} of {content.levels.length} scams defeated
            </Text>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? colors.surfaceLight : "#D1D5DB" }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(((state.currentLevel - 1) / content.levels.length) * 100)}%` as any },
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  pageHeader: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  pageTitle: { fontWeight: "800", marginBottom: 4 },
  pageSubtitle: {},
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  missionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.card,
  },
  missionCardActive: {
    borderWidth: 1.5,
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  missionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  missionInfo: { flex: 1 },
  missionTitle: { fontWeight: "700" },
  missionStatus: { marginTop: 2 },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    gap: spacing.md,
  },
  tipIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipContent: { flex: 1 },
  tipTitle: { fontWeight: "700", marginBottom: 4 },
  tipBody: { lineHeight: 18 },
  progressBanner: {
    marginHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerTitle: { fontWeight: "700", marginBottom: 2 },
  bannerBody: { marginBottom: spacing.sm },
  progressTrack: {
    height: 6,
    borderRadius: radii.full,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
  },
});
