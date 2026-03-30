import React from 'react';
import ProfileScreen from '../(tabs)/profile';

/**
 * Admin Profile Wrapper.
 * Envoltorio del perfil de administrador.
 * Reuses the existing Profile logic from the customer side to keep the code DRY.
 * Reutiliza la lógica de Perfil existente del lado del cliente para no repetir código.
 */
export default function AdminProfile() {
  return <ProfileScreen />;
}
