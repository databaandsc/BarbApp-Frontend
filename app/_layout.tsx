import { AuthProvider } from '@/src/providers/AuthProvider';
import { Stack } from 'expo-router';

/**
 * Root Application Layout
 * 
 * This is the top-level layout that wraps every screen in the application.
 * It uses a Stack navigator from 'expo-router' but disables headers for a more
 * custom UI feel. Any global providers (State Management, Toast, etc.) should 
 * be injected at this level.
 */

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ title: 'App' }} />
        <Stack.Screen name="(admin)" options={{ title: 'Admin' }} /> 
        <Stack.Screen name="(auth)" options={{ title: 'Authentication' }} />
        <Stack.Screen name="index" options={{ title: 'Entry' }} />
      </Stack>
    </AuthProvider>
  );
}