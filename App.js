import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import SplashScreen from "./main/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Called when user taps "Find My Roadmap"
  const handleGetStarted = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onGetStarted={handleGetStarted} />;
  }

  // ── Placeholder: replace with your real navigator / home screen ──
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>🚀 Welcome to RoadmapFinder!</Text>
      <Text style={styles.placeholderSub}>
        Replace this view with your main app navigator.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6FB",
    paddingHorizontal: 32,
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },
  placeholderSub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
