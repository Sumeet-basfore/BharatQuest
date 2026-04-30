// BharatQuest – Entry Point
import React, { useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider, useGame } from "./src/context/GameContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import ExpoSmsInterceptor from "./modules/expo-sms-interceptor";
import { analyzeScamText } from "./src/services/aiDetection";
import { SmsInterceptorModal } from "./src/components/game/SmsInterceptorModal";

/**
 * Global listener for incoming SMS messages.
 * Uses the native interceptor and heuristic AI to flag scams.
 * Hardened with: permission request, try/catch, null guards.
 */
function SmsListener() {
  const { dispatch } = useGame();

  // Request SMS permission at runtime (required for Android 6+)
  useEffect(() => {
    async function requestSmsPermission() {
      if (Platform.OS !== "android") return;
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: "SMS Permission",
            message: "BharatQuest needs SMS access to detect scam messages in real-time.",
            buttonPositive: "Allow",
            buttonNegative: "Deny",
          }
        );
        console.log("[SMS] Permission result:", granted);
      } catch (err) {
        console.warn("[SMS] Permission request failed:", err);
      }
    }
    requestSmsPermission();
  }, []);

  // Subscribe to native SMS events
  useEffect(() => {
    const subscription = ExpoSmsInterceptor.addListener("onSmsReceived", async (event) => {
      try {
        const messageBody = event?.messageBody;
        const sender = event?.sender || "Unknown";

        if (!messageBody || typeof messageBody !== "string") {
          console.warn("[SmsListener] Received malformed SMS event, ignoring");
          return;
        }

        // Run the heuristic AI detection
        const isScam = await analyzeScamText(messageBody);
        
        if (isScam) {
          // Trigger the Fortune Teller alert
          dispatch({ 
            type: "SET_SMS_ALERT", 
            payload: { messageBody, sender } 
          });
        }
      } catch (error) {
        console.error("[SmsListener] Error processing SMS:", error);
        // Never crash — silently ignore malformed events
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
