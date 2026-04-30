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
            {content.learn.pageTitle}
          </Text>
          <Text style={[styles.pageSubtitle, { color: textSecondary, fontSize: 14 * fontScale }]}>
            {content.learn.pageSubtitle}
          </Text>
        </View>

        {/* ── Missions ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            {content.learn.yourMissions}
          </Text>

          {/* ── Progress Banner ── */}
          <View style={[styles.progressBanner, { backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "#EBF4FF", borderColor: colors.primary }]}>
            <MaterialCommunityIcons name="trophy-outline" size={32} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: textPrimary, fontSize: 15 * fontScale }]}>
                Mission Progress
              </Text>
              <Text style={[styles.bannerBody, { color: textSecondary, fontSize: 13 * fontScale }]}>
                {state.highestLevel - 1} of {content.levels.length} scams defeated
              </Text>
              <View style={[styles.progressTrack, { backgroundColor: isDark ? colors.surfaceLight : "#D1D5DB" }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(((state.highestLevel - 1) / content.levels.length) * 100)}%` as any },
                  ]}
                />
              </View>
            </View>
          </View>

          {content.levels.map((level) => {
            const isCompleted = state.highestLevel > level.id;
            const isHighestActive = state.highestLevel === level.id;
            const isLocked = state.highestLevel < level.id;

            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.missionCard,
                  { backgroundColor: cardBg, borderColor: isHighestActive ? colors.primary : cardBorder },
                  isHighestActive && styles.missionCardActive,
                  isLocked && { opacity: 0.55 },
                ]}
                activeOpacity={isLocked ? 1 : 0.75}
                onPress={() => {
                  if (isLocked) return;
                  dispatch({ type: "SET_LEVEL", payload: level.id });
                  dispatch({ type: "SET_DECISION", payload: null });
                  dispatch({ type: "SET_CHAT_INDEX", payload: -1 });
                  dispatch({ type: "SET_SYNC_STATUS", payload: "idle" });
                  dispatch({ type: "SET_FLOW_STEP", payload: "chat" });
                  dispatch({ type: "MARK_REWARD_SEEN" });
                  navigation.navigate("ChatScreen");
                }}
              >
                {/* Left accent bar */}
                {isHighestActive && <View style={styles.activeBar} />}

                <View
                  style={[
                    styles.missionIconBox,
                    {
                      backgroundColor: isHighestActive
                        ? "rgba(99,102,241,0.15)"
                        : isDark ? colors.surfaceLight : "#EBF4FF",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={MISSION_ICONS[level.id] as any}
                    size={26}
                    color={isCompleted ? colors.successGreen : isHighestActive ? colors.primary : textMuted}
                  />
                </View>

                <View style={styles.missionInfo}>
                  <Text style={[styles.missionTitle, { color: textPrimary, fontSize: 15 * fontScale }]}>
                    {level.title}
                  </Text>
                  <Text style={[styles.missionStatus, { color: textMuted, fontSize: 12 * fontScale }]}>
                    {isCompleted ? content.learn.statusCompleted : isHighestActive ? content.learn.statusActive : `${content.learn.statusLocked} ${level.id - 1}`}
                  </Text>
                </View>

                {isCompleted ? (
                  <MaterialCommunityIcons name="refresh" size={24} color={colors.successGreen} />
                ) : isHighestActive ? (
                  <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} />
                ) : (
                  <MaterialCommunityIcons name="lock-outline" size={20} color={textMuted} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Official Helpline ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            REPORT SCAMS & COMPLAINTS
          </Text>
          <View style={[styles.helplineCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.helplineIconBox, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
              <MaterialCommunityIcons name="shield-account" size={24} color="#EF4444" />
            </View>
            <View style={styles.helplineContent}>
              <Text style={[styles.helplineTitle, { color: textPrimary, fontSize: 15 * fontScale }]}>
                National Consumer Helpline (NCH)
              </Text>
              
              <View style={styles.helplineRow}>
                <MaterialCommunityIcons name="web" size={16} color={textMuted} />
                <Text style={[styles.helplineText, { color: textMuted, fontSize: 13 * fontScale }]}>consumerhelpline.gov.in</Text>
              </View>
              
              <View style={styles.helplineRow}>
                <MaterialCommunityIcons name="phone" size={16} color={textMuted} />
                <Text style={[styles.helplineText, { color: textMuted, fontSize: 13 * fontScale }]}>Toll-Free: 1915, 1930</Text>
              </View>

              <View style={styles.helplineRow}>
                <MaterialCommunityIcons name="message-text" size={16} color={textMuted} />
                <Text style={[styles.helplineText, { color: textMuted, fontSize: 13 * fontScale }]}>SMS Support: 8800001915</Text>
              </View>

              <View style={styles.helplineRow}>
                <MaterialCommunityIcons name="email" size={16} color={textMuted} />
                <Text style={[styles.helplineText, { color: textMuted, fontSize: 13 * fontScale }]}>dirpg-ca@nic.in</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Safety Tips ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            {content.learn.fraudSafetyTips}
          </Text>
          {content.learn.tips.map((tip) => (
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
              {content.learn.missionProgressTitle}
            </Text>
            <Text style={[styles.bannerBody, { color: textSecondary, fontSize: 13 * fontScale }]}>
              {state.currentLevel - 1} {content.learn.scamsDefeated.replace("{total}", content.levels.length.toString())}
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
  helplineCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    ...shadows.card,
  },
  helplineIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  helplineContent: { flex: 1, gap: 4 },
  helplineTitle: { fontWeight: "700", marginBottom: 2 },
  helplineRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  helplineText: {},
});
