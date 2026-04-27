// BharatQuest – ScreenShell
// Safe area wrapper with consistent dark background

import React, { ReactNode } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../config/theme";

interface ScreenShellProps {
  children: ReactNode;
  backgroundColor?: string;
}

export function ScreenShell({
  children,
  backgroundColor = colors.background,
}: ScreenShellProps) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      <View style={[styles.container, { backgroundColor }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
