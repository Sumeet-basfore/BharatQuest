// BharatQuest – Entry Point
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider, useGame } from "./src/context/GameContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import ExpoSmsInterceptor from "./modules/expo-sms-interceptor";
import { analyzeScamText } from "./src/services/aiDetection";
import { SmsInterceptorModal } from "./src/components/game/SmsInterceptorModal";

/**
 * Global listener for incoming SMS messages.
 * Uses the native interceptor and heuristic AI to flag scams.
 */
function SmsListener() {
  const { dispatch } = useGame();

  useEffect(() => {
    // Subscribe to native SMS events
    const subscription = ExpoSmsInterceptor.addListener("onSmsReceived", async (event) => {
      const { messageBody, sender } = event;
      
      // Run the heuristic AI detection
      const isScam = await analyzeScamText(messageBody);
      
      if (isScam) {
        // Trigger the Fortune Teller alert
        dispatch({ 
          type: "SET_SMS_ALERT", 
          payload: { messageBody, sender } 
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  return <SmsInterceptorModal />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <SmsListener />
        <RootNavigator />
      </GameProvider>
    </SafeAreaProvider>
  );
}
