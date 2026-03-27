import { useAuth } from '@/src/providers/AuthProvider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { Colors } from '../../constants/theme';
import { supabase } from '../../src/config/supabase';

// IMPORTA nuestro nuevo api de src/api/api.ts primero arriba del todo del archivo

/**
 * Login Screen
 * 
 * Functional component responsible for user authentication.
 * Implements a controlled form for email and password input.
 * Features:
 * - Direct integration with Supabase Auth API.
 * - Error handling for network and authentication failures.
 * - UX optimization through KeyboardAvoidingView to prevent layout occlusion.
 */

export default function LoginScreen() {
  
  const router = useRouter();

  // When the screen detects that a session has magically started
  // it will redirect the user directly to the catalog.

  const { session, isProfessional, loading: authLoading } = useAuth();

  React.useEffect(() => {
    // Wait until the AuthProvider has finished reading the role
    // before making any redirect decision
    if (!loading && session) {
      router.replace(isProfessional ? '/(admin)/dashboard' : '/(tabs)/catalog');
    }
  }, [session, isProfessional, authLoading]);
  

  
  // Local state management for form inputs and UI feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Primary Action: Sign In
   * Triggers the auth request to Supabase and manages loading/error states.
   */
  const handleLogin = async () => {
    // Basic defensive check before API call
    if (!email || !password) {
      setErrorMessage('Por favor, introduce tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setErrorMessage(error.message);
      } else {
        // Successful authentication flows should be handled by an Auth Provider listener
        console.log('Login successful!');
      }
    } catch (err) {
      setErrorMessage('Error de red inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        bounces={false}
        keyboardShouldPersistTaps="handled" 
      >
        {/* Branding Section */}
        <Text style={styles.title}>BarbApp</Text>
        <Text style={styles.subtitle}>Reserva en tu barbería favorita</Text>

        {/* Input Fields: Leverages atomic UI components */}
        <AppInput 
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput 
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Dynamic UI Feedback */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <AppButton text="Entrar" onPress={handleLogin} loading={loading} />

        {/* Navigation: Navigates within the (auth) stack */}
        <TouchableOpacity 
          style={styles.link} 
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.6}
        >
          <Text style={styles.linkText}>
            ¿No tienes cuenta? <Text style={styles.linkHighlight}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 25 
  },
  title: { 
    fontSize: 48, 
    fontWeight: '800', 
    textAlign: 'center', 
    color: Colors.primary, 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: Colors.textMuted, 
    marginBottom: 40 
  },
  link: { 
    marginTop: 25, 
    alignItems: 'center' 
  },
  linkText: { 
    color: Colors.textMuted, 
    fontSize: 16 
  },
  linkHighlight: { 
    color: Colors.primary, 
    fontWeight: '700' 
  },
  errorText: { 
    color: Colors.error, 
    marginBottom: 15, 
    textAlign: 'center',
    fontSize: 14 
  }
});
