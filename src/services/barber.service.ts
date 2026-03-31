import api from '../api/api';
import { PublicBarber } from '../types/barber.types';

/**
 * Barber Service / Servicio de Barberos
 * Service to manage API requests related to barbers.
 * Servicio para gestionar las peticiones a la API relacionadas con los barberos.
 */
export const BarberService = {
  
  /**
   * Retrieves the public list of barbers.
   * Obtiene la lista pública de barberos.
   * 
   * Calls the unprotected backend route, avoiding token requirements.
   * Llama a la ruta desprotegida del backend, evitando los requisitos del token.
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