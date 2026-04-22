import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { ShopService } from '../../src/services/shop.service';
import { ServicePublic } from '../../src/types/service.types';

export default function BarberDetailScreen() {
  const { id, name, surname } = useLocalSearchParams<{ id: string, name: string, surname: string }>();
  const [services, setServices] = useState<ServicePublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize service data on component mount.
   */
  useEffect(() => {
    loadServices();
  }, []);

  /**
   * Fetches the public services from the global barbershop catalog.
   */
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await ShopService.getPublicServices();
      setServices(data);
    } catch {
      setError('Error al cargar los servicios. Por favor, inténtelo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders a UI card for an individual service option.
   */
  const renderServiceCard = ({ item }: { item: ServicePublic }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.serviceDuration}>
          <Ionicons name="time-outline" size={14} /> {item.durationMinutes} min
        </Text>
      </View>
      
      <View style={styles.serviceAction}>
        <Text style={styles.servicePrice}>{item.price} €</Text>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => router.push({
            pathname: '/booking/calendar' as any,
            params: { 
              barberId: id, 
              barberName: `${name} ${surname}`,
              serviceId: item.id,
              serviceName: item.name,
              serviceDuration: item.durationMinutes,
              servicePrice: item.price
            }
          })}
        >
          <Text style={styles.selectButtonText}>Seleccionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header: Botón de volver y datos del barbero */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerProfile}>
          <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${name}+${surname}&background=333333&color=ffffff&size=150` }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.headerName}>{name} {surname}</Text>
            <Text style={styles.headerSubtitle}>Elige un servicio</Text>
          </View>
        </View>
      </View>

      {/* Lista de Servicios */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay servicios disponibles en este momento.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 50 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface
  },
  backButton: { marginRight: 15 },
  headerProfile: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  headerName: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  headerSubtitle: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  listContent: { padding: 20 },
  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  serviceInfo: { flex: 1, paddingRight: 10 },
  serviceName: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  serviceDescription: { fontSize: 13, color: Colors.textMuted, marginBottom: 8 },
  serviceDuration: { fontSize: 13, color: Colors.text, fontWeight: '500' },
  serviceAction: { alignItems: 'flex-end' },
  servicePrice: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 10 },
  selectButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  selectButtonText: { color: Colors.background, fontWeight: 'bold', fontSize: 14 },
  errorText: { color: Colors.error, fontSize: 16, textAlign: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: 16, textAlign: 'center', marginTop: 40 }
});
