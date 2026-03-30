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

const LANGUAGES = [
  {
    id: "english",
    label: "English",
    native: "English",
    flag: "🇺🇸",
    desc: "Full content library — widest resource coverage.",
    color: "#3B5BDB",
    bg: "#EEF2FF",
  },
  {
    id: "hindi",
    label: "Hindi",
    native: "हिंदी",
    flag: "🇮🇳",
    desc: "Curated roadmaps with Hindi explanations.",
    color: "#0CA678",
    bg: "#E6FCF5",
  },
  {
    id: "hinglish",
    label: "Hinglish",
    native: "Hinglish",
    flag: "🤝",
    desc: "Mix of Hindi & English — most popular in India.",
    color: "#E67700",
    bg: "#FFF9DB",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Language({ navigation, route }) {
  const { topic, level, commitment } = route?.params ?? {};
  const [selected, setSelected] = useState(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(LANGUAGES.map(() => new Animated.Value(0))).current;
  const tipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 12,
      }),
      Animated.stagger(
        80,
        cardAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 10,
          }),
        ),
      ),
      Animated.spring(tipAnim, {
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
        <View style={[styles.pill, styles.pillDone]} />
        <View style={[styles.pill, styles.pillActive]} />
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
          <Text style={styles.step}>STEP 4 OF 4</Text>
          <Text style={styles.heading}>
            Choose your{"\n"}preferred language
          </Text>
          <Text style={styles.sub}>
            Your roadmap content will be explained and curated in the language
            you feel most comfortable with.
          </Text>
        </Animated.View>

        {/* ── Language Cards ── */}
        <View style={styles.cards}>
          {LANGUAGES.map((lang, i) => {
            const isSelected = selected === lang.id;
            const anim = cardAnims[i];

            return (
              <Animated.View
                key={lang.id}
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
                      borderColor: lang.color,
                      borderWidth: 2,
                      backgroundColor: lang.bg,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setSelected(lang.id)}
                >
                  {/* Flag / Emoji Badge */}
                  <View style={[styles.flagWrap, { backgroundColor: lang.bg }]}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                  </View>

                  {/* Text */}
                  <View style={styles.cardContent}>
                    <View style={styles.labelRow}>
                      <Text
                        style={[
                          styles.cardLabel,
                          isSelected && { color: lang.color },
                        ]}
                      >
                        {lang.label}
                      </Text>
                      {lang.native !== lang.label && (
                        <Text
                          style={[styles.nativeLabel, { color: lang.color }]}
                        >
                          {lang.native}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.cardDesc}>{lang.desc}</Text>
                  </View>

                  {/* Check */}
                  {isSelected && (
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: lang.color },
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

        {/* ── Info Tip ── */}
        <Animated.View
          style={[
            styles.tip,
            {
              opacity: tipAnim,
              transform: [
                {
                  translateY: tipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            You can change your language preference anytime from Settings.
          </Text>
        </Animated.View>
      </View>

      {/* ── CTA ── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          activeOpacity={0.85}
          disabled={!selected}
          onPress={() =>
            navigation.navigate("Generate", {
              topic,
              level,
              commitment,
              language: selected,
            })
          }
        >
          <Text style={styles.ctaText}>Generate My Roadmap ✦</Text>
        </TouchableOpacity>
        <Text style={styles.ctaHint}>
          By continuing, you agree to our curator's logic for path generation.
        </Text>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
    lineHeight: 36,
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
  flagWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  flag: { fontSize: 24 },
  cardContent: { flex: 1 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  nativeLabel: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.75,
  },
  cardDesc: { fontSize: 12, color: "#6B7280", lineHeight: 17 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkMark: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  tipIcon: { fontSize: 18 },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: "#0369A1",
    lineHeight: 17,
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
    marginBottom: 10,
  },
  ctaDisabled: { backgroundColor: "#C7D2FE" },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  ctaHint: {
    textAlign: "center",
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
});
