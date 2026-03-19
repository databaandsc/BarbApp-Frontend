import api from '../api/api';
import { ServicePublic } from '../types/service.types';

export const ShopService = {
  /**
 * Retrieves the global list of active barbershop services.
 * Public endpoint (Does not require a JWT token).
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
};
