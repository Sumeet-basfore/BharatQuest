// BharatQuest – Consequence Modal (State 5)
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { content } from "../../config/content";
import { PrimaryButton } from "../common/PrimaryButton";

const badgeImage = require("../../assets/images/scam_defender_badge.png");

interface ConsequenceModalProps {
  branch: "claim" | "report";
  onDismiss: () => void;
}

export function ConsequenceModal({ branch, onDismiss }: ConsequenceModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const isFail = branch === "claim";
  const data = isFail ? content.result.failure : content.result.success;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 15, stiffness: 120, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim, zIndex: 70 }]}>
      <BlurView intensity={30} tint="dark" style={styles.overlay}>
        <Animated.View style={[styles.modal, isFail ? styles.failBorder : styles.successBorder, { transform: [{ scale: scaleAnim }] }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {isFail ? <FailureContent onDismiss={onDismiss} /> : <SuccessContent onDismiss={onDismiss} />}
          </ScrollView>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

function FailureContent({ onDismiss }: { onDismiss: () => void }) {
  const f = content.result.failure;
  return (
    <View style={styles.content}>
      <MaterialCommunityIcons name="alert-circle" size={64} color={colors.warningRed} />
      <Text style={styles.title}>{f.title}</Text>
      <View style={styles.rbiBox}>
        <Text style={styles.rbiSource}>{f.rbiSource}</Text>
        <Text style={styles.rbiSlogan}>{f.rbiSlogan}</Text>
        <Text style={styles.rbiTranslation}>({f.rbiTranslation})</Text>
      </View>
      <Text style={styles.explanation}>{f.explanation}</Text>
      <View style={styles.statLoss}>
        <Text style={styles.statLossText}>💰 {f.balanceLost}</Text>
        <Text style={styles.statLossText}>🛡️ {f.trustLost}</Text>
      </View>
      <Text style={styles.tipTitle}>{f.tipTitle}</Text>
      {f.tips.map((tip, i) => (
        <View key={i} style={styles.tipRow}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
      <View style={styles.dismissBtn}>
        <PrimaryButton label={f.dismissLabel} color={colors.warningRed} onPress={onDismiss} icon="check" />
      </View>
    </View>
  );
}

function SuccessContent({ onDismiss }: { onDismiss: () => void }) {
  const s = content.result.success;
  return (
    <View style={styles.content}>
      <Text style={styles.title}>{s.title}</Text>
      <Image source={badgeImage} style={styles.badge} resizeMode="contain" />
      <Text style={styles.badgeTitle}>{s.badgeTitle}</Text>
      <Text style={styles.badgeSub}>{s.badgeSubtitle}</Text>
      <Text style={styles.explanation}>{s.explanation}</Text>
      <View style={styles.statGain}>
        <Text style={styles.statGainText}>🛡️ {s.trustGained}</Text>
      </View>
      <Text style={styles.celebration}>{s.celebration}</Text>
      <View style={styles.dismissBtn}>
        <PrimaryButton label={s.dismissLabel} color={colors.successGreen} onPress={onDismiss} icon="arrow-right" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg },
  modal: { maxHeight: "90%", width: "100%", backgroundColor: "rgba(17, 24, 39, 0.9)", borderRadius: radii.xl, borderWidth: 3, ...shadows.card },
  failBorder: { borderColor: colors.warningRed },
  successBorder: { borderColor: colors.successGreen },
  scroll: { padding: spacing.xl },
  content: { alignItems: "center", gap: spacing.md },
  title: { fontSize: typography.xl, fontWeight: "800", color: colors.textPrimary, textAlign: "center" },
  rbiBox: { backgroundColor: "rgba(220,53,69,0.1)", borderRadius: radii.md, padding: spacing.lg, alignItems: "center", width: "100%", borderWidth: 1, borderColor: colors.warningRed },
  rbiSource: { fontSize: typography.sm, fontWeight: "700", color: colors.warningRed, textTransform: "uppercase", letterSpacing: 1 },
  rbiSlogan: { fontSize: typography.lg, fontWeight: "800", color: colors.textPrimary, textAlign: "center", marginTop: spacing.xs },
  rbiTranslation: { fontSize: typography.sm, color: colors.textSecondary, fontStyle: "italic" },
  explanation: { fontSize: typography.md, color: colors.textSecondary, lineHeight: 22, textAlign: "center" },
  statLoss: { backgroundColor: "rgba(220,53,69,0.1)", borderRadius: radii.md, padding: spacing.md, width: "100%", gap: spacing.xs },
  statLossText: { fontSize: typography.md, fontWeight: "700", color: colors.warningRed, textAlign: "center" },
  statGain: { backgroundColor: "rgba(40,167,69,0.1)", borderRadius: radii.md, padding: spacing.md, width: "100%", gap: spacing.xs },
  statGainText: { fontSize: typography.md, fontWeight: "700", color: colors.successGreen, textAlign: "center" },
  tipTitle: { fontSize: typography.md, fontWeight: "700", color: colors.textPrimary, alignSelf: "flex-start" },
  tipRow: { flexDirection: "row", alignSelf: "flex-start", gap: spacing.sm },
  tipBullet: { color: colors.textSecondary, fontSize: typography.md },
  tipText: { color: colors.textSecondary, fontSize: typography.sm, flex: 1, lineHeight: 20 },
  badge: { width: 160, height: 160 },
  badgeTitle: { fontSize: typography.xxl, fontWeight: "800", color: colors.trustGold },
  badgeSub: { fontSize: typography.md, color: colors.textSecondary },
  celebration: { fontSize: typography.sm, color: colors.textSecondary, fontStyle: "italic", textAlign: "center" },
  dismissBtn: { width: "100%", marginTop: spacing.lg },
});
