import api from '../api/api';
import { AppointmentResponse } from '../types/appointment.types';

export interface CreateAppointmentRequest {
  barberId: string;
  startAt: string;         
  endAt: string;           
  serviceIds: string[];    
  clientNotes: string;     
}

export const BookingService = {
  /**
   * Secured endpoint to create a new appointment in the database.
   * Supabase JWT interceptor automatically attaches the authentication token.
   * 
   * @param request The detailed booking payload to be persisted.
   * @returns The generated AppointmentResponseDTO from the Spring Boot backend.
   */
  createAppointment: async (request: CreateAppointmentRequest) => {
    try {
      const response = await api.post('/api/appointments', request);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment in backend:', error);
      throw error;
    }
  },

 /**
   * Fetches the list of appointments for the currently authenticated user.
   * The interceptor will automatically handle the JWT token from Supabase.
   */

  getMyAppointments: async (): Promise<AppointmentResponse[]> => {
    try {
      const response = await api.get('/api/appointments'); 
      return response.data;
    } catch (error) {
      console.error('Error fetching my appointments:', error);
      throw error;
    }
  },

    /**
   * [ADMIN] Fetches ALL appointments from ALL clients.
   * Only to be called from the admin dashboard.
   */
    getAllAppointments: async (): Promise<AppointmentResponse[]> => {
      try {
        const response = await api.get('/api/appointments/admin/all');
        return response.data;
      } catch (error) {
        console.error('Error fetching all appointments:', error);
        throw error;
      }
    },
  
    /**
     * Updates the status of a given appointment (CONFIRMED, CANCELLED, etc.)
     * Used by the barber/admin dashboard to manage incoming reservations.
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
        console.error('Error updating appointment status:', error);
        throw error;
      }
    },
      
};


 

