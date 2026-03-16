import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../src/config/supabase';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { Colors } from '../../constants/theme';

/**
 * Registration Screen
 * 
 * Manages the creation of new user accounts.
 * Integrates directly with Supabase Auth `signUp` method.
 * 
 * Tech Specs:
 * - Multi-field validation (Client-side).
 * - Metadata synchronization: Custom user data (first name, phone) is passed to Supabase
 *   metadata, which then triggers a SQL function for DB persistence.
 * - UX focused: Automatic scroll to accommodate many inputs on smaller devices.
 */

export default function RegisterScreen() {
  const router = useRouter();

  // Form Field State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI Logic State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Primary Action: Sign Up
   * Performs validation and executes the registration request.
   */
  const handleRegister = async () => {
    // Comprehensive field validation required by backend business logic
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
      setErrorMessage('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Supabase Auth SignUp including custom user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            first_name: firstName, 
            last_name: lastName, 
            phone 
          } 
        }
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Registro realizado con éxito. Revisa tu correo.');
      }

    } catch (err) {
      setErrorMessage('Ha ocurrido un error inesperado de red.');
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
        style={styles.scroll} 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <Text style={styles.title}>Únete</Text>
        <Text style={styles.subtitle}>Crea tu cuenta premium en BarbApp</Text>

        {/* Input Fields */}
        <AppInput placeholder="Nombre *" value={firstName} onChangeText={setFirstName} />
        <AppInput placeholder="Apellidos *" value={lastName} onChangeText={setLastName} />
        <AppInput 
          placeholder="Correo electrónico *" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none"
        />
        <AppInput 
          placeholder="Contraseña *" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        <AppInput 
          placeholder="Repetir contraseña *" 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
          secureTextEntry 
        />
        <AppInput 
          placeholder="Teléfono *" 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad" 
        />

        {/* Dynamic Messaging */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <AppButton text="Registrarse" onPress={handleRegister} loading={loading} />

        {/* Secondary Action: Navigation back to Login (Replacement prevents stack bloating) */}
        <TouchableOpacity 
          style={styles.link} 
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.6}
        >
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta? <Text style={styles.linkHighlight}>Inicia sesión</Text>
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
  scroll: { 
    flex: 1 
  },
  container: { 
    padding: 25, 
    paddingTop: 60, 
    backgroundColor: Colors.background 
  },
  title: { 
    fontSize: 42, 
    fontWeight: '800', 
    color: Colors.primary, 
    marginBottom: 5, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 16, 
    color: Colors.textMuted, 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  link: { 
    marginTop: 25, 
    marginBottom: 40, 
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
  },
  successText: { 
    color: Colors.success, 
    marginBottom: 15, 
    textAlign: 'center',
    fontSize: 14 
  }
});
