import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  background: "#F0F4FA",
  white: "#FFFFFF",
  primary: "#1A56DB",
  heading: "#111827",
  subtext: "#6B7280",
  stepTitle: "#1F2937",
  stepSubtitle: "#9CA3AF",

  // Step 1 — Blue
  step1Accent: "#3B82F6",
  step1BadgeBg: "#3B82F6",
  step1BadgeText: "#FFFFFF",

  // Step 2 — Grey
  step2Accent: "#D1D5DB",
  step2BadgeBg: "#E5E7EB",
  step2BadgeText: "#9CA3AF",

  // Step 3 — Orange
  step3Accent: "#FB923C",
  step3BadgeBg: "#FFEDD5",
  step3BadgeText: "#FB923C",
};

// ─── Steps Data ───────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: "Choose Your Tech",
    subtitle: "Pick from 50+ career paths",
    accentColor: COLORS.step1Accent,
    badgeBg: COLORS.step1BadgeBg,
    badgeTextColor: COLORS.step1BadgeText,
  },
  {
    id: 2,
    title: "AI Curated Journey",
    subtitle: "Optimized for job readiness",
    accentColor: COLORS.step2Accent,
    badgeBg: COLORS.step2BadgeBg,
    badgeTextColor: COLORS.step2BadgeText,
  },
  {
    id: 3,
    title: "Land The Job",
    subtitle: "Portfolio-ready projects included",
    accentColor: COLORS.step3Accent,
    badgeBg: COLORS.step3BadgeBg,
    badgeTextColor: COLORS.step3BadgeText,
  },
];

// ─── Logo Icon ────────────────────────────────────────────────────────────────
const LogoIcon = () => (
  <View style={styles.logoIconBox}>
    <View style={styles.logoBarFull} />
    <View style={styles.logoBarShort} />
  </View>
);

// ─── Step Card ────────────────────────────────────────────────────────────────
/**
 * EXACT layout from the design:
 *
 *  ╔══════════════════════════════════════════╗
 *  ║ ▌  [● 1]   Choose Your Tech             ║
 *  ║ ▌          Pick from 50+ career paths   ║
 *  ╚══════════════════════════════════════════╝
 *
 *  • White card, rounded corners, drop shadow
 *  • Left accent = a 4px-wide rounded View INSIDE the card (not border)
 *  • Number badge = circle View with colored bg
 *  • Text block stacked title + subtitle
 */
const StepCard = ({ step }) => (
  <View style={styles.stepCard}>
    {/* ── Left accent pill ─────────────────────────────────────── */}
    <View style={[styles.accentBar, { backgroundColor: step.accentColor }]} />

    {/* ── Number badge ─────────────────────────────────────────── */}
    <View style={[styles.badge, { backgroundColor: step.badgeBg }]}>
      <Text style={[styles.badgeText, { color: step.badgeTextColor }]}>
        {step.id}
      </Text>
    </View>

    {/* ── Title & Subtitle ─────────────────────────────────────── */}
    <View style={styles.stepTextBlock}>
      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
    </View>
  </View>
);

// ─── SplashScreen ─────────────────────────────────────────────────────────────
const SplashScreen = ({ onGetStarted }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.screen}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <LogoIcon />
          <Text style={styles.logoLabel}>RoadmapFinder</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>
          {"From Beginner to\nJob-Ready \u2014 Step\nby Step"}
        </Text>

        {/* Sub-heading */}
        <Text style={styles.subheading}>
          {"AI-powered guided learning for\ndevelopers"}
        </Text>

        {/* Step Cards */}
        <View style={styles.stepsList}>
          {STEPS.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>Find My Roadmap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Screen ──────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Logo ────────────────────────────────────────────────────────
  logoSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  logoBarFull: {
    width: 24,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
  logoBarShort: {
    width: 14,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    alignSelf: "flex-start",
    marginLeft: 2,
  },
  logoLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
    letterSpacing: 0.2,
  },

  // ── Heading ─────────────────────────────────────────────────────
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.heading,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  // ── Sub-heading ─────────────────────────────────────────────────
  subheading: {
    fontSize: 15,
    fontWeight: "400",
    color: COLORS.subtext,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 32,
  },

  // ── Steps List ──────────────────────────────────────────────────
  stepsList: {
    width: "100%",
    gap: 14,
    marginBottom: 36,
  },

  // ── Step Card ───────────────────────────────────────────────────
  /**
   * FIX APPLIED:
   *   • flexDirection: 'row' — accent bar, badge, text sit side-by-side
   *   • alignItems: 'center' — vertically centres all children
   *   • overflow: 'hidden' — ensures accent bar stays clipped inside card bounds
   *   • White background + shadow — matches the card in the design
   *   • paddingLeft: 0 — accent bar starts flush at the card's left edge
   */
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 18,
    paddingRight: 18,
    paddingLeft: 0, // accent bar sits flush with card left edge
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },

  // ── Accent Bar (left coloured pill) ─────────────────────────────
  /**
   * FIX APPLIED:
   *   • width: 4 — narrow pill matching the design
   *   • alignSelf: 'stretch' — grows to full card height automatically
   *   • borderRadius: 2 — slightly rounded ends
   *   • marginRight: 16 — gap between bar and badge
   *   • No marginLeft — sits flush at the card edge (paddingLeft: 0 on card)
   */
  accentBar: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 2,
    marginRight: 16,
  },

  // ── Badge (numbered circle) ──────────────────────────────────────
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Step Text ───────────────────────────────────────────────────
  stepTextBlock: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.stepTitle,
    marginBottom: 3,
  },
  stepSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.stepSubtitle,
    lineHeight: 17,
  },

  // ── CTA Button ──────────────────────────────────────────────────
  ctaButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});

export default SplashScreen;
