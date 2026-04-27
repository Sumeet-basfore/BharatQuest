// BharatQuest – AsyncStorage Persistence
// Per TDD §5: persist only the minimum durable state

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlowStep, Decision } from "../types/game";

const STORAGE_KEYS = {
  balance: "bharatquest.balance",
  trustScore: "bharatquest.trustScore",
  flowStep: "bharatquest.flowStep",
  decision: "bharatquest.decision",
  syncComplete: "bharatquest.syncComplete",
} as const;

export async function loadGameSnapshot() {
  const [balanceRaw, trustRaw, flowRaw, decisionRaw, syncRaw] =
    await AsyncStorage.multiGet([
      STORAGE_KEYS.balance,
      STORAGE_KEYS.trustScore,
      STORAGE_KEYS.flowStep,
      STORAGE_KEYS.decision,
      STORAGE_KEYS.syncComplete,
    ]);

  const getValue = (pair: [string, string | null]) => pair[1];

  return {
    balance: Number(getValue(balanceRaw as [string, string | null]) ?? 5000),
    trustScore: Number(getValue(trustRaw as [string, string | null]) ?? 80),
    flowStep: (getValue(flowRaw as [string, string | null]) ?? "dashboard") as FlowStep,
    decision: (getValue(decisionRaw as [string, string | null]) ?? null) as Decision,
    syncComplete: getValue(syncRaw as [string, string | null]) === "true",
  };
}

export async function saveGameSnapshot(snapshot: {
  balance: number;
  trustScore: number;
  flowStep: FlowStep;
  decision: Decision;
  syncComplete: boolean;
}) {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.balance, String(snapshot.balance)],
    [STORAGE_KEYS.trustScore, String(snapshot.trustScore)],
    [STORAGE_KEYS.flowStep, snapshot.flowStep],
    [STORAGE_KEYS.decision, snapshot.decision ?? ""],
    [STORAGE_KEYS.syncComplete, String(snapshot.syncComplete)],
  ]);
}

export async function resetGameSnapshot() {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
