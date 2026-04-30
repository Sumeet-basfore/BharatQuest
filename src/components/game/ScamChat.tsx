// BharatQuest – Scam Chat (State 3)
// Scripted chat interface with NPC avatar, bubbles, typing indicator

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, typography, spacing, radii, shadows } from "../../config/theme";
import { useContent } from "../../config/content";
import { useGame } from "../../context/GameContext";
import { ChatMessage } from "../../types/game";

const scammerAvatar = require("../../assets/images/scammer_avatar.png");

interface ScamChatProps {
  onAllMessagesShown: () => void;
  onPhishingLinkShown: () => void;
  messageDelay?: number;
}

export function ScamChat({
  onAllMessagesShown,
  onPhishingLinkShown,
  messageDelay = 2200, // Slower default speed (was 1500)
}: ScamChatProps) {
  const { state } = useGame();
  const content = useContent();
  const levelData = content.levels[Math.min(state.currentLevel - 1, content.levels.length - 1)];
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [isFinished, setIsFinished] = useState(false); // Track when all messages are done
  const scrollRef = useRef<ScrollView>(null);
  const messages = levelData.chat.messages as unknown as ChatMessage[];

  const actualDelay = state.assistedMode ? 3500 : messageDelay;

  useEffect(() => {
    let currentIndex = 0;
    const timers: NodeJS.Timeout[] = [];
    let unmounted = false;

    const showNextMessage = () => {
      if (unmounted || currentIndex >= messages.length) {
        if (!unmounted) {
          setIsTyping(false);
          setIsFinished(true); // Show the Next button
        }
        return;
      }

      setIsTyping(true);

      timers.push(setTimeout(() => {
        if (unmounted) return;
        const msg = messages[currentIndex];
        setVisibleMessages((prev) => [...prev, msg]);
        setIsTyping(false);

        // Check if this is the phishing link message
        if (msg.isLink) {
          onPhishingLinkShown();
        }

        currentIndex++;

        if (currentIndex < messages.length) {
          // Delay between messages (was 600, now 1000 for slower pace)
          timers.push(setTimeout(showNextMessage, 1000));
        } else {
          // Final delay before showing the Next button
          timers.push(setTimeout(() => { 
            if (!unmounted) {
              setIsFinished(true);
            }
          }, 1200));
        }
      }, actualDelay));
    };

    timers.push(setTimeout(showNextMessage, 800));

    return () => {
      unmounted = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [visibleMessages, isTyping, isFinished]);

  return (
    <View style={styles.container}>
      {/* NPC header */}
      <View style={styles.npcHeader}>
        <Image source={scammerAvatar} style={styles.avatar} />
        <View style={styles.npcInfo}>
          <Text style={styles.npcName}>{levelData.chat.npcName}</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.npcRole}>{levelData.chat.npcRole}</Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="phone"
          size={22}
          color={colors.textSecondary}
        />
      </View>

      {/* Chat area */}
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timestamp */}
          <View style={styles.timestampRow}>
            <Text style={styles.timestamp}>{content.chatScreen.today}, 2:34 PM</Text>
          </View>

          {visibleMessages.map((msg, index) => (
            <MessageBubble key={msg.id} message={msg} index={index} />
          ))}

          {isTyping && <TypingIndicator />}
          
          {/* Padding at the bottom so the last message isn't hidden by the button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Next Button — appears at the bottom after chat finishes */}
        {isFinished && (
          <Animated.View style={styles.nextButtonContainer}>
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={onAllMessagesShown}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>{content.chatScreen.whatShouldIDo}</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

function MessageBubble({
  message,
  index,
}: {
  message: ChatMessage;
  index: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          message.isLink && styles.linkBubble,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            message.isLink && styles.linkText,
          ]}
        >
          {message.text}
        </Text>
        <Text style={styles.bubbleTime}>
          2:{34 + index} PM
        </Text>
      </View>
    </Animated.View>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

    animate(dot1, 0).start();
    animate(dot2, 200).start();
    animate(dot3, 400).start();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.typingDot, { opacity: dot }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.chatBg,
  },
  npcHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.scamGreen,
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.scamGreen,
  },
  npcRole: {
    fontSize: typography.xs,
    color: colors.scamGreen,
    fontWeight: "500",
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  timestampRow: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  timestamp: {
    fontSize: typography.xs,
    color: colors.textMuted,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    overflow: "hidden",
  },
  bubbleContainer: {
    marginBottom: spacing.sm,
    alignItems: "flex-start",
    maxWidth: "85%",
  },
  bubble: {
    backgroundColor: colors.chatBubbleNpc,
    borderRadius: radii.lg,
    borderTopLeftRadius: radii.sm,
    padding: spacing.md,
    maxWidth: "100%",
  },
  linkBubble: {
    backgroundColor: "#1A3A2A",
    borderWidth: 1,
    borderColor: colors.scamGreen,
  },
  bubbleText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  linkText: {
    color: "#69B4FF",
    textDecorationLine: "underline",
  },
  bubbleTime: {
    fontSize: 10,
    color: colors.textMuted,
    alignSelf: "flex-end",
    marginTop: spacing.xs,
  },
  typingContainer: {
    marginTop: spacing.sm,
    alignItems: "flex-start",
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: colors.chatBubbleNpc,
    borderRadius: radii.lg,
    borderTopLeftRadius: radii.sm,
    padding: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: typography.md,
    fontWeight: "700",
  },
});
