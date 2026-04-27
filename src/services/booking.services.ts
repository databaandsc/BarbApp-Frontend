import api from '../api/api';
import { AppointmentResponse } from '../types/appointment.types';

export interface CreateAppointmentRequest {
  barberId: string;
  startAt: string;         
  endAt: string;           
  serviceIds: string[];    
  clientNotes: string;     
}

/**
 * Booking Service / Servicio de Reservas
 * Handles all interactions with the backend appointments API.
 * Gestiona todas las interacciones con la API de citas en el backend.
 */
export const BookingService = {

  /**
   * Secured endpoint to create a new appointment in the database.
   * Endpoint seguro para crear una nueva cita en la base de datos.
   * 
   * Supabase JWT interceptor automatically attaches the authentication token.
   * El interceptor JWT de Supabase adjunta automáticamente el token de autenticación.
   * 
   * @param request The detailed booking payload to be persisted. / La carga útil detallada de la reserva a persistir.
   * @returns The generated AppointmentResponseDTO from the backend. / El AppointmentResponseDTO generado por el backend.
   */
  createAppointment: async (request: CreateAppointmentRequest) => {
    try {
      const response = await api.post('/api/appointments', request);
      return response.data;
    } catch (error) {
      // Error silenced / Error silenciado
      throw error;
    }
  },

  /**
   * Fetches the list of appointments for the currently authenticated user.
   * Obtiene la lista de citas para el usuario actualmente autenticado.
   */
  getMyAppointments: async (): Promise<AppointmentResponse[]> => {
    try {
      const response = await api.get('/api/appointments'); 
      return response.data;
    } catch (error) {
      // Error silenced / Error silenciado
      throw error;
    }
  },

  /**
   * [ADMIN] Fetches ALL appointments from ALL clients.
   * [ADMIN] Obtiene TODAS las citas de TODOS los clientes.
   * 
   * Only to be called from the admin dashboard.
   * Solo debe llamarse desde el panel de control del administrador.
   */
  getAllAppointments: async (): Promise<AppointmentResponse[]> => {
    try {
      const response = await api.get('/api/appointments/admin/all');
      return response.data;
    } catch (error) {
      // Error silenced / Error silenciado
      throw error;
    }
  },

  /**
   * Updates the status of a given appointment (CONFIRMED, CANCELLED, etc.)
   * Actualiza el estado de una cita dada (CONFIRMED, CANCELLED, etc.)
   * 
   * Used by the barber/admin dashboard to manage incoming reservations.
   * Utilizado por el panel del barbero/admin para gestionar las reservas entrantes.
   */
  updateAppointmentStatus: async (appointmentId: string, newStatus: string): Promise<AppointmentResponse> => {
    try {
      const response = await api.patch(
        `/api/appointments/${appointmentId}/status`,
        null,
        { params: { newStatus } }
      );
      return response.data;
    } catch (error) {
      // Error silenced / Error silenciado
      throw error;
    }
  },

};
