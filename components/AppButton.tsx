import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Reusable Action Button Component
 * 
 * Implements the 'Premium Dark' style through a high-contrast sand accent background.
 * Follows the 'Single Responsibility Principle' by encapsulating state-aware
 * UI logic such as the loading indicator.
 * 
 * @param {string} text - Label to be displayed on the button.
 * @param {Function} onPress - Callback function executed on press.
 * @param {boolean} loading - Sets the button to a disabled loading state.
 */

interface AppButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
}

export const AppButton = ({ text, onPress, loading }: AppButtonProps) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress} 
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={Colors.background} />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    // Subtle elevation for better visual depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
