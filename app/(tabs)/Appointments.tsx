import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusBadge from '../../components/StatusBadge';
import { Colors } from '../../constants/theme';
import { BookingService } from '../../src/services/booking.services';
import { AppointmentResponse } from '../../src/types/appointment.types';


// My Appointments Screen.
// Pantalla de Mis Citas.
// Fetches and displays the list of user reservations from the Spring Boot backend.
// Obtiene y muestra la lista de reservas del usuario desde el backend de Spring Boot.
export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data from the server.
  // Obtener datos del servidor.
  const fetchAppointments = async () => {
    try {
      const data = await BookingService.getMyAppointments();
      setAppointments(data);
    } catch (error) {
      // Error silenciado
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

  const handleCancelAppointment = (appointmentId: string) => {
    // Show confirmation dialog before cancelling.
    // Mostrar un diálogo de confirmación antes de cancelar.
    Alert.alert(
      "Cancelar Cita", 
      "¿Estás seguro de que deseas cancelar esta cita?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive",
          onPress: async () => {
            try {
              // Call the backend service to update status to CANCELLED.
              // Llamar al servicio backend para actualizar el estado a CANCELLED.
              await BookingService.updateAppointmentStatus(appointmentId, 'CANCELLED');
              
              // Refresh the list to reflect the changes.
              // Refrescar la lista para reflejar los cambios.
              fetchAppointments();
            } catch {
              Alert.alert("Error", "No se pudo cancelar la cita. Inténtalo de nuevo.");
            }
          }
        }
      ]
    );
  };

  // Component to show when the list is empty.
  // Componente a mostrar cuando la lista está vacía.
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
              <Text style={styles.serviceName}>Cita con {item.barberName}</Text>
              <Text style={styles.dateText}>
                {item.startAt.substring(0, 16).replace('T', ' a las ')}
              </Text>

            </View>
            
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <StatusBadge status={item.status} />


              {/* Show cancel button only if status is PENDING or CONFIRMED. */}
              {/* Mostrar botón de cancelar solo si el estado es PENDING. */}
              {item.status === 'PENDING' && (
                <TouchableOpacity 
                  onPress={() => handleCancelAppointment(item.id)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              )}

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
  
  // Basic Appointment Card Styles.
  // Estilos básicos de la tarjeta de cita.
  appointmentCard: { 
    backgroundColor: Colors.surface, 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center' 
  },

  cancelButton: { 
    backgroundColor: Colors.error, 
    paddingVertical: 6,  
    paddingHorizontal: 12, 
    borderRadius: 6,
    marginTop: 5
  },
  cancelButtonText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  serviceName: { color: Colors.text, fontSize: 16, fontWeight: 'bold' },
  dateText: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { color: Colors.background, fontSize: 12, fontWeight: 'bold' }
});
