import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Data ────────────────────────────────────────────────────────────────────

const OPTIONS = [
  {
    id: "1-2",
    label: "1–2 hrs/day",
    desc: "Sustainable & Steady",
    icon: "⏱",
    color: "#3B5BDB",
    bg: "#EEF2FF",
  },
  {
    id: "3-4",
    label: "3–4 hrs/day",
    desc: "Fast-Tracked Learning",
    icon: "⚡",
    color: "#E67700",
    bg: "#FFF9DB",
  },
  {
    id: "5+",
    label: "5+ hrs/day",
    desc: "Immersive Mastery",
    icon: "🚀",
    color: "#7048E8",
    bg: "#F3F0FF",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Commitment({ navigation, route }) {
  const { topic, level } = route?.params ?? {};
  const [selected, setSelected] = useState(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(OPTIONS.map(() => new Animated.Value(0))).current;
  const quoteAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 12,
      }),
      Animated.stagger(
        90,
        cardAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 10,
          }),
        ),
      ),
      Animated.spring(quoteAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 14,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Progress ── */}
      <View style={styles.progressRow}>
        <View style={[styles.pill, styles.pillDone]} />
        <View style={[styles.pill, styles.pillDone]} />
        <View style={[styles.pill, styles.pillActive]} />
        <View style={styles.pill} />
      </View>

      <View style={styles.body}>
        {/* ── Back ── */}
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* ── Header ── */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          }}
        >
          <Text style={styles.step}>STEP 3 OF 4</Text>
          <Text style={styles.heading}>
            How much time can{"\n"}you commit daily?
          </Text>
          <Text style={styles.sub}>
            Your pace determines the density of your roadmap modules.
          </Text>
        </Animated.View>

        {/* ── Cards ── */}
        <View style={styles.cards}>
          {OPTIONS.map((opt, i) => {
            const isSelected = selected === opt.id;
            const anim = cardAnims[i];

            return (
              <Animated.View
                key={opt.id}
                style={{
                  opacity: anim,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [28, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.card,
                    isSelected && {
                      borderColor: opt.color,
                      borderWidth: 2,
                      backgroundColor: opt.bg,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setSelected(opt.id)}
                >
                  <View style={[styles.iconWrap, { backgroundColor: opt.bg }]}>
                    <Text style={styles.icon}>{opt.icon}</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text
                      style={[
                        styles.cardLabel,
                        isSelected && { color: opt.color },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={styles.cardDesc}>{opt.desc}</Text>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: opt.color },
                      ]}
                    >
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* ── Social Proof Quote ── */}
        <Animated.View
          style={[
            styles.quoteCard,
            {
              opacity: quoteAnim,
              transform: [
                {
                  translateY: quoteAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.quoteLeft}>
            <View style={styles.quoteAvatar}>
              <Text style={styles.quoteAvatarEmoji}>🌟</Text>
            </View>
          </View>
          <Text style={styles.quoteText}>
            "Users who commit 3 hours daily reach mastery 40% faster on our
            curated paths."
          </Text>
        </Animated.View>

        {/* ── Step Indicator ── */}
        <Text style={styles.stepBottom}>
          STEP 1 OF 4{"   "}
          <Text style={styles.stepPct}>75% Complete</Text>
        </Text>
      </View>

      {/* ── CTA ── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          activeOpacity={0.85}
          disabled={!selected}
          onPress={() =>
            navigation.navigate("Language", {
              topic,
              level,
              commitment: selected,
            })
          }
        >
          <Text style={styles.ctaText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 4,
  },
  pill: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  pillActive: { backgroundColor: "#3B5BDB" },
  pillDone: { backgroundColor: "#A5B4FC" },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  back: {
    marginBottom: 20,
    alignSelf: "flex-start",
    padding: 4,
  },
  backIcon: { fontSize: 22, color: "#374151" },
  step: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 10,
  },
  sub: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 24,
  },
  cards: { gap: 12, marginBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    gap: 14,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
  cardContent: { flex: 1 },
  cardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  cardDesc: { fontSize: 12, color: "#6B7280" },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  quoteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  quoteLeft: { flexShrink: 0 },
  quoteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  quoteAvatarEmoji: { fontSize: 20 },
  quoteText: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
  stepBottom: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 16,
    letterSpacing: 0.5,
  },
  stepPct: {
    color: "#3B5BDB",
    fontWeight: "600",
  },
  ctaWrap: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  cta: {
    backgroundColor: "#3B5BDB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "#C7D2FE" },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
