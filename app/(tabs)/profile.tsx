import { supabase } from '@/src/config/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../constants/theme';

/**
 * Customer Profile Screen / Pantalla del Perfil del Cliente
 * Displays the current session's email address and provides logout functionality.
 * Muestra el correo electrónico de la sesión actual y proporciona la funcionalidad de cerrar sesión.
 */
export default function ProfileScreen() {
  const { session } = useAuth();
  const router = useRouter();
  
  // Extract the logged-in user's email to display it on screen
  // Extrae el correo del usuario logueado para mostrarlo por pantalla
  const userEmail = session?.user?.email || 'User';

  /**
   * Handles the session termination process via Supabase.
   * Maneja el proceso de finalización de sesión a través de Supabase.
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error', 'Unable to log out. / No se pudo cerrar sesión.');
        return; // Break execution if an error triggers / Corta la ejecución si hay error
      }
      
      // Magic! Force redirection back to the login screen
      // ¡La magia! Forzamos la redirección a la pantalla de entrada
      router.replace('/(auth)/login');
      
    } catch (err) {
      // Error silenciado para producción
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header Section / Sección de Cabecera */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      {/* Main Content / Contenido Principal */}
      <View style={styles.content}>
        
        {/* User Card Profile / Tarjeta de Perfil de Usuario */}
        <View style={styles.card}>
          <Ionicons name="person-circle" size={80} color={Colors.primary} />
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>

        {/* Action Button Footer / Pie del botón de acción */}
        <View style={styles.footer}>
          <AppButton text="Cerrar Sesión" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}

// Screen branding and layout styles
// Estilos de diseño y marca de la pantalla
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
