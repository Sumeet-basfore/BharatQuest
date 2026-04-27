// BharatQuest – Animated Counter Hook
// Smooth number animation for balance and trust score

import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function useAnimatedValue(
  targetValue: number,
  duration: number = 1500
): Animated.Value {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: targetValue,
      duration,
      useNativeDriver: false,
    }).start();
  }, [targetValue, duration]);

  return animatedValue;
}
