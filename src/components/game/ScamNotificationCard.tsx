// BharatQuest – Scam Notification Card
// Appears inline on HomeScreen to simulate receiving a scam notification.
// Non-blocking, tappable, feels like a real SMS/push notification.

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { useContent } from "../../config/content";
import { useGame } from "../../context/GameContext";

interface ScamNotificationCardProps {
  onPress: () => void;
}

export function ScamNotificationCard({ onPress }: ScamNotificationCardProps) {
  const { state } = useGame();
  const content = useContent();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];

  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Haptic buzz to simulate notification arrival
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Slide in from top with fade
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 18,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle pulsing glow on the left accent border
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Determine icon based on level
  const iconName =
    levelData.id === 1 ? "gift" :
    levelData.id === 2 ? "qrcode-scan" : "bank";

  const iconBg =
    levelData.id === 1 ? colors.scamGreen :
    levelData.id === 2 ? colors.deceptiveBlue : colors.warningRed;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={onPress}
      >
        {/* Left accent stripe */}
        <View style={[styles.accentStripe, { backgroundColor: colors.scamGreen }]} />

        <View style={styles.cardContent}>
          {/* Header row: icon + sender + time */}
          <View style={styles.headerRow}>
            <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
              <MaterialCommunityIcons name={iconName as any} size={18} color="#FFFFFF" />
            </View>
            <View style={styles.senderInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.senderName} numberOfLines={1}>
                  {levelData.reward.brandName}
                </Text>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={14}
                  color={colors.scamCheckmark}
                />
              </View>
              <Text style={styles.timeText}>Just now</Text>
            </View>

            {/* Unread dot */}
            <Animated.View style={[styles.unreadDot, { opacity: glowAnim }]} />
          </View>

          {/* Message body */}
          <Text style={styles.messageTitle} numberOfLines={1}>
            {levelData.reward.title}
          </Text>
          <Text style={styles.messagePreview} numberOfLines={2}>
            {levelData.reward.subtitle} {levelData.reward.cta}
          </Text>

          {/* CTA row */}
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>Tap to view message</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={16}
              color={colors.scamGreen}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    ...shadows.card,
  },
  accentStripe: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    paddingLeft: spacing.md,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  senderInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  senderName: {
    fontSize: typography.sm,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.scamGreen,
  },
  messageTitle: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 2,
  },
  messagePreview: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
  },
  ctaText: {
    fontSize: typography.xs,
    color: colors.scamGreen,
    fontWeight: "600",
  },
});
