import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';

/**
 * Basic layout for the "My Appointments" student screen.
 * Currently just a visual placeholder to avoid blank screens.
 * In the future, this will fetch from Spring Boot.
 */
export default function AppointmentsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
      </View>

      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={64} color={Colors.surface} />
        <Text style={styles.emptyStateTitle}>Aún no hay citas</Text>
        <Text style={styles.emptyStateText}>
          Tus próximas reservas aparecerán aquí una vez que sean gestionadas.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
