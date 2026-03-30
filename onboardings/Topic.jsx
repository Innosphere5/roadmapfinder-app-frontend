import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Data ────────────────────────────────────────────────────────────────────

const TOPICS = [
  {
    id: "webdev",
    title: "Web Development",
    subtitle: "Full-stack mastery, from UI design to scalable backends.",
    icon: "< >",
    color: "#3B5BDB",
    bg: "#EEF2FF",
  },
  {
    id: "appdev",
    title: "App Development",
    subtitle: "Build cross-platform mobile apps with React Native & Flutter.",
    icon: "📱",
    color: "#0CA678",
    bg: "#E6FCF5",
  },
  {
    id: "aiml",
    title: "AI / ML",
    subtitle: "Neural networks, data models, and intelligent systems.",
    icon: "✦",
    color: "#7048E8",
    bg: "#F3F0FF",
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    subtitle: "Craft beautiful, user-centered digital experiences.",
    icon: "✏️",
    color: "#E67700",
    bg: "#FFF9DB",
  },
  {
    id: "programming",
    title: "Programming Languages",
    subtitle: "Master Python, JavaScript, Go, Rust and more.",
    icon: "{ }",
    color: "#C92A2A",
    bg: "#FFF5F5",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Topic({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const searchAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(TOPICS.map(() => new Animated.Value(0))).current;

  // Staggered entrance on mount
  React.useEffect(() => {
    const anims = cardAnims.map((anim, i) =>
      Animated.spring(anim, {
        toValue: 1,
        delay: 80 * i,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
      }),
    );
    Animated.stagger(60, anims).start();
  }, []);

  const handleSearchFocus = () => {
    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchBlur = () => {
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const searchBorder = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E5E7EB", "#3B5BDB"],
  });

  const filtered = TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = useCallback((id) => {
    setSelected(id);
  }, []);

  const canContinue = !!selected;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Progress Bar ── */}
      <View style={styles.progressRow}>
        <View style={[styles.pill, styles.pillActive]} />
        <View style={styles.pill} />
        <View style={styles.pill} />
        <View style={styles.pill} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <Text style={styles.step}>STEP 1 OF 4</Text>
        <Text style={styles.heading}>Select your{"\n"}learning goal</Text>
        <Text style={styles.sub}>
          Choose the path that aligns with your career aspirations. We'll curate
          a personalized roadmap to guide your professional growth.
        </Text>

        {/* ── Search ── */}
        <Animated.View
          style={[styles.searchWrap, { borderColor: searchBorder }]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </Animated.View>

        {/* ── Cards ── */}
        <View style={styles.cardsWrap}>
          {filtered.length === 0 && (
            <Text style={styles.noResult}>No topics match "{query}"</Text>
          )}
          {filtered.map((topic, idx) => {
            const anim = cardAnims[TOPICS.findIndex((t) => t.id === topic.id)];
            const isSelected = selected === topic.id;

            return (
              <Animated.View
                key={topic.id}
                style={{
                  opacity: anim,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [24, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.card,
                    isSelected && {
                      borderColor: topic.color,
                      borderWidth: 2,
                      backgroundColor: topic.bg,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleSelect(topic.id)}
                >
                  {/* Icon Badge */}
                  <View
                    style={[styles.iconBadge, { backgroundColor: topic.bg }]}
                  >
                    <Text
                      style={[
                        styles.iconText,
                        { color: topic.color, fontFamily: "monospace" },
                      ]}
                    >
                      {topic.icon}
                    </Text>
                  </View>

                  {/* Labels */}
                  <View style={styles.cardText}>
                    <Text
                      style={[
                        styles.cardTitle,
                        isSelected && { color: topic.color },
                      ]}
                    >
                      {topic.title}
                    </Text>
                    <Text style={styles.cardSub}>{topic.subtitle}</Text>
                  </View>

                  {/* Check */}
                  {isSelected && (
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: topic.color },
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
      </ScrollView>

      {/* ── CTA ── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={() => navigation.navigate("Level", { topic: selected })}
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
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  pillActive: {
    backgroundColor: "#3B5BDB",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
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
    lineHeight: 36,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 20,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    padding: 0,
  },
  cardsWrap: {
    gap: 12,
  },
  noResult: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 24,
  },
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
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconText: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
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
  ctaDisabled: {
    backgroundColor: "#C7D2FE",
  },
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
