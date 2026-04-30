// BharatQuest – Finance Backdrop
// Static 2D digital finance illustration for the app background

import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const farmImage = require("../../assets/images/finance_backdrop.png");
const { width } = Dimensions.get("window");

export function FinanceBackdrop() {
  return (
    <View style={styles.container}>
      <Image
        source={farmImage}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Bottom gradient fade into dark background */}
      <View style={styles.gradientOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    margin: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
  },
});
