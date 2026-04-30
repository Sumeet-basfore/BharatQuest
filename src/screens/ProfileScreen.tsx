// BharatQuest – Profile Tab Screen
import React, { useState, useEffect } from "react"; 
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenShell } from "../components/common/ScreenShell";
import { useGame } from "../context/GameContext";
import { useContent } from "../config/content";
import { colors, spacing, radii, shadows } from "../config/theme";

// 1. IMPORT syncProgressToDB here!
import { getUser, saveUser, syncProgressToDB } from "../database"; 

type FontSize = "small" | "medium" | "large";

const FONT_OPTIONS: { label: string; value: FontSize }[] = [
  { label: "A", value: "small" },
  { label: "A", value: "medium" },
  { label: "A", value: "large" },
];

export function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const { state, dispatch } = useGame();
  
  // FIX: Initialize the content variable here so the translations work!
  const content = useContent();
  
  const [dbUser, setDbUser] = useState<{username: string, password?: string} | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passModalVisible, setPassModalVisible] = useState(false);

  const [editName, setEditName] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const loadUserData = () => {
    const data = getUser();
    if (data) {
      setDbUser(data);
      setEditName(data.username);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleUpdateProfile = () => {
    if (editName.trim().length < 2) return Alert.alert("Error", "Name too short");
    saveUser(editName, dbUser?.password || "");
    setEditModalVisible(false);
    loadUserData();
    Alert.alert("Success", "Profile updated!");
  };

  const handleUpdatePassword = () => {
    if (newPass.length < 4) return Alert.alert("Error", "PIN must be at least 4 digits");
    if (newPass !== confirmPass) return Alert.alert("Error", "PINs don't match");
    saveUser(dbUser?.username || "Nazia", newPass);
    setPassModalVisible(false);
    setNewPass("");
    setConfirmPass("");
    Alert.alert("Success", "Security PIN updated!");
  };

  const isDark = state.darkMode;
  const bg = isDark ? colors.background : "#F0F4FF";
  const cardBg = isDark ? colors.surface : "#FFFFFF";
  const cardBorder = isDark ? colors.surfaceLight : "#E2E8F0";
  const textPrimary = isDark ? colors.textPrimary : "#1A202C";
  const textSecondary = isDark ? colors.textSecondary : "#4A5568";
  const textMuted = isDark ? colors.textMuted : "#718096";
  const divider = isDark ? colors.surfaceLight : "#E2E8F0";

  const fontScale = state.fontSize === "small" ? 0.88 : state.fontSize === "large" ? 1.14 : 1;
  const avatarLabel = dbUser ? dbUser.username.substring(0, 2).toUpperCase() : "BQ";
  const creditScore = 300 + Math.round(state.trustScore * 6.5);

  return (
    <ScreenShell>
      <ScrollView style={[styles.scroll, { backgroundColor: bg }]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* ── Header ── */}
        <View style={[styles.profileHeader, { backgroundColor: isDark ? colors.surface : "#6366F1" }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarLabel}</Text>
          </View>
          <Text style={[styles.profileName, { fontSize: 22 * fontScale }]}>{dbUser ? dbUser.username : "Nazia"}</Text>
          <Text style={[styles.profileSub, { fontSize: 13 * fontScale }]}>{content.profile.trustScoreFormat}: {state.trustScore}/100 · {content.profile.creditFormat}: {creditScore}</Text>
        </View>

        {/* ── Manage Account ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>{content.profile.manageAccount}</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            
            <TouchableOpacity style={styles.menuRow} onPress={() => setEditModalVisible(true)}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}><MaterialCommunityIcons name="account-edit-outline" size={20} color={colors.primary} /></View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.profile.editProfile}</Text>
                <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{content.profile.editProfileSub}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={textMuted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            <TouchableOpacity style={styles.menuRow}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}><MaterialCommunityIcons name="bell-outline" size={20} color={colors.primary} /></View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.profile.notifications}</Text>
                <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{content.profile.notificationsSub}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={textMuted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            <TouchableOpacity style={styles.menuRow} onPress={() => setPassModalVisible(true)}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}><MaterialCommunityIcons name="lock-outline" size={20} color={colors.primary} /></View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.profile.changePin}</Text>
                <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{content.profile.changePinSub}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={textMuted} />
            </TouchableOpacity>

          </View>
        </View>

        {/* ── Settings ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary, fontSize: 12 * fontScale }]}>{content.profile.settingsSection}</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            
            <View style={styles.menuRow}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}><MaterialCommunityIcons name={isDark ? "weather-night" : "white-balance-sunny"} size={20} color={isDark ? "#A78BFA" : "#F59E0B"} /></View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{isDark ? content.profile.darkMode : content.profile.lightMode}</Text>
                <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{isDark ? content.profile.switchLight : content.profile.switchDark}</Text>
              </View>
              <Switch value={isDark} onValueChange={() => dispatch({ type: "TOGGLE_DARK_MODE" })} trackColor={{ false: "#D1D5DB", true: "#6366F1" }} />
            </View>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            <View style={[styles.menuRow, { alignItems: "flex-start" }]}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}><MaterialCommunityIcons name="format-size" size={20} color={colors.primary} /></View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.profile.fontSize}</Text>
                <View style={styles.optionRow}>
                  {FONT_OPTIONS.map((opt) => (
                    <TouchableOpacity key={opt.value} onPress={() => dispatch({ type: "SET_FONT_SIZE", payload: opt.value })} style={[styles.optionBtn, { backgroundColor: state.fontSize === opt.value ? colors.primary : "transparent", borderColor: divider }]}>
                      <Text style={{ color: state.fontSize === opt.value ? "#fff" : textSecondary, fontWeight: 'bold' }}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            <View style={styles.menuRow}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}><MaterialCommunityIcons name="hand-heart-outline" size={20} color={colors.scamGreen} /></View>
              <View style={styles.menuTextBox}>
                {/* FIX: Optional chaining ensures no crashes if content loads slowly */}
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content?.settings?.assistedMode || "Assisted Mode"}</Text>
                <Text style={[styles.menuSub, { color: textMuted, fontSize: 12 * fontScale }]}>{content?.profile?.assistedModeSub || "Slower pace with extra guidance"}</Text>
              </View>
              <Switch value={state.assistedMode} onValueChange={() => dispatch({ type: "TOGGLE_ASSISTED_MODE" })} trackColor={{ false: "#D1D5DB", true: colors.scamGreen }} />
            </View>

            <View style={[styles.divider, { backgroundColor: divider }]} />

            <View style={[styles.menuRow, { alignItems: "flex-start" }]}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? colors.surfaceLight : "#EBF4FF" }]}><MaterialCommunityIcons name="translate" size={20} color={colors.primary} /></View>
              <View style={styles.menuTextBox}>
                <Text style={[styles.menuLabel, { color: textPrimary, fontSize: 15 * fontScale }]}>{content.settings.language}</Text>
                <View style={styles.optionRow}>
                  {(['en', 'hi', 'as'] as const).map((l) => (
                    <TouchableOpacity 
                      key={l} 
                      onPress={() => dispatch({ type: "SET_LANGUAGE", payload: l })} 
                      style={[styles.langBtn, { backgroundColor: state.language === l ? colors.primary : "transparent", borderColor: divider }]}
                    >
                      <Text style={{ color: state.language === l ? "#fff" : textSecondary, fontSize: 11 }}>
                        {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'অসমীয়া'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Logout ── */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutBtn, { borderColor: colors.failureRed }]} 
            onPress={() => {
              // 2. SAVING PROGRESS BEFORE LOGOUT
              if (dbUser) {
                syncProgressToDB(dbUser.username, state);
              }
              
              dispatch({ type: "RESET_GAME" });
              onLogout(); 
            }}
          >
            <MaterialCommunityIcons name="logout" size={20} color={colors.failureRed} />
            <Text style={styles.logoutText}>{content.profile.logout}</Text>
          </TouchableOpacity>
          <Text style={[styles.logoutHint, { color: textMuted }]}>{content.profile.logoutHint}</Text>
        </View>

        {/* ── Modals ── */}
        <Modal visible={editModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}><View style={[styles.modalCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textPrimary }]}>Edit Profile Name</Text>
            <TextInput style={[styles.input, { backgroundColor: isDark ? "#333" : "#F3F4F6", color: textPrimary }]} value={editName} onChangeText={setEditName} placeholder="New Username" placeholderTextColor="#999" />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}><Text style={{ color: textMuted }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateProfile}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>Update</Text></TouchableOpacity>
            </View>
          </View></View>
        </Modal>

        <Modal visible={passModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}><View style={[styles.modalCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textPrimary }]}>Update Security PIN</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#F3F4F6", color: textPrimary }]} 
              value={newPass} 
              onChangeText={(val) => setNewPass(val.replace(/[^0-9]/g, ''))} 
              placeholder="New 4-digit PIN" 
              secureTextEntry 
              keyboardType="number-pad" 
              placeholderTextColor="#999" 
            />
            <TextInput 
              style={[styles.input, { backgroundColor: isDark ? "#333" : "#F3F4F6", color: textPrimary }]} 
              value={confirmPass} 
              onChangeText={(val) => setConfirmPass(val.replace(/[^0-9]/g, ''))} 
              placeholder="Confirm PIN" 
              secureTextEntry 
              keyboardType="number-pad" 
              placeholderTextColor="#999" 
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setPassModalVisible(false)}><Text style={{ color: textMuted }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleUpdatePassword}>
                <Text style={{ color: colors.failureRed, fontWeight: 'bold' }}>Set PIN</Text>
              </TouchableOpacity>
            </View>
          </View></View>
        </Modal>

      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  profileHeader: { paddingVertical: 40, alignItems: "center", gap: 5 },
  avatarCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.5)" },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  profileName: { fontWeight: "800", color: "#FFFFFF" },
  profileSub: { color: "rgba(255,255,255,0.75)" },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 },
  card: { borderRadius: 15, borderWidth: 1, overflow: "hidden", ...shadows.card },
  menuRow: { flexDirection: "row", alignItems: "center", padding: 15, gap: 15 },
  menuIconBox: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  menuTextBox: { flex: 1 },
  menuLabel: { fontWeight: "600" },
  menuSub: { marginTop: 2 },
  divider: { height: 1, marginLeft: 65 },
  optionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  optionBtn: { width: 45, height: 45, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  langBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderWidth: 1.5, borderRadius: 15, paddingVertical: 15, marginTop: 10 },
  logoutText: { fontWeight: "700", color: colors.failureRed },
  logoutHint: { textAlign: 'center', marginTop: 10, fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalCard: { borderRadius: 20, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { padding: 12, borderRadius: 10, marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' }
});