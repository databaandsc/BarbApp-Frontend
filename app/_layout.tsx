import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Declaramos que existe un grupo de pantallas de Auth sin cabecera global */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
