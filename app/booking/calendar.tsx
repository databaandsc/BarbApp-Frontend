import { supabase } from '@/src/config/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Colors } from '../../constants/theme';
import { BookingService } from '../../src/services/booking.services';
import { ShopService } from '../../src/services/shop.service';


export default function BookingCalendarScreen() {
  const { barberId, barberName, serviceId, serviceName, serviceDuration, servicePrice } = useLocalSearchParams<{
    barberId: string;
    barberName: string;
    serviceId: string;
    serviceName: string;
    serviceDuration: string;
    servicePrice: string;
  }>();

  // Selected date and time state management
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Dynamic slots state management
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  /**
   * Invoked when the user selects a specific day on the calendar.
   * Clears previous state and fetches dynamic availability from the Spring Boot API.
   * 
   * @param day - The raw day object provided by react-native-calendars.
   */
  const handleDayPress = async (day: DateData) => {
    setSelectedDate(day.dateString);
    setSelectedTime(''); 
    setAvailableSlots([]); 

    setLoadingSlots(true);

    try {
      // Fetch computed availability from the backend engine
      const slots = await ShopService.getAvailableSlots(barberId, day.dateString);
      setAvailableSlots(slots);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las horas disponibles para la fecha seleccionada.');
    } finally {
      setLoadingSlots(false);
    }
  };

/**
   * Validates user authentication and initiates the booking creation flow.
   * Parses local dates into UTC ISO-8601 strictly required by the backend.
   */
const handleConfirmReservation = async () => {
    if (!selectedDate || !selectedTime) return;
    
    // 1. Enforce authentication barrier
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      Alert.alert(
        "Autenticación Requerida",
        "Por favor, inicia sesión o regístrate para solicitar la cita."
      );
      router.push('/(tabs)/profile' as any); 
      return; 
    }
    
    // 2. Parse selected dates into Backend-compatible ISO-8601 format
    const startAt = `${selectedDate}T${selectedTime}:00Z`;
    const startDateObj = new Date(startAt);
    startDateObj.setMinutes(startDateObj.getMinutes() + parseInt(serviceDuration, 10));
    const endAt = startDateObj.toISOString();

    // 3. Dispatch data payload to the API
    try {
      await BookingService.createAppointment({
        barberId: barberId,
        startAt: startAt,
        endAt: endAt,
        serviceIds: [serviceId],
        clientNotes: "Reserva gestionada automáticamente desde BarbApp",
      });
      Alert.alert(
        "Reserva Solicitada con Éxito",
        `Tu cita de ${serviceName} con ${barberName} a las ${selectedTime} ha sido enviada al profesional y consta como PENDIENTE de confirmación.`
      );
      router.push('/(tabs)/catalog' as any);
    } catch {
      Alert.alert("Servidor no disponible", "No se ha podido procesar la reserva con el servidor. Por favor, inténtelo en unos minutos.");
    }
  };
    

  return (
    <View style={styles.container}>
      {/* Top Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Selecciona Fecha</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Booking Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de Reserva</Text>
          <Text style={styles.summaryText}>{serviceName} (con {barberName})</Text>
          <Text style={styles.summaryText}>{serviceDuration} min • {servicePrice} €</Text>
        </View>

        {/* The Interactive Calendar Component */}
        <Text style={styles.sectionTitle}>1. Escoge un Día</Text>
        <Calendar
          // Standard YYYY-MM-DD format handling
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: Colors.primary }
          }}
          theme={{
            backgroundColor: Colors.background,
            calendarBackground: Colors.surface,
            textSectionTitleColor: Colors.textMuted,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: Colors.background,
            todayTextColor: Colors.primary,
            dayTextColor: Colors.text,
            textDisabledColor: '#444444',
            arrowColor: Colors.primary,
            monthTextColor: Colors.text,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600'
          }}
          style={styles.calendarContainer}
        />

        {/* Dynamic Time Slot Selection Grid */}
        {selectedDate ? (
          <View style={styles.slotsSection}>
            <Text style={styles.sectionTitle}>2. Escoge una Hora</Text>
            
            {loadingSlots ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : availableSlots.length === 0 ? (
              <Text style={styles.emptySlotsText}>El profesional no tiene horas libres este día.</Text>
            ) : (
              <View style={styles.slotsGrid}>
                {availableSlots.map((time) => {
                  const isSelected = time === selectedTime;
                  return (
                    <TouchableOpacity
                      key={time}
                      onPress={() => setSelectedTime(time)}
                      style={[styles.slotChip, isSelected && styles.slotChipSelected]}
                    >
                      <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Bottom Confirmation Button */}
      {selectedDate && selectedTime ? (
        <View style={styles.bottomFooter}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmReservation}>
            <Text style={styles.confirmButtonText}>Confirmar Cita</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  backButton: { marginRight: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  scrollContent: { paddingBottom: 100 },
  
  summaryCard: { backgroundColor: Colors.surface, padding: 16, margin: 20, borderRadius: 12 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 6 },
  summaryText: { fontSize: 14, color: Colors.text, marginBottom: 2 },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginLeft: 20, marginTop: 10, marginBottom: 15 },
  calendarContainer: { marginHorizontal: 20, borderRadius: 12, overflow: 'hidden' },
  
  slotsSection: { marginTop: 25, paddingHorizontal: 20 },
  slotsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 10 
  },
  slotChip: { 
    width: '23%', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: Colors.surface, 
    borderRadius: 8, 
    paddingVertical: 10, 
    backgroundColor: Colors.background 
  },
  slotChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotText: { color: Colors.text, fontSize: 16, fontWeight: '500' },
  slotTextSelected: { color: Colors.background, fontWeight: 'bold' },
  
  emptySlotsText: { color: Colors.textMuted, marginLeft: 20, fontStyle: 'italic' },
  
  bottomFooter: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: Colors.surface, padding: 20, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: Colors.background
  },
  confirmButton: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  confirmButtonText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' }
});
