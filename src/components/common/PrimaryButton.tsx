// BharatQuest – Primary Button
// Large touch-target button with optional pulsing animation

import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";

interface PrimaryButtonProps {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  onPress: () => void;
  pulse?: boolean;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  icon,
  color,
  onPress,
  pulse = false,
  disabled = false,
}: PrimaryButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        { transform: [{ scale: pulse ? pulseAnim : 1 }] },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: color },
          pulse && shadows.button,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={colors.white}
            style={styles.icon}
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.lg,
    width: "100%",
    minHeight: 72,
  },
  icon: {
    marginRight: spacing.md,
  },
  label: {
    fontSize: typography.lg,
    fontWeight: "700",
    color: colors.white,
  },
  disabled: {
    opacity: 0.5,
  },
});
