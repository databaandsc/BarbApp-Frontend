import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { BookingService } from '../../src/services/booking.services';
import { AppointmentResponse } from '../../src/types/appointment.types';

/**
 * My Appointments Screen.
 * Fetches and displays the list of user reservations from the Spring Boot backend.
 */
export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data from the server
  const fetchAppointments = async () => {
    try {
      const data = await BookingService.getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  // Component to show when the list is empty
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color={Colors.surface} />
      <Text style={styles.emptyStateTitle}>Aún no hay citas</Text>
      <Text style={styles.emptyStateText}>
        Tus próximas reservas aparecerán aquí una vez que sean gestionadas.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <View>
              <Text style={styles.serviceName}>Reserva #{item.id.slice(0, 8)}</Text>
              <Text style={styles.dateText}>{new Date(item.startAt).toLocaleString()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'PENDING' ? '#FFC107' : Colors.primary }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  header: { paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginTop: 20, marginBottom: 10 },
  emptyStateText: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', lineHeight: 24 },
  
  // Basic Appointment Card Styles
  appointmentCard: { 
    backgroundColor: Colors.surface, 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center' 
  },
  serviceName: { color: Colors.text, fontSize: 16, fontWeight: 'bold' },
  dateText: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { color: Colors.background, fontSize: 12, fontWeight: 'bold' }
});
