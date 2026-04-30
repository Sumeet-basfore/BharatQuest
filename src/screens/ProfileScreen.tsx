// BharatQuest – Profile Tab Screen
// Manage Account, Settings (dark mode, font size), Logout
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenShell } from "../components/common/ScreenShell";
import { useGame } from "../context/GameContext";
import { useContent } from "../config/content";
import { colors, spacing, radii, shadows } from "../config/theme";

type FontSize = "small" | "medium" | "large";

const FONT_OPTIONS: { label: string; value: FontSize }[] = [
  { label: "A", value: "small" },
  { label: "A", value: "medium" },
  { label: "A", value: "large" },
];

export function ProfileScreen() {
  const content = useContent();
  const { state, dispatch } = useGame();

  const isDark = state.darkMode;
  const bg = isDark ? colors.background : "#F0F4FF";
  const cardBg = isDark ? colors.surface : "#FFFFFF";
  const cardBorder = isDark ? colors.surfaceLight : "#E2E8F0";
  const textPrimary = isDark ? colors.textPrimary : "#1A202C";
  const textSecondary = isDark ? colors.textSecondary : "#4A5568";
  const textMuted = isDark ? colors.textMuted : "#718096";
  const divider = isDark ? colors.surfaceLight : "#E2E8F0";

  const fontScale =
    state.fontSize === "small" ? 0.88 :
    state.fontSize === "large" ? 1.14 : 1;

  // Derived initials for avatar
  const avatarLabel = "BQ";
  const creditScore = 300 + Math.round(state.trustScore * 6.5);

  return (
    <ScreenShell>
      <ScrollView
        style={[styles.scroll, { backgroundColor: bg }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Avatar & Name ── */}
        <View style={[styles.profileHeader, { backgroundColor: isDark ? colors.surface : "#6366F1" }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarLabel}</Text>
          </View>
          <Text style={[styles.profileName, { fontSize: 20 * fontScale }]}>{content.profile.defaultUserName}</Text>
          <Text style={[styles.profileSub, { fontSize: 13 * fontScale }]}>
            {content.profile.trustScoreFormat}: {state.trustScore}/100 · {content.profile.creditFormat}: {creditScore}
          </Text>


        </View>

        {/* ── Manage Account ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            {content.profile.manageAccount}
          </Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {[
              { icon: "account-edit-outline", label: content.profile.editProfile, sub: content.profile.editProfileSub },
              { icon: "bell-outline", label: content.profile.notifications, sub: content.profile.notificationsSub },
              { icon: "lock-outline", label: content.profile.changePin, sub: content.profile.changePinSub },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                  <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.menuTextBox}>
                    <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{item.label}</Text>
                    <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{item.sub}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={textMuted} />
                </TouchableOpacity>
                {idx < arr.length - 1 && <View style={[styles.divider, { backgroundColor: divider }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Settings ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>
            {content.profile.settingsSection}
          </Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>

            {/* Dark Mode Toggle */}
            <View style={styles.menuRow}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}>
                <MaterialCommunityIcons
                  name={isDark ? "weather-night" : "white-balance-sunny"}
                  size={20}
                  color={isDark ? "#A78BFA" : "#F59E0B"}
                />
              </View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>
                  {isDark ? content.profile.darkMode : content.profile.lightMode}
                </Text>
                <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>
                  {isDark ? content.profile.switchLight : content.profile.switchDark}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
                trackColor={{ false: "#D1D5DB", true: "#6366F1" }}
                thumbColor={isDark ? "#fff" : "#6366F1"}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            {/* Font Size */}
            <View style={[styles.menuRow, { alignItems: "flex-start", paddingVertical: spacing.md }]}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}>
                <MaterialCommunityIcons name="format-size" size={20} color={colors.primary} />
              </View>
              <View style={[styles.menuTextBox, { gap: spacing.sm }]}>
                <View>
                  <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.profile.fontSize}</Text>
                  <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{content.profile.fontSizeSub}</Text>
                </View>
                <View style={styles.fontRow}>
                  {FONT_OPTIONS.map((opt) => {
                    const isActive = state.fontSize === opt.value;
                    const scale = opt.value === "small" ? 14 : opt.value === "large" ? 20 : 17;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.fontBtn,
                          { borderColor: isActive ? colors.primary : divider, backgroundColor: isActive ? colors.primary : "transparent" },
                        ]}
                        onPress={() => dispatch({ type: "SET_FONT_SIZE", payload: opt.value })}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.fontBtnText, { fontSize: scale, color: isActive ? "#fff" : textSecondary }]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            {/* Assisted Mode */}
            <View style={styles.menuRow}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}>
                <MaterialCommunityIcons name="hand-heart-outline" size={20} color={colors.scamGreen} />
              </View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.settings?.assistedMode || "Assisted Mode"}</Text>
                <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{content.profile.assistedModeSub}</Text>
              </View>
              <Switch
                value={state.assistedMode}
                onValueChange={() => dispatch({ type: "TOGGLE_ASSISTED_MODE" })}
                trackColor={{ false: "#D1D5DB", true: colors.scamGreen }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            {/* Language */}
            <View style={[styles.menuRow, { alignItems: "flex-start", paddingVertical: spacing.md }]}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}>
                <MaterialCommunityIcons name="translate" size={20} color={colors.primary} />
              </View>
              <View style={[styles.menuTextBox, { gap: spacing.sm }]}>
                <View>
                  <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.settings?.language || "Language"}</Text>
                  <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{content.profile.languageSub}</Text>
                </View>
                <View style={styles.fontRow}>
                  {(["en", "hi", "as"] as const).map((lang) => {
                    const isActive = state.language === lang;
                    const labelMap = { en: "English", hi: "हिन्दी", as: "অসমীয়া" };
                    return (
                      <TouchableOpacity
                        key={lang}
                        style={[
                          styles.langFullBtn,
                          { borderColor: isActive ? colors.primary : divider, backgroundColor: isActive ? colors.primary : "transparent" },
                        ]}
                        onPress={() => dispatch({ type: "SET_LANGUAGE", payload: lang })}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.langFullText, { color: isActive ? "#fff" : textSecondary, fontSize: 12 * fontScale }]}>
                          {labelMap[lang]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Logout ── */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: colors.failureRed }]}
            activeOpacity={0.75}
            onPress={() => dispatch({ type: "RESET_GAME" })}
          >
            <MaterialCommunityIcons name="logout" size={20} color={colors.failureRed} />
            <Text style={[styles.logoutText, { fontSize: 15 * fontScale }]}>{content.profile.logout}</Text>
          </TouchableOpacity>
          <Text style={[styles.logoutHint, { color: textMuted, fontSize: 11 * fontScale }]}>
            {content.profile.logoutHint}
          </Text>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  profileHeader: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: spacing.sm,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  profileName: { fontWeight: "800", color: "#FFFFFF" },
  profileSub: { color: "rgba(255,255,255,0.75)" },

  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.card,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  menuTextBox: { flex: 1 },
  menuLabel: { fontWeight: "600" },
  menuSub: { marginTop: 2 },
  divider: { height: 1, marginLeft: spacing.md },
  fontRow: { flexDirection: "row", gap: spacing.sm },
  fontBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  fontBtnText: { fontWeight: "700" },
  langFullBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  langFullText: { fontWeight: "600" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
  },
  logoutText: { fontWeight: "700", color: colors.failureRed },
  logoutHint: { textAlign: "center", marginTop: spacing.sm },
});
