import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constants ───────────────────────────────────────────────────────────────

const STAGES = [
  { key: "skill_gap", label: "Skill Gap Analysis", duration: 2200 },
  { key: "curating", label: "Curating Learning Path", duration: 2600 },
  { key: "modules", label: "Structuring Modules", duration: 2000 },
  { key: "finalizing", label: "Finalizing Roadmap", duration: 1800 },
];

const SPARKLE_COUNT = 6;

// ─── Sparkle Dot ─────────────────────────────────────────────────────────────

function SparkleDot({ delay, x, y }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.sparkleDot,
        {
          left: x,
          top: y,
          opacity: anim,
          transform: [{ scale: anim }],
        },
      ]}
    />
  );
}

// ─── Pulsing Orb ─────────────────────────────────────────────────────────────

function PulsingOrb() {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse1, {
          toValue: 1.08,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse1, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(pulse2, {
          toValue: 1.15,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse2, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.orbContainer}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.orbRing,
          styles.orbRingOuter,
          { transform: [{ scale: pulse2 }, { rotate: spin }] },
        ]}
      />
      {/* Inner ring */}
      <Animated.View
        style={[
          styles.orbRing,
          styles.orbRingInner,
          { transform: [{ scale: pulse1 }] },
        ]}
      />
      {/* Core */}
      <View style={styles.orbCore}>
        <Text style={styles.orbIcon}>✦</Text>
        <Text style={styles.orbIconSmall}>✦</Text>
      </View>
      {/* Sparkles */}
      <SparkleDot delay={0} x={60} y={10} />
      <SparkleDot delay={200} x={110} y={50} />
      <SparkleDot delay={400} x={90} y={110} />
      <SparkleDot delay={600} x={20} y={90} />
      <SparkleDot delay={800} x={10} y={40} />
      <SparkleDot delay={1000} x={50} y={-10} />
    </View>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ progress }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width }]} />
    </View>
  );
}

// ─── Stage Row ────────────────────────────────────────────────────────────────

function StageRow({ label, state }) {
  const fadeIn = useRef(
    new Animated.Value(state === "pending" ? 0.35 : 0),
  ).current;

  useEffect(() => {
    if (state === "active" || state === "done") {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [state]);

  const dotColor =
    state === "done" ? "#3B5BDB" : state === "active" ? "#7C3AED" : "#D1D5DB";

  return (
    <Animated.View style={[styles.stageRow, { opacity: fadeIn }]}>
      <View style={[styles.stageDot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.stageLabel,
          state === "active" && styles.stageLabelActive,
          state === "done" && styles.stageLabelDone,
        ]}
      >
        {label}
      </Text>
      {state === "done" && <Text style={styles.stageDone}>✓</Text>}
      {state === "active" && <Text style={styles.stageLoading}>...</Text>}
    </Animated.View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Generate({ navigation, route }) {
  const params = route?.params ?? {};
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const headingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headingAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start();
  }, []);

  // Drive progress through stages
  useEffect(() => {
    let current = stageIdx;
    let currentProgress = progress;

    const tick = () => {
      if (current >= STAGES.length) {
        setProgress(100);
        setTimeout(() => {
          // Navigate to your home/dashboard screen
          navigation.replace("Home", params);
        }, 800);
        return;
      }

      const stage = STAGES[current];
      const target = Math.round(((current + 1) / STAGES.length) * 100);
      const step = (target - currentProgress) / 20;
      let ticks = 0;

      const interval = setInterval(() => {
        ticks++;
        currentProgress = Math.min(currentProgress + step, target);
        setProgress(Math.round(currentProgress));

        if (ticks >= 20) {
          clearInterval(interval);
          current++;
          setStageIdx(current);
          setTimeout(tick, 300);
        }
      }, stage.duration / 20);
    };

    tick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.body}>
        {/* ── Orb ── */}
        <PulsingOrb />

        {/* ── Heading ── */}
        <Animated.View
          style={{
            opacity: headingAnim,
            transform: [
              {
                translateY: headingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
            alignItems: "center",
          }}
        >
          <Text style={styles.heading}>
            AI is generating your{"\n"}personalized roadmap...
          </Text>
          <Text style={styles.sub}>
            Analyzing your career goals and current skill set to architect a
            high-growth learning path. This typically takes 10–15 seconds.
          </Text>
        </Animated.View>

        {/* ── Progress ── */}
        <View style={styles.progressSection}>
          <ProgressBar progress={progress} />
          <View style={styles.progressMeta}>
            <Text style={styles.processingLabel}>PROCESSING DATA NODES</Text>
            <Text style={styles.progressPct}>{progress}%</Text>
          </View>
        </View>

        {/* ── Stage Rows ── */}
        <View style={styles.stages}>
          {STAGES.map((stage, i) => {
            const state =
              i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
            return (
              <StageRow key={stage.key} label={stage.label} state={state} />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    gap: 28,
  },
  // ── Orb ──
  orbContainer: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  orbRing: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1.5,
  },
  orbRingOuter: {
    width: 130,
    height: 130,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
  },
  orbRingInner: {
    width: 96,
    height: 96,
    borderColor: "#A5B4FC",
    backgroundColor: "#EEF2FF",
  },
  orbCore: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B5BDB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    position: "relative",
  },
  orbIcon: {
    fontSize: 28,
    color: "#3B5BDB",
    lineHeight: 34,
  },
  orbIconSmall: {
    fontSize: 14,
    color: "#818CF8",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  sparkleDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B5BDB",
  },
  // ── Text ──
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    letterSpacing: -0.4,
    lineHeight: 30,
    marginBottom: 10,
  },
  sub: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  // ── Progress ──
  progressSection: {
    width: "100%",
    gap: 6,
  },
  progressTrack: {
    height: 5,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#3B5BDB",
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  processingLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: "#9CA3AF",
  },
  progressPct: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3B5BDB",
  },
  // ── Stages ──
  stages: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageLabel: {
    flex: 1,
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  stageLabelActive: {
    color: "#7C3AED",
    fontWeight: "700",
  },
  stageLabelDone: {
    color: "#374151",
    fontWeight: "600",
  },
  stageDone: {
    fontSize: 12,
    color: "#3B5BDB",
    fontWeight: "700",
  },
  stageLoading: {
    fontSize: 13,
    color: "#7C3AED",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
