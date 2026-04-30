// BharatQuest – Entry Point
import { LoginScreen } from './src/screens/LoginScreen';
import { setupDatabase } from './src/database';
import React, { useEffect, useState } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider, useGame } from "./src/context/GameContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import ExpoSmsInterceptor from "./modules/expo-sms-interceptor";
import { analyzeScamText } from "./src/services/aiDetection";
import { SmsInterceptorModal } from "./src/components/game/SmsInterceptorModal";

function SmsListener() {
  const { dispatch } = useGame();

  useEffect(() => {
    try {
      setupDatabase(); 
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database failed to start:", error);
    }
    
    async function requestSmsPermission() {
      if (Platform.OS !== "android") return;
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: "SMS Permission",
            message: "BharatQuest needs SMS access to detect scam messages.",
            buttonPositive: "Allow",
            buttonNegative: "Deny",
          }
        );
      } catch (err) {
        console.warn("[SMS] Permission request failed:", err);
      }
    }
    requestSmsPermission();
  }, []);

  useEffect(() => {
    const subscription = ExpoSmsInterceptor.addListener("onSmsReceived", async (event) => {
      try {
        const messageBody = event?.messageBody;
        const sender = event?.sender || "Unknown";
        if (!messageBody) return;

        const isScam = await analyzeScamText(messageBody);
        if (isScam) {
          dispatch({ type: "SET_SMS_ALERT", payload: { messageBody, sender } });
        }
      } catch (error) {
        console.error("[SmsListener] Error:", error);
      }
    });

    return () => subscription.remove();
  }, [dispatch]);

  return <SmsInterceptorModal />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to return user to LoginScreen
  const handleLogout = () => {
    console.log("Logging out user...");
    setIsLoggedIn(false);
  };

  console.log("App Rendering. LoggedIn Status:", isLoggedIn);

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GameProvider>
        <SmsListener />
        
        <RootNavigator onLogout={handleLogout} />
      </GameProvider>
    </SafeAreaProvider>
  );
}
