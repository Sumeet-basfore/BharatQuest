// BharatQuest – Bottom Tab Navigator
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { LearnScreen } from "../screens/LearnScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { useGame } from "../context/GameContext";
import { colors, radii } from "../config/theme";

import { useContent } from "../config/content";

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  const content = useContent();
  const { state } = useGame();
  const isDark = state.darkMode;

  const tabBarBg = isDark ? "#111827" : "#FFFFFF";
  const tabBarBorder = isDark ? "#1F2937" : "#E2E8F0";
  const inactiveColor = isDark ? "#6B7280" : "#9CA3AF";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: string = "home";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Learn") {
            iconName = focused ? "shield-check" : "shield-check-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-circle" : "account-circle-outline";
          }

          return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <MaterialCommunityIcons name={iconName as any} size={24} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: content.nav.home }} />
      <Tab.Screen name="Learn" component={LearnScreen} options={{ tabBarLabel: content.nav.learn }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: content.nav.profile }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 28,
    borderRadius: radii.md,
  },
  iconWrapActive: {
    backgroundColor: "rgba(99, 102, 241, 0.12)",
  },
});
