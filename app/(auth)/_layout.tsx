import { Stack } from 'expo-router';

/**
 * Authentication Group Layout
 * 
 * Manages the navigation stack for Login and Registration screens.
 * Organized as a 'Route Group' (represented by parentheses in the folder name)
 * to decouple authentication flows from the main application dashboard logic.
 */

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Defined screens within the auth flow */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
