import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { BarberService } from '../../src/services/barber.service';
import { PublicBarber } from '../../src/types/barber.types';

/**
 * Catalog Screen / Pantalla del Catálogo
 * Displays the list of available barbers for clients to book.
 * Muestra la lista de barberos disponibles para que los clientes puedan reservar.
 */
export default function CatalogScreen() {
  const [barbers, setBarbers] = useState<PublicBarber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize catalog data on component mount.
   * Inicializa los datos del catálogo al montar el componente.
   */
  useEffect(() => {
    loadBarbers();
  }, []);

  /**
   * Fetches the public barber list from the API asynchronously.
   * Obtiene la lista pública de barberos desde la API de forma asíncrona.
   * 
   * Handles state transitions for loading status and potential network errors.
   * Maneja las transiciones de estado para el progreso de carga y posibles errores de red.
   */
  const loadBarbers = async () => {
    try {
      setLoading(true);
      const data = await BarberService.getPublicCatalog();
      setBarbers(data);
    } catch {
      setError('Failed to load the barber catalog. Please try again later. / Error al cargar el catálogo.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders a styled UI card for an individual barber record.
   * Renderiza una tarjeta estilizada para un registro individual de barbero.
   * 
   * @param item The PublicBarber object data structure to render. / El objeto PublicBarber a renderizar.
   */
  const renderBarberCard = ({ item }: { item: PublicBarber }) => (
    <View style={styles.card}>
      {/* Avatar Placeholder: Dynamically generated UI Avatars based on user's full name */}
      {/* Avatar Placeholder: Avatares generados dinámicamente basados en el nombre completo del usuario */}
      <Image 
        source={{ uri: `https://ui-avatars.com/api/?name=${item.name}+${item.surname}&background=333333&color=ffffff&size=150` }} 
        style={styles.avatarImage} 
      />
      
      {/* Core Barber Information Section */}
      {/* Sección principal de información del barbero */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.surnameText}>{item.surname}</Text>
        <Text style={styles.specialtyText}>Senior Barber</Text>
      </View>

      {/* Primary Call-To-Action (CTA) */}
      {/* Botón de llamada a la acción principal */}
      <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push({
          pathname: `/barber/${item.id}` as any,
          params: { name: item.name, surname: item.surname }
          })}
          >
          <Text style={styles.actionButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );

  // Render network loading state / Renderizar estado de carga de red
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Render network error state / Renderizar estado de error de red
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render the populated catalog view / Renderizar la vista del catálogo con datos
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Our Barbers / Barberos</Text>
      
      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id}
        renderItem={renderBarberCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No barbers registered yet. / No hay barberos registrados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    padding: 20, 
    paddingTop: 60 
  },
  centerContainer: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: Colors.primary, 
    marginBottom: 20 
  },
  listContent: { 
    paddingBottom: 20 
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: Colors.surface, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  avatarImage: { 
    width: 64, 
    height: 64, 
    borderRadius: 32,
    backgroundColor: Colors.background, 
    marginRight: 16 
  },
  infoContainer: { 
    flex: 1,
    justifyContent: 'center'
  },
  nameText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: Colors.text,
  },
  surnameText: {
    fontSize: 16, 
    fontWeight: '400', 
    color: Colors.text,
    marginBottom: 4
  },
  specialtyText: { 
    fontSize: 13, 
    color: Colors.primary, 
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  actionButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14
  },
  errorText: { 
    color: Colors.error, 
    fontSize: 16, 
    textAlign: 'center' 
  },
  emptyText: { 
    color: Colors.textMuted, 
    fontSize: 16, 
    textAlign: 'center', 
    marginTop: 40 
  }
});
