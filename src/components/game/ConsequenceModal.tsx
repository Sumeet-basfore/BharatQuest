// BharatQuest – Consequence Modal (State 5)
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Animated, Share, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { useContent } from "../../config/content";
import { useGame } from "../../context/GameContext";
import { PrimaryButton } from "../common/PrimaryButton";
import { FAILURE_PENALTY, FAILURE_TRUST_LOSS, SUCCESS_TRUST_GAIN } from "../../types/game";

const { height } = Dimensions.get("window");

const badgeImage = require("../../assets/images/scam_defender_badge.png");

interface ConsequenceModalProps {
  branch: "claim" | "report";
  onDismiss: () => void;
}

export function ConsequenceModal({ branch, onDismiss }: ConsequenceModalProps) {
  const content = useContent();
  const slideAnim = useRef(new Animated.Value(height * 0.5)).current;
  const { state } = useGame();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const isFail = branch === "claim";

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.bottomSheet, 
          isFail ? styles.failBg : styles.successBg,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {isFail ? <FailureContent onDismiss={onDismiss} /> : <SuccessContent onDismiss={onDismiss} />}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function FailureContent({ onDismiss }: { onDismiss: () => void }) {
  const { state } = useGame();
  const content = useContent();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const f = levelData.result.failure;
  return (
    <View style={styles.content}>
      <View style={styles.miniHeader}>
        <MaterialCommunityIcons name="alert-decagram" size={32} color={colors.warningRed} />
        <Text style={styles.miniTitle}>{f.title}</Text>
      </View>
      
      <Text style={styles.explanation}>{f.explanation}</Text>
      
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Lost Balance</Text>
          <Text style={styles.statValueFail}>-₹{FAILURE_PENALTY}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Trust Hit</Text>
          <Text style={styles.statValueFail}>-{FAILURE_TRUST_LOSS}</Text>
        </View>
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>Village Safety Tip:</Text>
        <Text style={styles.tipText}>{f.tips[0]}</Text>
      </View>

      <PrimaryButton label={f.dismissLabel} color={colors.warningRed} onPress={onDismiss} icon="refresh" />
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
      <View style={styles.miniHeader}>
        <MaterialCommunityIcons name="shield-check" size={32} color={colors.successGreen} />
        <Text style={styles.miniTitle}>{s.title}</Text>
      </View>

      <Text style={styles.explanation}>{s.explanation}</Text>

      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>New Badge</Text>
          <Text style={styles.statValueSuccess}>{s.badgeTitle}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Trust Gained</Text>
          <Text style={styles.statValueSuccess}>+{SUCCESS_TRUST_GAIN}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={async () => {
            const msg = (content.share?.message || "I just proved my digital safety on BharatQuest!").replace("{score}", String(state.trustScore));
            await Share.share({ message: msg });
          }}
        >
          <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" />
          <Text style={styles.shareText}>Tell Friends</Text>
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <PrimaryButton label={s.dismissLabel} color={colors.successGreen} onPress={onDismiss} icon="arrow-right" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    width: "100%",
    ...shadows.card,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  failBg: { borderTopWidth: 4, borderTopColor: colors.warningRed },
  successBg: { borderTopWidth: 4, borderTopColor: colors.successGreen },
  scroll: { paddingHorizontal: spacing.lg },
  content: { gap: spacing.lg },
  miniHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  miniTitle: { fontSize: typography.lg, fontWeight: "800", color: colors.textPrimary },
  explanation: { fontSize: typography.md, color: colors.textSecondary, lineHeight: 22 },
  statRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
  },
  statItem: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: 10, color: colors.textMuted, textTransform: "uppercase", marginBottom: 2 },
  statValueFail: { fontSize: typography.md, fontWeight: "800", color: colors.warningRed },
  statValueSuccess: { fontSize: typography.md, fontWeight: "800", color: colors.successGreen },
  divider: { width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.1)" },
  tipBox: {
    backgroundColor: "rgba(220,53,69,0.05)",
    padding: spacing.md,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warningRed,
  },
  tipTitle: { fontSize: typography.sm, fontWeight: "700", color: colors.textPrimary, marginBottom: 4 },
  tipText: { fontSize: typography.sm, color: colors.textSecondary, lineHeight: 18 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(37, 211, 102, 0.1)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(37, 211, 102, 0.2)",
    gap: spacing.sm,
  },
  shareText: { color: "#25D366", fontSize: typography.sm, fontWeight: "700" },
  dismissBtn: { marginTop: spacing.sm },
});
