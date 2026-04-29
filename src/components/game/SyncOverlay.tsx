// BharatQuest – Sync Overlay (State 6)
// CSS-animated cloud sync with progress ring and checkmark
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { colors, typography, spacing, radii } from "../../config/theme";
import { useContent } from "../../config/content";

interface SyncOverlayProps {
  onComplete: () => void;
}

export function SyncOverlay({ onComplete }: SyncOverlayProps) {
  const content = useContent();
  const [phase, setPhase] = useState<"syncing" | "success">("syncing");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    // Progress 0-100% over 2s
    const listener = progressAnim.addListener(({ value }) => {
      setProgressPct(Math.round(value));
    });

    Animated.timing(progressAnim, {
      toValue: 100, duration: 2000, easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start(() => {
      // Show checkmark
      setPhase("success");
      Animated.spring(checkScale, {
        toValue: 1, damping: 12, stiffness: 200, useNativeDriver: true,
      }).start();

      // Fade out and complete after 1s hold
      setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
          onComplete();
        });
      }, 1000);
    });

    return () => {
      progressAnim.removeListener(listener);
    };
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim, zIndex: 80 }]}>
      <BlurView intensity={30} tint="dark" style={styles.overlay}>
        <View style={styles.center}>
          {phase === "syncing" ? (
            <>
              <View style={styles.cloudContainer}>
                <MaterialCommunityIcons name="cloud-upload" size={64} color={colors.deceptiveBlue} />
                <View style={styles.progressRing}>
                  <Text style={styles.progressText}>{progressPct}%</Text>
                </View>
              </View>
              <Text style={styles.syncText}>{content.sync.syncingText}</Text>
            </>
          ) : (
            <>
              <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                <MaterialCommunityIcons name="cloud-check" size={80} color={colors.successGreen} />
              </Animated.View>
              <Text style={styles.successText}>{content.sync.successText}</Text>
              <Text style={styles.subtitle}>{content.sync.subtitle}</Text>
            </>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { alignItems: "center", gap: spacing.xl },
  cloudContainer: { alignItems: "center", justifyContent: "center" },
  progressRing: { marginTop: spacing.md, width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: colors.deceptiveBlue, alignItems: "center", justifyContent: "center" },
  progressText: { fontSize: typography.xl, fontWeight: "800", color: colors.deceptiveBlue },
  syncText: { fontSize: typography.lg, fontWeight: "600", color: colors.textPrimary },
  successText: { fontSize: typography.xl, fontWeight: "800", color: colors.successGreen },
  subtitle: { fontSize: typography.sm, color: colors.textSecondary, textAlign: "center" },
});
