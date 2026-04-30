// BharatQuest – Root Navigator
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabNavigator } from "./MainTabNavigator";
import { ChatScreen } from "../screens/ChatScreen";
import { DecisionScreen } from "../screens/DecisionScreen";
import { ResultScreen } from "../screens/ResultScreen";
import { useGame } from "../context/GameContext";

// IMPORT the new database functions instead of the old storage service
import { getUser, loadProgressFromDB } from "../database";

const Stack = createNativeStackNavigator();

// 1. Define the props to accept onLogout from App.tsx
type RootNavigatorProps = {
  onLogout: () => void;
};

export function RootNavigator({ onLogout }: RootNavigatorProps) {
  const { dispatch } = useGame();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // 1. Find out WHO just logged in
        const activeUser = getUser();
        
        if (activeUser) {
          // 2. Look for THEIR specific save file in the database
          const snapshot = loadProgressFromDB(activeUser.username);
          
          // 3. If they have played before, restore their progress!
          if (snapshot) {
            console.log(`Restoring game for ${activeUser.username}...`);
            
            if (snapshot.balance !== undefined) dispatch({ type: "UPDATE_BALANCE", payload: snapshot.balance });
            if (snapshot.trustScore !== undefined) dispatch({ type: "UPDATE_TRUST", payload: snapshot.trustScore });
            if (snapshot.flowStep) dispatch({ type: "SET_FLOW_STEP", payload: snapshot.flowStep });
            if (snapshot.decision) dispatch({ type: "SET_DECISION", payload: snapshot.decision });
            if (snapshot.currentLevel) dispatch({ type: "SET_LEVEL", payload: snapshot.currentLevel });
            if (snapshot.language) dispatch({ type: "SET_LANGUAGE", payload: snapshot.language });

<<<<<<< Updated upstream
        // Restore onboarding completion from persisted flag
        if (snapshot.onboardingComplete) {
          dispatch({ type: "COMPLETE_ONBOARDING" });
        }

        // Restore reward banner seen state so auto-advance doesn't re-trigger
        if (snapshot.hasSeenRewardBanner) {
          dispatch({ type: "MARK_REWARD_SEEN" });
        }

        // Restore assisted mode
        if (snapshot.assistedMode) {
          dispatch({ type: "TOGGLE_ASSISTED_MODE" });
=======
            // Infer onboarding completion
            if (snapshot.currentLevel > 1 || snapshot.flowStep !== "dashboard") {
              dispatch({ type: "COMPLETE_ONBOARDING" });
            }

            // Restore assisted mode
            if (snapshot.assistedMode) {
              dispatch({ type: "TOGGLE_ASSISTED_MODE" });
            }
          } else {
            console.log(`New player detected: ${activeUser.username}. Starting fresh.`);
          }
>>>>>>> Stashed changes
        }
      } catch (error) {
        console.error("[RootNavigator] Failed to load snapshot:", error);
      }

      setIsReady(true);
    }
    init();
  }, [dispatch]);

  if (!isReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
<<<<<<< Updated upstream
        {/* Main app: tabbed home/learn/profile */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
        {/* Full-screen modal flows (layered on top of tabs) */}
=======
        {/* 2. Pass onLogout to the MainTabNavigator using a render function */}
        <Stack.Screen name="Main">
          {(props) => <MainTabNavigator {...props} onLogout={onLogout} />}
        </Stack.Screen>
        
        <Stack.Screen name="RewardPopupScreen" component={RewardPopupScreen} />
>>>>>>> Stashed changes
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="DecisionScreen" component={DecisionScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}