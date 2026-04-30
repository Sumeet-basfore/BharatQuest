// BharatQuest – Reward Banner (State 2)
// Fake UPI reward modal with countdown timer, glassmorphism, and haptics

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { useContent } from "../../config/content";
import { useGame } from "../../context/GameContext";

const { width } = Dimensions.get("window");

interface RewardBannerProps {
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function RewardBanner({
  onDismiss,
  autoDismissMs = 2800, // Slightly longer for readability
}: RewardBannerProps) {
  const { state } = useGame();
  const content = useContent();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const [countdown, setCountdown] = useState(179); 
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString();
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isDark = state.darkMode;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY: slideAnim }] }]}>
      <BlurView intensity={Platform.OS === 'ios' ? 80 : 100} tint="dark" style={styles.pill}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="gift" size={24} color={colors.scamGreen} />
          <View style={styles.glow} />
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.brandName}>{levelData.reward.brandName}</Text>
            <MaterialCommunityIcons name="check-decagram" size={14} color={colors.scamCheckmark} />
          </View>
          <Text style={styles.title} numberOfLines={1}>{levelData.reward.title}</Text>
        </View>

        <View style={styles.timerBox}>
          <Text style={styles.timerValue}>{formatTime(countdown)}</Text>
          <Text style={styles.timerLabel}>left</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 100,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.full,
    padding: spacing.sm,
    paddingRight: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
    ...shadows.card,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(37, 211, 102, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    backgroundColor: colors.scamGreen,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  brandName: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.md,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  timerBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255, 255, 255, 0.1)",
  },
  timerValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.urgencyRed,
    fontVariant: ["tabular-nums"],
  },
  timerLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    marginTop: -2,
  },
});
