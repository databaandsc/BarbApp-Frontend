import api from '../api/api';
import { ServicePublic } from '../types/service.types';

/**
 * Shop Service / Servicio de Catálogo
 * Handles fetching available services and time slots.
 * Gestiona la obtención de los servicios disponibles y las franjas horarias.
 */
export const ShopService = {
  
  /**
   * Retrieves the global list of active barbershop services.
   * Obtiene la lista global de servicios de barbería activos.
   * 
   * Public endpoint (Does not require a JWT token).
   * Endpoint público (No requiere un token JWT).
   * 
   * @returns An array of public services. / Un array de servicios públicos.
   */
  getPublicServices: async (): Promise<ServicePublic[]> => {
    try {
      const response = await api.get('/api/public/services');
      return response.data;
    } catch (error) {
      // Error silenciado
      throw error;
    }
  },

  /**
   * Computes the available time slots for a specific professional on a given date.
   * Calcula las franjas horarias disponibles para un profesional específico en una fecha dada.
   * 
   * Public endpoint (Does not require a JWT token).
   * Endpoint público (No requiere un token JWT).
   * 
   * @param barberId The unique UUID of the barber. / El UUID único del barbero.
   * @param dateStr The target date (YYYY-MM-DD). / La fecha objetivo (YYYY-MM-DD).
   * @returns An array of time slots. / Un array de franjas horarias.
   */
  getAvailableSlots: async (barberId: string, dateStr: string): Promise<string[]> => {
    try {
      // Pass the variables natively as query parameters
      // Pasar las variables de forma nativa como parámetros de consulta
      const response = await api.get('/api/public/availability', {
        params: {
          barberId: barberId,
          date: dateStr,
        }
      });
      return response.data; 
    } catch (error) {
      // Error silenciado
      throw error;
    }
  }
};
