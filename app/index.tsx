import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../src/providers/AuthProvider';

export default function Index() {
  const { session, isProfessional, loading } = useAuth();

  // 1. Si está cargando el rol, esperamos para no dar saltos bruscos
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 2. Si es barbero o admin, lo mandamos a su panel
  if (session && isProfessional) {
    return <Redirect href="/(admin)/dashboard" />;
  }

  // 3. Si es cliente o invitado, lo mandamos al catálogo público
  return <Redirect href="/(tabs)/catalog" />;
}
