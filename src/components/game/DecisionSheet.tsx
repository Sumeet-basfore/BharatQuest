// BharatQuest – Decision Sheet (State 4)
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radii } from "../../config/theme";
import { content } from "../../config/content";
import { PrimaryButton } from "../common/PrimaryButton";

const { height } = Dimensions.get("window");

interface DecisionSheetProps {
  onClaim: () => void;
  onReport: () => void;
}

export function DecisionSheet({ onClaim, onReport }: DecisionSheetProps) {
  const slideAnim = useRef(new Animated.Value(height * 0.5)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Light haptic to signal it's time to decide
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0, damping: 20, stiffness: 150, useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1, duration: 300, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClaim = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onClaim();
  };

  const handleReport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onReport();
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdropOpacity, zIndex: 60 }]}>
      <BlurView intensity={30} tint="dark" style={styles.backdrop}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handleBar} />
          <Text style={styles.title}>{content.decision.title}</Text>
          <View style={styles.buttonGroup}>
            <PrimaryButton label={content.decision.claimButton} icon="gift" color={colors.deceptiveBlue} onPress={handleClaim} pulse={true} />
            <PrimaryButton label={content.decision.reportButton} icon="shield-off" color={colors.warningRed} onPress={handleReport} pulse={false} />
          </View>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end" },
  sheet: { backgroundColor: "rgba(17, 24, 39, 0.85)", borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: spacing.xl, paddingBottom: spacing.xxxl },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.textMuted, alignSelf: "center", marginBottom: spacing.xl },
  title: { fontSize: typography.xl, fontWeight: "700", color: colors.textPrimary, textAlign: "center", marginBottom: spacing.xl },
  buttonGroup: { gap: spacing.lg },
});
