import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

interface Notification {
  id: string;
  message: string;
  date: string;
}

interface Package {
  id: string;
  status: string;
  destination: string;
  date: string;
}

interface ClientHomeProps {
  navigation: any;
}

const ClientHome: React.FC<ClientHomeProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentPackages, setRecentPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState({
    active: 0,
    delivered: 0,
    total: 0
  });
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Cargar datos mock - en una app real, estos vendrían de una API
    const loadMockData = async () => {
      try {
        // Cargar nombre de usuario
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setUserName(userData.name || '');
        }
        
        // Mock notifications - removed isRead property
        const mockNotifications = [
          { id: '1', message: 'Tu paquete #1234 ha sido recogido', date: '2023-05-23 10:30' },
          { id: '2', message: 'Tu paquete #5678 ha sido entregado', date: '2023-05-22 14:15' },
        ];
        
        // Mock recent packages
        const mockPackages = [
          { id: '1234', status: 'En tránsito', destination: 'Calle Principal 123', date: '2023-05-23' },
          { id: '5678', status: 'Entregado', destination: 'Avenida Central 456', date: '2023-05-22' },
          { id: '9012', status: 'Pendiente', destination: 'Plaza Central 789', date: '2023-05-21' },
        ];
        
        setNotifications(mockNotifications);
        setRecentPackages(mockPackages);
        
        // Calcular estadísticas
        const active = mockPackages.filter(p => p.status !== 'Entregado').length;
        const delivered = mockPackages.filter(p => p.status === 'Entregado').length;
        
        setStats({
          active,
          delivered,
          total: mockPackages.length
        });
        
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadMockData();
  }, []);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Pendiente': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {/* Header with welcome message and New Package button */}
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeText}>
              {userName ? `Hola, ${userName}` : 'Bienvenido'}
            </Text>
            <Text style={styles.subtitle}>Panel de seguimiento</Text>
          </View>
          <TouchableOpacity 
            style={styles.newPackageButton}
            onPress={() => navigation.navigate('PackageRegistration')}
          >
            <Ionicons name="add-circle" size={18} color="#fff" />
            <Text style={styles.newPackageButtonText}>Nuevo Paquete</Text>
          </TouchableOpacity>
        </View>
        
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.active}</Text>
            <Text style={styles.statLabel}>Activos</Text>
            <Ionicons name="cube-outline" size={24} color="#f0ad4e" style={styles.statIcon} />
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.delivered}</Text>
            <Text style={styles.statLabel}>Entregados</Text>
            <Ionicons name="checkmark-circle-outline" size={24} color="#5cb85c" style={styles.statIcon} />
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
            <Ionicons name="stats-chart-outline" size={24} color="#0275d8" style={styles.statIcon} />
          </View>
        </View>
        
        {/* Notifications section - simplified */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="notifications-outline" size={20} color="#333" style={{marginRight: 6}} />
              <Text style={styles.sectionTitle}>Notificaciones</Text>
            </View>
          </View>
          
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <View style={styles.notificationDot} />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.notificationDate}>{item.date}</Text>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              style={styles.notificationsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="notifications-off-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyText}>No hay notificaciones nuevas</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No hay notificaciones nuevas</Text>
            </View>
          )}
        </View>
        
        {/* Recent packages section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="cube-outline" size={20} color="#333" style={{marginRight: 6}} />
              <Text style={styles.sectionTitle}>Paquetes Recientes</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('PackageTracking')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {recentPackages.length > 0 ? (
            <FlatList
              data={recentPackages}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.packageItem}
                  onPress={() => navigation.navigate('PackageTracking', { packageId: item.id })}
                >
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                  <View style={styles.packageInfo}>
                    <Text style={styles.packageId}>Paquete #{item.id}</Text>
                    <Text style={styles.packageDestination}>{item.destination}</Text>
                    <Text style={styles.packageDate}>{item.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusBadgeText}>{item.status}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              style={styles.packagesList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="cube-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyText}>No hay paquetes recientes</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No hay paquetes recientes</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  statIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.7,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 15,
    marginTop: 5,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  packagesList: {
    marginTop: 5,
  },
  packageItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  packageDestination: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  packageDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  notificationsList: {
    marginTop: 5,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
  },
  newPackageButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  newPackageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  }
});

export default ClientHome;