import { AuthProvider } from '@/src/providers/AuthProvider';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevenimos que la pantalla de carga (Logo) desaparezca instantáneamente
SplashScreen.preventAutoHideAsync();

/**
 * Root Application Layout
 * 
 * This is the top-level layout that wraps every screen in the application.
 * It uses a Stack navigator from 'expo-router' but disables headers for a more
 * custom UI feel. Any global providers (State Management, Toast, etc.) should 
 * be injected at this level.
 */

export default function RootLayout() {

  useEffect(() => {
    // Forzamos que el logo del principio se quede viéndose durante 2.5 segundos (2500ms)
    // para que la entrada a la app sea más estética y no un pantallazo rápido.
    const holdSplashScreen = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));
      await SplashScreen.hideAsync();
    };

    holdSplashScreen();
  }, []);

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