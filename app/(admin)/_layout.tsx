import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '../../constants/theme';

/**
 * Admin Layout Navigation.
 * Enrutador de la zona de administración.
 * Uses a Bottom Tab Navigator for the admin workspace.
 * Utiliza un modelo de Pestañas Inferiores para el área del administrador.
 */
export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
        // Hide global header so each screen provides its own.
        // Ocultar cabecera global para que cada pantalla ponga la suya.
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.surface,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}>
      
      {/* 1. Dashboard Tab */}
      {/* 1. Pestaña de Panel */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Panel',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Calendar Tab */}
      {/* 2. Pestaña de Calendario */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      
      {/* 3. Profile Tab */}
      {/* 3. Pestaña de Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
