import api from '../api/api';
import { ServicePublic } from '../types/service.types';

export const ShopService = {
  /**
   * Retrieves the global list of active barbershop services.
   * Public endpoint (Does not require a JWT token).
   * 
   * @returns An array of public services modeled by ServicePublic constraint.
   */
  getPublicServices: async (): Promise<ServicePublic[]> => {
    try {
      const response = await api.get('/api/public/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching public services from backend:', error);
      throw error;
    }
  },

  /**
   * Computes the available time slots for a specific professional on a given date.
   * Public endpoint (Does not require a JWT token).
   * 
   * @param barberId - The unique UUID identifier of the barber.
   * @param dateStr - The target date formatted as YYYY-MM-DD.
   * @returns An array of logical string time slots representing the availability.
   */
  getAvailableSlots: async (barberId: string, dateStr: string): Promise<string[]> => {
    try {
      // Pass the variables natively as query parameters
      const response = await api.get('/api/public/availability', {
        params: {
          barberId: barberId,
          date: dateStr,
        }
      });
      return response.data; 
    } catch (error) {
      console.error('Error fetching available slots from backend:', error);
      throw error;
    }
  }
};
