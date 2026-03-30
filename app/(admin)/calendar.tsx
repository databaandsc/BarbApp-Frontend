import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';

/**
 * Admin Daily Calendar Screen.
 * Pantalla de agenda diaria del administrador.
 * Will render the barber's scheduled appointments in a timeline view.
 * Visualizará las citas programadas del barbero en un formato de línea de tiempo.
 */
export default function AdminCalendar() {
  return (
    <View style={styles.container}>
      {/* Temporary placeholder / Marcador de posición temporal */}
      <Text style={styles.text}>Aquí pondremos tu calendario de citas</Text>
    </View>
  );
}

// Layout styles.
// Estilos de visualización.
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  text: { 
    color: Colors.text, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
