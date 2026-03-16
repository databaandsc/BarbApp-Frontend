import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Reusable Input Component
 * 
 * Designed for cross-platform form consistency. Centralizes styling for
 * background surface, typography, and interactive states to reduce code duplication (DRY).
 * 
 * @param {string} placeholder - Help text displayed in the field.
 * @param {string} value - Controlled component state value.
 * @param {Function} onChangeText - State update function.
 * @param {boolean} secureTextEntry - Obfuscates text for passwords.
 * @param {string} keyboardType - Optimizes the virtual keyboard for input type.
 * @param {string} autoCapitalize - Controls automatic character capitalization.
 */

interface AppInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const AppInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType = 'default',
  autoCapitalize = 'none' 
}: AppInputProps) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      selectionColor={Colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    // Ensures contrast against the primary background color
    borderWidth: 1,
    borderColor: 'transparent', // Reserved for focus state implementation
  },
});
