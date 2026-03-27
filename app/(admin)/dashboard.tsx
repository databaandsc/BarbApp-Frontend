import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/providers/AuthProvider';

export default function AdminDashboard() {
  const { session } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Control: Barbero</Text>
      <Text style={styles.subtitle}>Bienvenido, {session?.user?.email}</Text>
      <AppButton text="Cerrar Sesión" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 30 }
});
