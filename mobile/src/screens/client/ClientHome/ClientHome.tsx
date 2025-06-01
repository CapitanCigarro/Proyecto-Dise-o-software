import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './ClientHome.styles';
// Import the mock data
import mockData from '../../../../assets/mockDataClient.json';

// Data structure for notification items
interface Notification {
  id: string;
  message: string;
  date: string;
}

// Data structure for package items
interface Package {
  id: string;
  status: string;
  destination: string;
  date: string;
}

// Props definition for the Client Home screen
interface ClientHomeProps {
  navigation: any;
}

// Main dashboard component for client users
const ClientHome: React.FC<ClientHomeProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentPackages, setRecentPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState({
    active: 0,
    delivered: 0,
    total: 0
  });
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  
  // Maximum items to show without scrolling
  const MAX_VISIBLE_NOTIFICATIONS = 3;
  const MAX_VISIBLE_PACKAGES = 3;
  
  // Load data from mockData.json on component mount
  useEffect(() => {
    const loadMockData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        let currentUserId = '1'; // Default to first user if none stored
        
        if (user) {
          const userData = JSON.parse(user);
          setUserName(userData.name || '');
          
          // If we have a user ID in storage, use it
          if (userData.id) {
            currentUserId = userData.id;
            setUserId(currentUserId);
          }
        } else {
          // If no user in storage, use the first user from mock data
          const firstUser = mockData.users[0];
          setUserName(firstUser.name);
          setUserId(firstUser.id);
        }
        
        // Filter notifications for the current user
        const userNotifications = mockData.notifications.filter(
          notification => notification.userId === currentUserId
        );
        
        // Filter packages for the current user (assuming sender is the current user)
        const userPackages = mockData.packages.filter(
          pkg => mockData.users.find(u => u.id === currentUserId)?.name === pkg.sender
        );
        
        // Map packages to the expected format
        const formattedPackages = userPackages.map(pkg => ({
          id: pkg.id,
          status: pkg.status,
          destination: pkg.destination,
          date: pkg.date
        }));
        
        // Map notifications to the expected format
        const formattedNotifications = userNotifications.map(notification => ({
          id: notification.id,
          message: notification.message,
          date: notification.date
        }));
        
        setNotifications(formattedNotifications);
        setRecentPackages(formattedPackages);
        
        // Set stats based on user's stats from mock data
        const userStats = mockData.stats[`user${currentUserId}`];
        if (userStats) {
          setStats({
            active: userStats.active,
            delivered: userStats.delivered,
            total: userStats.total
          });
        } else {
          // Calculate stats from packages if not available directly
          const active = formattedPackages.filter(p => p.status !== 'Entregado').length;
          const delivered = formattedPackages.filter(p => p.status === 'Entregado').length;
          
          setStats({
            active,
            delivered,
            total: formattedPackages.length
          });
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadMockData();
  }, []);
  
  // Determine color based on package status
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
        
        {/* Notifications section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="notifications-outline" size={20} color="#333" style={{marginRight: 6}} />
              <Text style={styles.sectionTitle}>Notificaciones</Text>
            </View>
          </View>
          
          {notifications.length > 0 ? (
            <View style={styles.notificationsContainer}>
              {notifications.slice(0, MAX_VISIBLE_NOTIFICATIONS).map(item => (
                <View key={item.id} style={styles.notificationItem}>
                  <View style={styles.notificationDot} />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.notificationDate}>{item.date}</Text>
                  </View>
                </View>
              ))}
            </View>
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
            <View style={styles.packagesContainer}>
              {recentPackages.slice(0, MAX_VISIBLE_PACKAGES).map(item => (
                <TouchableOpacity 
                  key={item.id}
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
              ))}
            </View>
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

export default ClientHome;