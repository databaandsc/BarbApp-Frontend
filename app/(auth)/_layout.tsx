import { Stack } from 'expo-router';

export default function AuthLayout() {
  // This layout will apply to all screens inside the (auth) folder
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
