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

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    desc: "I'm starting from scratch",
    icon: "🎓",
    color: "#0CA678",
    bg: "#E6FCF5",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    desc: "I know the basics",
    icon: "📈",
    color: "#3B5BDB",
    bg: "#EEF2FF",
  },
  {
    id: "advanced",
    label: "Advanced",
    desc: "I'm looking to master specific skills",
    icon: "🏆",
    color: "#E67700",
    bg: "#FFF9DB",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Level({ navigation, route }) {
  const { topic } = route?.params ?? {};
  const [selected, setSelected] = useState(null);

  const cardAnims = useRef(LEVELS.map(() => new Animated.Value(0))).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
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
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Progress ── */}
      <View style={styles.progressRow}>
        <View style={[styles.pill, styles.pillDone]} />
        <View style={[styles.pill, styles.pillActive]} />
        <View style={styles.pill} />
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
          <Text style={styles.step}>STEP 2 OF 4</Text>
          <Text style={styles.heading}>Select your level</Text>
          <Text style={styles.sub}>
            We'll tailor your roadmap based on your current expertise to ensure
            the best learning pace.
          </Text>
        </Animated.View>

        {/* ── Cards ── */}
        <View style={styles.cards}>
          {LEVELS.map((level, i) => {
            const isSelected = selected === level.id;
            const anim = cardAnims[i];

            return (
              <Animated.View
                key={level.id}
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
                      borderColor: level.color,
                      borderWidth: 2,
                      backgroundColor: level.bg,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setSelected(level.id)}
                >
                  <View
                    style={[styles.iconWrap, { backgroundColor: level.bg }]}
                  >
                    <Text style={styles.icon}>{level.icon}</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text
                      style={[
                        styles.cardLabel,
                        isSelected && { color: level.color },
                      ]}
                    >
                      {level.label}
                    </Text>
                    <Text style={styles.cardDesc}>{level.desc}</Text>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: level.color },
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
      </View>

      {/* ── CTA ── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          activeOpacity={0.85}
          disabled={!selected}
          onPress={() =>
            navigation.navigate("Commitment", { topic, level: selected })
          }
        >
          <Text style={styles.ctaText}>Continue →</Text>
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
  backIcon: {
    fontSize: 22,
    color: "#374151",
  },
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
    marginBottom: 10,
  },
  sub: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 28,
  },
  cards: { gap: 12 },
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
