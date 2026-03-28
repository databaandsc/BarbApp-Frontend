import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: Colors.background },
      headerTintColor: Colors.primary,
      headerTitleStyle: { fontWeight: 'bold' },
      headerShown: true 
    }}>
      <Stack.Screen name="dashboard" options={{ title: 'Panel de Gestión' }} />
    </Stack>
  );
}
