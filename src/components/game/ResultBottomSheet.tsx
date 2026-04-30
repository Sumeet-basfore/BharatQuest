// BharatQuest – Result Bottom Sheet (Replaces Consequence Modal)
// Slides up from bottom, more dismissable

import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Animated, Share } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { useContent } from "../../config/content";
import { useGame } from "../../context/GameContext";
import { PrimaryButton } from "../common/PrimaryButton";

const badgeImage = require("../../assets/images/scam_defender_badge.png");

interface ResultBottomSheetProps {
  branch: "claim" | "report";
  onDismiss: () => void;
}

export function ResultBottomSheet({ branch, onDismiss }: ResultBottomSheetProps) {
  const content = useContent();
  const { state } = useGame();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const isFail = branch === "claim";
  const data = isFail ? levelData.result.failure : levelData.result.success;

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      damping: 20,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {isFail ? (
            <FailureContent onDismiss={onDismiss} />
          ) : (
            <SuccessContent onDismiss={onDismiss} />
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

function FailureContent({ onDismiss }: { onDismiss: () => void }) {
  const { state } = useGame();
  const content = useContent();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const f = levelData.result.failure;

  return (
    <View style={styles.content}>
      <MaterialCommunityIcons name="alert-circle" size={48} color={colors.warningRed} />
      <Text style={styles.title}>{f.title}</Text>
      <View style={styles.rbiBox}>
        <Text style={styles.rbiSource}>{f.rbiSource}</Text>
        <Text style={styles.rbiSlogan}>{f.rbiSlogan}</Text>
        <Text style={styles.rbiTranslation}>({f.rbiTranslation})</Text>
      </View>
      <Text style={styles.explanation}>{f.explanation}</Text>
      <View style={styles.statRow}>
        <Text style={styles.statTextFail}>💰 {f.balanceLost}</Text>
        <Text style={styles.statTextFail}>🛡️ {f.trustLost}</Text>
      </View>
      <Text style={styles.tipTitle}>{f.tipTitle}</Text>
      {f.tips.map((tip, i) => (
        <View key={i} style={styles.tipRow}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
      {state.assistedMode && (
        <View style={styles.assistedBox}>
          <Text style={styles.assistedText}>👨‍👩‍👧‍👦 {f.grandchildTip}</Text>
        </View>
      )}
      <View style={styles.dismissBtn}>
        <PrimaryButton label={f.dismissLabel} color={colors.warningRed} onPress={onDismiss} icon="check" />
      </View>
    </View>
  );
}

function SuccessContent({ onDismiss }: { onDismiss: () => void }) {
  const { state } = useGame();
  const content = useContent();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const s = levelData.result.success;

  return (
    <View style={styles.content}>
      <Image source={badgeImage} style={styles.badge} resizeMode="contain" />
      <Text style={styles.titleSuccess}>{s.title}</Text>
      <Text style={styles.badgeTitle}>{s.badgeTitle}</Text>
      <Text style={styles.badgeSub}>{s.badgeSubtitle}</Text>
      <Text style={styles.explanation}>{s.explanation}</Text>
      <View style={styles.statRowSuccess}>
        <Text style={styles.statTextSuccess}>🛡️ {s.trustGained}</Text>
      </View>
      <Text style={styles.celebration}>{s.celebration}</Text>
      {state.assistedMode && (
        <View style={styles.assistedBox}>
          <Text style={styles.assistedText}>👨‍👩‍👧‍👦 {s.grandchildTip}</Text>
        </View>
      )}
      <View style={styles.dismissBtn}>
        <PrimaryButton 
          label={content.share?.button || "Share on WhatsApp"} 
          color="#25D366" 
          onPress={async () => {
            try {
              const msg = (content.share?.message || "I just proved my digital safety on BharatQuest! I am a Scam Defender with Trust Score {score}/100").replace("{score}", String(state.trustScore));
              await Share.share({ message: msg });
            } catch (e) {
              console.error(e);
            }
          }} 
          icon="whatsapp" 
        />
        <View style={{ height: spacing.md }} />
        <PrimaryButton label={s.dismissLabel} color={colors.successGreen} onPress={onDismiss} icon="arrow-right" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 70,
  },
  sheet: {
    backgroundColor: "rgba(17, 24, 39, 0.98)",
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.textMuted,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  content: {
    alignItems: "center",
    gap: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: "800",
    color: colors.warningRed,
    textAlign: "center",
  },
  titleSuccess: {
    fontSize: typography.lg,
    fontWeight: "800",
    color: colors.successGreen,
    textAlign: "center",
  },
  rbiBox: {
    backgroundColor: "rgba(220,53,69,0.15)",
    borderRadius: radii.md,
    padding: spacing.lg,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.warningRed,
  },
  rbiSource: {
    fontSize: typography.xs,
    fontWeight: "700",
    color: colors.warningRed,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  rbiSlogan: {
    fontSize: typography.md,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  rbiTranslation: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  explanation: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    backgroundColor: "rgba(220,53,69,0.15)",
    borderRadius: radii.md,
    padding: spacing.md,
    width: "100%",
    justifyContent: "center",
    gap: spacing.lg,
  },
  statRowSuccess: {
    flexDirection: "row",
    backgroundColor: "rgba(40,167,69,0.15)",
    borderRadius: radii.md,
    padding: spacing.md,
    width: "100%",
    justifyContent: "center",
  },
  statTextFail: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.warningRed,
  },
  statTextSuccess: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.successGreen,
  },
  tipTitle: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.textPrimary,
    alignSelf: "flex-start",
  },
  tipRow: {
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: spacing.sm,
  },
  tipBullet: {
    color: colors.textSecondary,
    fontSize: typography.md,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    flex: 1,
    lineHeight: 18,
  },
  badge: {
    width: 120,
    height: 120,
  },
  badgeTitle: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.trustGold,
  },
  badgeSub: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  celebration: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
  },
  assistedBox: {
    width: "100%",
    backgroundColor: "rgba(105, 180, 255, 0.15)",
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(105, 180, 255, 0.3)",
  },
  assistedText: {
    color: "#69B4FF",
    fontSize: typography.sm,
    fontWeight: "600",
    lineHeight: 18,
  },
  dismissBtn: {
    width: "100%",
    marginTop: spacing.lg,
  },
});