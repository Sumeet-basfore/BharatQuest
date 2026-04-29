// BharatQuest – Root Navigator
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashboardScreen } from "../screens/DashboardScreen";
import { RewardPopupScreen } from "../screens/RewardPopupScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { DecisionScreen } from "../screens/DecisionScreen";
import { ResultScreen } from "../screens/ResultScreen";
import { loadGameSnapshot } from "../services/storage";
import { useGame } from "../context/GameContext";

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { dispatch } = useGame();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const snapshot = await loadGameSnapshot();
        dispatch({ type: "UPDATE_BALANCE", payload: snapshot.balance });
        dispatch({ type: "UPDATE_TRUST", payload: snapshot.trustScore });
        dispatch({ type: "SET_FLOW_STEP", payload: snapshot.flowStep });
        dispatch({ type: "SET_DECISION", payload: snapshot.decision });
        dispatch({ type: "SET_LEVEL", payload: snapshot.currentLevel });
        dispatch({ type: "SET_LANGUAGE", payload: snapshot.language });

        // Infer onboarding completion from persisted state:
        // If we've progressed past level 1 or flowStep isn't dashboard,
        // the user has already completed onboarding.
        if (snapshot.currentLevel > 1 || snapshot.flowStep !== "dashboard") {
          dispatch({ type: "COMPLETE_ONBOARDING" });
        }

        // Restore assisted mode
        if (snapshot.assistedMode) {
          dispatch({ type: "TOGGLE_ASSISTED_MODE" });
        }
      } catch (error) {
        console.error("[RootNavigator] Failed to load snapshot, using defaults:", error);
        // Continue with defaults — app still works
      }

      setIsReady(true);
    }
    init();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="RewardPopupScreen" component={RewardPopupScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="DecisionScreen" component={DecisionScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
