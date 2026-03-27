import axios from 'axios';
import { supabase } from '../config/supabase';

/**
 * Configuración del cliente API (Axios)
 * 
 * Este archivo centraliza todas las llamadas a tu backend de Spring Boot.
 */

// IMPORTANTE: Aquí debes poner la IP de tu ordenador para que el móvil 
// pueda encontrar el servidor en la misma red WiFi.
const BACKEND_URL = 'http://172.20.10.2:8080';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000, // Si el servidor tarda más de 10s, da error
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR DE PETICIONES
 * 
 * Este es el "truco" de nivel senior. Antes de que CADA mensaje salga 
 * hacia el backend, esta función se ejecuta automáticamente.
 */
api.interceptors.request.use(
  async (config) => {
    // 1. Le pedimos a Supabase el token de la sesión actual
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    // 2. Si hay un usuario logueado, pegamos el token en la cabecera 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
