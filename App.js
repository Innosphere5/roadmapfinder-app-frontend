import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SignUp from './auth/Sign-up';
import SignIn from './auth/Sign-in';
import SplashScreen from './main/SplashScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false,
        }}
      >
        {/* ── Splash ───────────────────────────────────────────── */}
        <Stack.Screen name="Splash">
          {({ navigation }) => (
            <SplashScreen
              onGetStarted={() => navigation.replace('SignUp')}
            />
          )}
        </Stack.Screen>

     

        {/* ── Auth ─────────────────────────────────────────────── */}
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ animation: 'slide_from_right' }}
        />

      
      </Stack.Navigator>
    </NavigationContainer>
  );
}