import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { BarberService } from '../../src/services/barber.service';
import { PublicBarber } from '../../src/types/barber.types';

export default function CatalogScreen() {
  const [barbers, setBarbers] = useState<PublicBarber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setLoading(true);
      const data = await BarberService.getPublicCatalog();
      setBarbers(data);
    } catch (err) {
      setError('No se pudo cargar el catálogo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Plantilla visual para cada barbero en la lista
  const renderBarberCard = ({ item }: { item: PublicBarber }) => (
    <View style={styles.card}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={24} color={Colors.surface} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{item.name} {item.surname}</Text>
        {item.phone ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="call" size={14} color={Colors.textMuted} /> 
            <Text style={[styles.phoneText, { marginLeft: 5 }]}>
              {item.phone}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Nuestros Barberos</Text>
      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id}
        renderItem={renderBarberCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Todavía no hay barberos registrados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, paddingTop: 60 },
  centerContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginBottom: 20 },
  listContent: { paddingBottom: 20 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: Colors.surface, 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
    alignItems: 'center'
  },
  avatarPlaceholder: { 
    width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  infoContainer: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 5 },
  phoneText: { fontSize: 14, color: Colors.textMuted },
  errorText: { color: Colors.error, fontSize: 16, textAlign: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: 16, textAlign: 'center', marginTop: 40 }
});
