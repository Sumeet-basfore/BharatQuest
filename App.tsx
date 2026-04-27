// BharatQuest – Entry Point
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider } from "./src/context/GameContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <RootNavigator />
      </GameProvider>
    </SafeAreaProvider>
  );
}
