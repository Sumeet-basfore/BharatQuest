// BharatQuest – Reward Banner (State 2)
// Fake UPI reward modal with countdown timer, glassmorphism, and haptics

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { content } from "../../config/content";

const { width } = Dimensions.get("window");

interface RewardBannerProps {
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function RewardBanner({
  onDismiss,
  autoDismissMs = 2500,
}: RewardBannerProps) {
  const [countdown, setCountdown] = useState(179); // 02:59
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Slide in animation & Haptics
  useEffect(() => {
    // Sharp double vibration to mimic aggressive notification
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

    // Auto-dismiss
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, []);

  // Countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, zIndex: 50 }]}>
      <BlurView intensity={20} tint="dark" style={styles.overlay}>
        <Animated.View
          style={[
            styles.banner,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Brand header */}
          <View style={styles.brandRow}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color={colors.scamCheckmark}
            />
            <Text style={styles.brandName}>{content.reward.brandName}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>{content.reward.brandTag}</Text>
            </View>
          </View>

          {/* Main reward text */}
          <View style={styles.rewardContent}>
            <MaterialCommunityIcons
              name="gift"
              size={48}
              color={colors.scamGreen}
            />
            <Text style={styles.title}>{content.reward.title}</Text>
            <Text style={styles.subtitle}>{content.reward.subtitle}</Text>
            <Text style={styles.cta}>{content.reward.cta}</Text>
          </View>

          {/* Countdown timer */}
          <View style={styles.timerRow}>
            <MaterialCommunityIcons
              name="clock-alert-outline"
              size={18}
              color={colors.urgencyRed}
            />
            <Text style={styles.timerLabel}>{content.reward.timerLabel}</Text>
            <Text style={styles.timerValue}>{formatTime(countdown)}</Text>
          </View>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 60,
  },
  banner: {
    width: width - 32,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // slightly transparent for glass
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  brandName: {
    fontSize: typography.sm,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  verifiedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  verifiedText: {
    fontSize: 10,
    color: colors.scamCheckmark,
    fontWeight: "600",
  },
  rewardContent: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.lg,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  cta: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.scamGreen,
    textAlign: "center",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  timerLabel: {
    fontSize: typography.sm,
    color: "#666666",
  },
  timerValue: {
    fontSize: typography.lg,
    fontWeight: "800",
    color: colors.urgencyRed,
    fontVariant: ["tabular-nums"],
  },
});
