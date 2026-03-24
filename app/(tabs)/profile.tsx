import { supabase } from '@/src/config/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../constants/theme';

/**
 * Customer Profile Screen.
 * Displays the current session's email address and provides logout functionality.
 */
export default function ProfileScreen() {
  const { session } = useAuth();
  const router = useRouter();
  
  // Extract the logged-in user's email to display it on screen
  const userEmail = session?.user?.email || 'User';

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error', 'Unable to log out.');
        return; // Si da error, cortamos aquí
      }
      
      // ¡La magia! Forzamos la redirección a la pantalla de entrada
      router.replace('/(auth)/login');
      
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="person-circle" size={80} color={Colors.primary} />
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>

        <View style={styles.footer}>
          <AppButton text="Cerrar Sesión" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}

// Screen branding and layout styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 30,
    borderRadius: 15,
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 15,
  },
  footer: {
    marginTop: 'auto',
  },
});
