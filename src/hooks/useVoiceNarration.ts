// BharatQuest – Voice Narration Hook
// Per TDD §10: fires once per NPC message, prevents duplicates

import { useEffect, useRef } from "react";
import * as Speech from "expo-speech";

interface NarrationInput {
  messageId: string | null;
  text: string;
  enabled: boolean;
  language?: string;
}

export function useVoiceNarration({
  messageId,
  text,
  enabled,
  language = "en-IN",
}: NarrationInput) {
  const lastSpokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !messageId || !text) return;
    if (lastSpokenRef.current === messageId) return;

    Speech.stop();
    Speech.speak(text, {
      language,
      rate: 0.95,
      pitch: 1.0,
      onStart: () => {
        lastSpokenRef.current = messageId;
      },
    });

    return () => {
      Speech.stop();
    };
  }, [messageId, text, enabled, language]);
}
