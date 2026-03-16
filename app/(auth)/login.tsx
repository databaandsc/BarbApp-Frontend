import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabase';
// Import the router to handle navigation between screens
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // 1. Basic input validation
    if (!email || !password) {
      setErrorMessage('Por favor, introduce tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 2. Authenticate user via Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // 3. Handle authentication response
      if (error) {
        setErrorMessage(error.message);
      } else {
        console.log('Successfully authenticated via Supabase!');
        // Future step: Redirect user to the main application dashboard
      }

    } catch (err) {
      setErrorMessage('Ha ocurrido un error de red inesperado.');
    } finally {
      // Ensure the loading state is reset regardless of the outcome
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Header */}
      <Text style={styles.title}>BarbApp</Text>
      <Text style={styles.subtitle}>Reserva en tu barbería favorita</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Error Message Display */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      {/* Navigation link to Register */}
      <TouchableOpacity 
        style={{ marginTop: 20, alignItems: 'center' }} 
        onPress={() => router.push('/(auth)/register')}
      >
        <Text style={{ color: '#666', fontSize: 16 }}>
          ¿No tienes una cuenta? <Text style={{ color: '#000', fontWeight: 'bold' }}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================
// --- STYLES (React Native CSS) ---
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
});
