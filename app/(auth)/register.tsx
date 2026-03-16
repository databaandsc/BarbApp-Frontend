import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../src/config/supabase';
// Import the router to handle navigation between screens
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    // 1. Basic input validation
    if (!email || !password || !firstName || !lastName) {
      setErrorMessage('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 2. Register user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          }
        }
      });

      // 3. Handle registration response
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Registro realizado con éxito. Revisa tu correo electrónico.');
        console.log('User registered successfully:', data.user?.id);
        // Future step: Redirect user to Login or Main App
      }

    } catch (err) {
      setErrorMessage('Un error de red inesperado ha ocurrido.');
    } finally {
      // Ensure the loading state is reset regardless of the outcome
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Header */}
      <Text style={styles.title}>Únete a BarbApp</Text>
      <Text style={styles.subtitle}>Crea tu nueva cuenta</Text>

      {/* Mandatory Fields */}
      <TextInput
        style={styles.input}
        placeholder="Nombre *"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellidos *"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico *"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Optional Field */}
      <TextInput
        style={styles.input}
        placeholder="Teléfono (Opcional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Messages */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      {/* Navigation link back to Login */}
      <TouchableOpacity 
        style={{ marginTop: 20, alignItems: 'center' }} 
        onPress={() => router.back()}
      >
        <Text style={{ color: '#666', fontSize: 16 }}>
          ¿Ya tienes cuenta? <Text style={{ color: '#000', fontWeight: 'bold' }}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ==========================================
// --- STYLES (React Native CSS) ---
// ==========================================
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 30,
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
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  }
});
