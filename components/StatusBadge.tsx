import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    if (status === 'CONFIRMED') return '#4CAF50';
    if (status === 'CANCELLED') return '#F44336';
    return '#FFC107'; // PENDING: Amarillo
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
