// BharatQuest – HUD Stat Component
// Reusable metric chip for Balance and Trust Score with animated count-up and optional progress bar

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing, radii } from "../../config/theme";
import { useGame } from "../../context/GameContext";

interface HUDStatProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  iconColor?: string;
  valueColor?: string;
  flashColor?: string | null;
  animateTo?: number;
  animationDuration?: number;
  showProgressBar?: boolean;
}

export function HUDStat({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  iconColor = colors.trustGold,
  valueColor = colors.textPrimary,
  flashColor = null,
  animateTo,
  animationDuration = 1500,
  showProgressBar = false,
}: HUDStatProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animRef = useRef(new Animated.Value(value)).current;
  const scaleRef = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(value)).current;
  const isFirstRender = useRef(true);

  const target = animateTo !== undefined ? animateTo : value;
  const { state } = useGame();
  const isDark = state.darkMode;

  useEffect(() => {
    const listener = animRef.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    // On first render, snap immediately to value (no animation from 0)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      animRef.setValue(target);
      setDisplayValue(target);
      if (showProgressBar) {
        progressWidth.setValue(target);
      }
    } else {
      // Animate from current value to new target (not from 0)
      Animated.timing(animRef, {
        toValue: target,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      if (showProgressBar) {
        Animated.timing(progressWidth, {
          toValue: target,
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }
    }

    return () => {
      animRef.removeListener(listener);
    };
  }, [target, animationDuration]);

  // Flash effect when flashColor changes
  useEffect(() => {
    if (flashColor) {
      Animated.sequence([
        Animated.timing(scaleRef, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleRef, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [flashColor]);

  const progressInterpolation = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          transform: [{ scale: scaleRef }],
          backgroundColor: isDark ? colors.surface : "#FFFFFF",
          borderColor: isDark ? "transparent" : "#E2E8F0",
          borderWidth: isDark ? 0 : 1,
        },
      ]}
    >
      <View style={styles.contentCol}>
        <Text style={[styles.label, { color: isDark ? colors.textSecondary : "#4A5568", marginBottom: 2 }]}>{label}</Text>
        <View style={styles.valueRow}>
          <View style={[styles.coin, { backgroundColor: flashColor || iconColor }]}>
            <MaterialCommunityIcons
              name={icon}
              size={14}
              color={isDark ? colors.surface : "#FFFFFF"}
            />
          </View>
          <Text
            style={[
              styles.value,
              { color: flashColor || (valueColor === colors.textPrimary && !isDark ? "#1A202C" : valueColor) },
            ]}
          >
            {prefix}
            {displayValue.toLocaleString("en-IN")}
            {suffix}
          </Text>
        </View>
      </View>
      
      {showProgressBar && (
        <View style={[styles.progressTrack, { backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0" }]}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: progressInterpolation, backgroundColor: flashColor || iconColor }
            ]} 
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    minWidth: 140,
    gap: spacing.xs,
  },
  contentCol: {
    flexDirection: "column",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  coin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  progressTrack: {
    height: 4,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    marginTop: spacing.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
