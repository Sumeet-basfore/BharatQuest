// BharatQuest – Slide-Down Banner (Replaces RewardBanner Overlay)
// Slides down from top, auto-dismisses, non-blocking

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { useContent } from "../../config/content";
import { useGame } from "../../context/GameContext";

const { width } = Dimensions.get("window");

interface SlideDownBannerProps {
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function SlideDownBanner({
  onDismiss,
  autoDismissMs = 2500,
}: SlideDownBannerProps) {
  const { state } = useGame();
  const content = useContent();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const [countdown, setCountdown] = useState(179);
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
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
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.banner}>
        <View style={styles.brandRow}>
          <MaterialCommunityIcons
            name="check-decagram"
            size={18}
            color={colors.scamCheckmark}
          />
          <Text style={styles.brandName}>{levelData.reward.brandName}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>{levelData.reward.brandTag}</Text>
          </View>
        </View>

        <View style={styles.rewardContent}>
          <MaterialCommunityIcons name="gift" size={32} color={colors.scamGreen} />
          <Text style={styles.title}>{levelData.reward.title}</Text>
        </View>

        <View style={styles.timerRow}>
          <MaterialCommunityIcons
            name="clock-alert-outline"
            size={14}
            color={colors.urgencyRed}
          />
          <Text style={styles.timerLabel}>{levelData.reward.timerLabel}</Text>
          <Text style={styles.timerValue}>{formatTime(countdown)}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: spacing.lg,
  },
  banner: {
    width: width - spacing.lg * 2,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: radii.lg,
    padding: spacing.md,
    alignSelf: "center",
    ...shadows.card,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  brandName: {
    fontSize: typography.xs,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  verifiedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  verifiedText: {
    fontSize: 9,
    color: colors.scamCheckmark,
    fontWeight: "600",
  },
  rewardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  title: {
    fontSize: typography.md,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.xs,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: spacing.sm,
  },
  timerLabel: {
    fontSize: typography.xs,
    color: "#666666",
  },
  timerValue: {
    fontSize: typography.sm,
    fontWeight: "800",
    color: colors.urgencyRed,
  },
});