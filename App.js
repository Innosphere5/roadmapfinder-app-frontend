import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ── Auth ──────────────────────────────────────────────────────────────────────
import SignUp from "./auth/Sign-up";
import SignIn from "./auth/Sign-in";

// ── Main ──────────────────────────────────────────────────────────────────────
import SplashScreen from "./main/SplashScreen";

// ── Onboarding ────────────────────────────────────────────────────────────────
import Topic from "./onboardings/Topic";
import Level from "./onboardings/Level";
import Commitment from "./onboardings/Commitment";
import Language from "./onboardings/Langauge";
import Generate from "./onboardings/Generate";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {/* ── Splash ──────────────────────────────────────────────────────── */}
        <Stack.Screen name="Splash">
          {({ navigation }) => (
            <SplashScreen onGetStarted={() => navigation.replace("SignUp")} />
          )}
        </Stack.Screen>

        {/* ── Auth ────────────────────────────────────────────────────────── */}
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ animation: "slide_from_right" }}
        />

        {/* ── Onboarding Flow ─────────────────────────────────────────────── */}
        {/*
         *  After auth success, navigate to 'Topic' to start the onboarding.
         *  Each screen passes its params forward so Generate receives everything.
         *
         *  Flow:
         *    Topic → Level → Commitment → Language → Generate → Home
         */}
        <Stack.Screen
          name="Topic"
          component={Topic}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Level"
          component={Level}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Commitment"
          component={Commitment}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Language"
          component={Language}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Generate"
          component={Generate}
          options={{ animation: "fade", gestureEnabled: false }}
        />

        {/*
         *  Add your Home / Dashboard screen here.
         *  Example:
         *
         *  <Stack.Screen
         *    name="Home"
         *    component={HomeScreen}
         *    options={{ animation: 'fade' }}
         *  />
         */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
