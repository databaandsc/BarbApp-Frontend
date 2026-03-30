import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { supabase } from '../../src/config/supabase';
import { BookingService } from '../../src/services/booking.services';
import { AppointmentResponse } from '../../src/types/appointment.types';

// Define the available filter states.
// Definir los estados de filtro disponibles.
type FilterType = 'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// Define the available time filter states.
// Definir los estados de filtro de tiempo disponibles.
type TimeFilterType = 'UPCOMING' | 'HISTORY';

/**
 * Admin Dashboard Screen.
 * Pantalla del panel de administración.
 * Displays ALL appointments in the system for the authenticated professional.
 * Muestra TODAS las citas en el sistema para el profesional autenticado.
 */
export default function AdminDashboard() {

  // React State for managing data and UI loading.
  // Estado de React para manejar los datos y la carga visual.
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for the active status filter.
  // Estado para el filtro de estado activo.
  const [filter, setFilter] = useState<FilterType>('ALL');

  // State for the time line filter (Default: UPCOMING).
  // Estado para el filtro de línea temporal (Por defecto: UPCOMING).
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('UPCOMING');

  // Fetch all appointments from the backend.
  // Obtener todas las citas desde el backend.
  const fetchAll = async () => {
    try {
      const data = await BookingService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading all appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchAll(); };

  // Handles confirming or cancelling an appointment.
  // Maneja la confirmación o cancelación de una cita.
  const handleStatusChange = async (appointmentId: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await BookingService.updateAppointmentStatus(appointmentId, newStatus);
      // Refresh the list after the update.
      // Refrescar la lista después de la actualización.
      fetchAll();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la cita.');
    }
  };

  // Helper mapping for status badge colors.
  // Mapeo auxiliar para los colores de las etiquetas de estado.
  const getStatusColor = (status: string) => {
    if (status === 'CONFIRMED') return '#4CAF50';
    if (status === 'CANCELLED') return '#F44336';
    return '#FFC107'; // PENDING: yellow
  };

  // Filter the appointments array based on the selected filter states.
  // Filtrar el array de citas en base a los estados de filtro seleccionados.
  const filteredAppointments = appointments.filter((app) => {
    // 1. Status Filter (Confirmed, cancelled, etc.)
    // 1. Filtro de Estado (Confirmadas, canceladas, etc.)
    const matchesStatus = filter === 'ALL' || app.status === filter;
    
    // 2. Time Filter (Upcoming vs History)
    // 2. Filtro de Tiempo (Próximas vs Historial)
    const appDate = new Date(app.startAt);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Start from 00:00 today / Arrancamos desde las 00:00 de hoy
    
    const matchesTime = timeFilter === 'HISTORY' || appDate >= startOfToday;
    
    // Return true only if BOTH filters pass
    // Solo mostramos la tarjeta si pasa AMBOS filtros
    return matchesStatus && matchesTime;
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Header Section */}
      {/* Sección de Cabecera */}
      <View style={styles.header}>
        <Text style={styles.title}>Panel del Barbero</Text>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <Ionicons name="log-out-outline" size={28} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Time Filter Buttons Section */}
      {/* Sección de Botones de Filtro de Tiempo */}
      <View style={styles.filterContainer}>
        {(['UPCOMING', 'HISTORY'] as TimeFilterType[]).map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[styles.filterBtn, timeFilter === tf && styles.filterBtnActive]}
            onPress={() => setTimeFilter(tf)}
          >
            <Text style={[styles.filterBtnText, timeFilter === tf && styles.filterBtnTextActive]}>
              {tf === 'UPCOMING' ? 'Próximas Citas' : 'Historial Completo'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Status Filter Buttons Section */}
      {/* Sección de Botones de Filtro de Estado */}
      <View style={styles.filterContainer}>
        {(['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
              {f === 'ALL' ? 'Todas' : f === 'PENDING' ? 'Pendientes' : f === 'CONFIRMED' ? 'Confirmadas' : 'Canceladas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main List of Appointments */}
      {/* Lista Principal de Citas */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color={Colors.surface} />
            <Text style={styles.emptyText}>No hay citas pendientes</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardClientName}>{item.clientName}</Text>
                <Text style={styles.cardDate}>{new Date(item.startAt).toLocaleString()}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.cardNotes}>{item.clientNotes || 'Sin notas del cliente'}</Text>
            <Text style={styles.cardPrice}>Total: {item.totalPrice}€ · {item.totalDurationMinutes} min</Text>

            {/* Action buttons – only shown for PENDING appointments */}
            {/* Botones de acción – mostrados solo para citas PENDIENTES */}
            {item.status === 'PENDING' && (
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={() => handleStatusChange(item.id, 'CONFIRMED')}>
                  <Text style={styles.btnText}>✓ Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => handleStatusChange(item.id, 'CANCELLED')}>
                  <Text style={styles.btnText}>✗ Rechazar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text },
  card: { backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardDate: { color: Colors.text, fontWeight: '600', fontSize: 15 },
  badge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  cardNotes: { color: Colors.textMuted, fontSize: 14, marginBottom: 6 },
  cardPrice: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnConfirm: { backgroundColor: '#4CAF50' },
  btnCancel: { backgroundColor: '#F44336' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { color: Colors.textMuted, marginTop: 16, fontSize: 16 },
  cardClientName: { color: Colors.text, fontWeight: '700', fontSize: 16, marginBottom: 2 },
  filterContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 15, 
    paddingVertical: 10,
    gap: 8,
    flexWrap: 'wrap'
  },
  filterBtn: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#eaeaea'
  },
  filterBtnActive: { 
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  filterBtnText: { 
    color: Colors.textMuted, 
    fontSize: 13, 
    fontWeight: '600' 
  },
  filterBtnTextActive: { 
    color: '#fff' 
  },
});
