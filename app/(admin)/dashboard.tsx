import { Ionicons } from '@expo/vector-icons';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { supabase } from '../../src/config/supabase';
import { BookingService } from '../../src/services/booking.services';
import { AppointmentResponse } from '../../src/types/appointment.types';

/**
 * Admin Dashboard Screen.
 * Displays ALL appointments in the system for the authenticated professional.
 * Allows status transitions: PENDING -> CONFIRMED or CANCELLED.
 */
export default function AdminDashboard() {

  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Handles confirming or cancelling an appointment
  const handleStatusChange = async (appointmentId: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await BookingService.updateAppointmentStatus(appointmentId, newStatus);
      // Refresh the list after the update
      fetchAll();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la cita.');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'CONFIRMED') return '#4CAF50';
    if (status === 'CANCELLED') return '#F44336';
    return '#FFC107'; // PENDING: yellow
  };

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
        <Text style={styles.title}>Panel del Barbero</Text>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <Ionicons name="log-out-outline" size={28} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={appointments}
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
});
