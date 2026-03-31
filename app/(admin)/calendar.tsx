import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { BookingService } from '../../src/services/booking.services';
import { AppointmentResponse } from '../../src/types/appointment.types';

/**
 * Admin Daily Calendar Component.
 * Componente del calendario diario de administración.
 */
export default function AdminCalendar() {
  
  // React State for managing loaded appointments and UI loading flag.
  // Estado de React para gestionar las citas cargadas y el indicador de carga.
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Normalize today's date to midnight to simplify date comparisons.
  // Normalizar la fecha de hoy a las 00:00:00 para simplificar las comparaciones de fechas.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // State to hold the currently selected date in the horizontal picker.
  // Estado para guardar la fecha actualmente seleccionada en el selector horizontal.
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Generate a temporal array (e.g., from 7 days ago up to 30 days in the future).
  // Generar un abanico temporal (ej. desde 7 días antes hasta 30 días en el futuro).
  const [daysRecord, setDaysRecord] = useState<Date[]>([]);
  useEffect(() => {
    const arr = [];
    for (let i = -7; i <= 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        arr.push(d);
    }
    setDaysRecord(arr);
  }, []);

  // Fetch all appointments from the backend database.
  // Obtener todas las citas desde la base de datos del backend.
  const fetchAll = async () => {
    try {
      const data = await BookingService.getAllAppointments();
      setAppointments(data);
    } catch {
      // Error silenciado para producción
    } finally {
      setLoading(false);
    }
  };

  // Perform the fetch when the component mounts.
  // Realizar la petición cuando el componente se monte.
  useEffect(() => { fetchAll(); }, []);

  // Filter ONLY the appointments that belong to the tapped/selected day.
  // Filtrar EXCLUSIVAMENTE las citas que pertenecen al día seleccionado/tocado.
  const dailyAppointments = useMemo(() => {
    return appointments.filter(app => {
      // Hide cancelled appointments from the daily agenda view.
      // Ocultar citas canceladas de la vista de agenda diaria.
      if (app.status === 'CANCELLED') return false; 
      
      const appDate = new Date(app.startAt);
      return (
        appDate.getFullYear() === selectedDate.getFullYear() &&
        appDate.getMonth() === selectedDate.getMonth() &&
        appDate.getDate() === selectedDate.getDate()
      );
    }).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()); // Sort chronologically by hour / Ordenar cronológicamente por hora
  }, [appointments, selectedDate]);

  // Helper function to format time as HH:MM ("10:30").
  // Función auxiliar para formatear la hora como HH:MM ("10:30").
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to get the short day name ("Mon", "Tue").
  // Función auxiliar para obtener el nombre corto del día ("Lun", "Mar").
  const getDayName = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  // Show a loading spinner while data is being fetched.
  // Mostrar un spinner de carga mientras se obtienen los datos.
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Header */}
      {/* Cabecera Principal */}
      <View style={styles.header}>
        <Text style={styles.title}>Agenda Diaria</Text>
      </View>

      {/* Horizontal Scrollable Date Picker */}
      {/* Selector de Fecha Horizontal (Deslizable) */}
      <View style={styles.datePickerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datePickerScroll}>
          {daysRecord.map((d, index) => {
            const isSelected = d.getTime() === selectedDate.getTime();
            const isToday = d.getTime() === today.getTime();
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateBox, isSelected && styles.dateBoxSelected]}
                onPress={() => setSelectedDate(d)}
              >
                <Text style={[styles.dateName, isSelected && styles.dateNameSelected, isToday && !isSelected && { color: Colors.primary }]}>
                  {getDayName(d)}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                  {d.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Daily Timeline displaying the appointments */}
      {/* Línea de tiempo diaria mostrando las citas */}
      <FlatList
        data={dailyAppointments}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        
        // Component rendered when the filtered list is empty.
        // Componente renderizado cuando la lista filtrada está vacía.
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cafe-outline" size={60} color={Colors.surface} />
            <Text style={styles.emptyText}>Día libre, no hay citas hoy.</Text>
          </View>
        }
        
        renderItem={({ item }) => (
          <View style={styles.timelineItem}>
            
            {/* Left Column: Time Block */}
            {/* Columna Izquierda: Bloque de hora */}
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{formatTime(item.startAt)}</Text>
            </View>
            
            {/* Right Column: Event/Client Block */}
            {/* Columna Derecha: Bloque del Evento/Cliente */}
            <View style={[styles.eventCard, item.status === 'PENDING' && { borderLeftColor: '#FFC107' }]}>
              
              {/* Línea Superior: Nombre y Teléfono */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Text style={styles.eventClientName}>{item.clientName}</Text>
                <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 13 }}>
                  📞 {item.clientPhone}
                </Text>
              </View>

              {/* Línea de Servicios contratados (Corte, Barba, etc.) */}
              <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 }}>
                {item.serviceNames?.join(', ') || 'Servicio General'}
              </Text>

              {/* Dinero y Tiempo */}
              <Text style={styles.eventServiceDuration}>
                {item.totalDurationMinutes} min · {item.totalPrice}€
              </Text>
              
              {/* Notas del cliente (SOLO si ha escrito algo real y no el autogenerado) */}
              {item.clientNotes && !item.clientNotes.includes('Reserva gestionada automáticamente') && (
                <Text style={styles.eventNotes}>"{item.clientNotes}"</Text>
              )}
              
              {/* Etiqueta de Estado del evento */}
               <View style={[styles.statusBadge, { backgroundColor: item.status === 'PENDING' ? '#FFC107' : '#4CAF50' }]}>
                   <Text style={styles.statusText}>{item.status}</Text>
               </View>
            </View>

          </View>
        )}
      />
    </View>
  );
}

// Visual Styles for the UI components
// Estilos visuales para los componentes de la interfaz
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  header: { paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text },
  
  // Date Picker Styling
  // Estilos del selector de fechas
  datePickerContainer: { backgroundColor: Colors.surface, paddingVertical: 10 },
  datePickerScroll: { paddingHorizontal: 15, gap: 10 },
  dateBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: Colors.background },
  dateBoxSelected: { backgroundColor: Colors.primary },
  dateName: { fontSize: 13, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  dateNameSelected: { color: '#fff' },
  dateNumber: { fontSize: 20, color: Colors.text, fontWeight: 'bold' },
  dateNumberSelected: { color: '#fff' },
  
  // Timeline Appointment Styling
  // Estilos de la línea de tiempo de citas
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timeColumn: { width: 60, alignItems: 'flex-start', paddingTop: 5 },
  timeText: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  eventCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 15, borderLeftWidth: 4, borderLeftColor: '#4CAF50' }, // Vertical green strip by default / Tira vertical verde por defecto
  eventClientName: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  eventServiceDuration: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  eventNotes: { fontSize: 13, fontStyle: 'italic', color: Colors.textMuted, marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  
  // Empty State Styling
  // Estilos del estado vacío
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: Colors.textMuted, fontSize: 16, marginTop: 15 },
});
