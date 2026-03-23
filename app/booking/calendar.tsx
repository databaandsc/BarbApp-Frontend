import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Colors } from '../../constants/theme';

export default function BookingCalendarScreen() {
  const { barberName, serviceName, serviceDuration, servicePrice } = useLocalSearchParams<{
    barberId: string;
    barberName: string;
    serviceId: string;
    serviceName: string;
    serviceDuration: string;
    servicePrice: string;
  }>();

  // Estados para manejar el día y la hora que elige el usuario
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Simulación temporal de horas libres (Mocking)
  const availableSlots = ['09:00', '10:30', '11:00', '16:00', '17:30', '18:00'];

  /**
   * Action when the user confirms the booking.
   */
  const handleConfirmReservation = () => {
    if (!selectedDate || !selectedTime) return;
    
    // Aquí comprobaremos luego si está logueado o lanzaremos la API real
    Alert.alert(
      "Booking Confirmed",
      `Your appointment for ${serviceName} with ${barberName} on ${selectedDate} at ${selectedTime} has been registered!`
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Date</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Booking Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryText}>{serviceName} (with {barberName})</Text>
          <Text style={styles.summaryText}>{serviceDuration} min • {servicePrice} €</Text>
        </View>

        {/* The Interactive Calendar Component */}
        <Text style={styles.sectionTitle}>1. Choose a Day</Text>
        <Calendar
          // Formato estándar YYYY-MM-DD
          onDayPress={(day: DateData) => {
            setSelectedDate(day.dateString);
            setSelectedTime(''); // Reseteamos la hora si cambia de día
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: Colors.primary }
          }}
          // Theme Premium Dark
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

        {/* Time Slot Selection Grid (Only visible if a day is selected) */}
        {selectedDate ? (
          <View style={styles.slotsSection}>
            <Text style={styles.sectionTitle}>2. Choose a Time</Text>
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
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Bottom Confirmation Button */}
      {selectedDate && selectedTime ? (
        <View style={styles.bottomFooter}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmReservation}>
            <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
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
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotChip: { 
    borderWidth: 1, borderColor: Colors.surface, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: Colors.background 
  },
  slotChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotText: { color: Colors.text, fontSize: 16, fontWeight: '500' },
  slotTextSelected: { color: Colors.background, fontWeight: 'bold' },
  
  bottomFooter: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: Colors.surface, padding: 20, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: Colors.background
  },
  confirmButton: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  confirmButtonText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' }
});
