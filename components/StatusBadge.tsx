import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/theme';

interface StatusBadgeProps {
  status: string;
}

/**
 * StatusBadge Component.
 * Componente visual reutilizable para mostrar el estado de una cita.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  
  // Devuelve el color de fondo correspondiente al estado actual
  const getBackgroundColor = () => {
    if (status === 'CONFIRMED') return Colors.success;
    if (status === 'CANCELLED') return Colors.error;
    return Colors.warning;
  };


  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 6,
    alignSelf: 'flex-start' // Ensures it doesn't stretch
  },
  badgeText: { 
    color: '#ffffff', 
    fontSize: 11, 
    fontWeight: 'bold' 
  }
});
