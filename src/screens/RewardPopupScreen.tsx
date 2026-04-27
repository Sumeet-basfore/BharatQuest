// BharatQuest – Reward Popup Screen (State 2)
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ScreenShell } from "../components/common/ScreenShell";
import { RewardBanner } from "../components/game/RewardBanner";
import { HUDStat } from "../components/common/HUDStat";
import { FarmBackdrop } from "../components/game/FarmBackdrop";
import { useGame } from "../context/GameContext";
import { colors, spacing, timing } from "../config/theme";
import { content } from "../config/content";
import { Audio } from "expo-av";

export function RewardPopupScreen({ navigation }: any) {
  const { state, dispatch } = useGame();

  useEffect(() => {
    // Play cash register sound
    async function playSound() {
      // In a real app we'd load an asset here. For demo we simulate it or leave silent if no asset.
      // const { sound } = await Audio.Sound.createAsync(require("../../assets/audio/cash.mp3"));
      // await sound.playAsync();
    }
    playSound();
  }, []);

  const handleDismiss = () => {
    dispatch({ type: "MARK_REWARD_SEEN" });
    dispatch({ type: "SET_FLOW_STEP", payload: "chat" });
    navigation.replace("ChatScreen");
  };

  return (
    <ScreenShell>
      <View style={styles.header}>
        <View style={styles.hudRow}>
          <HUDStat icon="currency-inr" label={content.dashboard.balanceLabel} value={state.balance} iconColor={colors.balanceGreen} />
          <HUDStat icon="shield-check" label={content.dashboard.trustLabel} value={state.trustScore} suffix="/100" />
        </View>
      </View>
      <View style={styles.content}>
        <FarmBackdrop />
      </View>
      
      {/* State 2 Overlay */}
      <RewardBanner onDismiss={handleDismiss} autoDismissMs={timing.rewardToChat} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, paddingBottom: 0 },
  hudRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  content: { flex: 1 },
});
