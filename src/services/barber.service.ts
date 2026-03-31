// src/services/barber.service.ts

import api from '../api/api';
import { PublicBarber } from '../types/barber.types';

/**
 * Service to manage API requests related to barbers.
 */
export const BarberService = {
  
  /**
   * Retrieves the public list of barbers.
   * Calls the unprotected backend route, so it won't fail if there is no token.
   */
  getPublicCatalog: async (): Promise<PublicBarber[]> => {
    try {
      const response = await api.get<PublicBarber[]>('/api/public/barbers');
      return response.data;
    } catch (error) {
      // Error silenciado
      throw error; 
    }
  }

};