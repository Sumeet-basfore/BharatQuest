// BharatQuest – Voice FAB
// Floating action button that pulses with an animated waveform when speaking

import React, { useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, shadows } from "../../config/theme";

interface VoiceFabProps {
  isSpeaking?: boolean;
  enabled: boolean;
  onPress: () => void;
}

export function VoiceFab({ isSpeaking = false, enabled, onPress }: VoiceFabProps) {
  const wave1 = useRef(new Animated.Value(1)).current;
  const wave2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSpeaking) {
      const animateWave = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1.6,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const w1 = animateWave(wave1, 0);
      const w2 = animateWave(wave2, 400);

      w1.start();
      w2.start();

      return () => {
        w1.stop();
        w2.stop();
      };
    } else {
      wave1.setValue(1);
      wave2.setValue(1);
    }
  }, [isSpeaking]);

  return (
    <View style={styles.wrapper}>
      {isSpeaking && (
        <>
          <Animated.View style={[styles.wave, { transform: [{ scale: wave1 }], opacity: wave1.interpolate({ inputRange: [1, 1.6], outputRange: [0.6, 0] }) }]} />
          <Animated.View style={[styles.wave, { transform: [{ scale: wave2 }], opacity: wave2.interpolate({ inputRange: [1, 1.6], outputRange: [0.6, 0] }) }]} />
        </>
      )}
      <TouchableOpacity
        style={[
          styles.fab,
          enabled ? styles.fabEnabled : styles.fabDisabled,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={enabled ? "microphone" : "microphone-off"}
          size={28}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: spacing.xxl,
    right: spacing.xl,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  wave: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.deceptiveBlue,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  fabEnabled: {
    backgroundColor: colors.deceptiveBlue,
  },
  fabDisabled: {
    backgroundColor: colors.surfaceLight,
  },
});
