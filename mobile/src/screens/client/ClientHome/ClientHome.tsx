import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './ClientHome.styles';
import mockData from '../../../../assets/mockDataClient.json';
import { ROUTES } from '../../../navigation/routes';
import { packageService } from '../../../services/packageService';

// Interface for notification items
interface Notification {
  id: string;
  message: string;
  date: string;
}

// Interface for package data
interface Package {
  paquete_id: number;
  paquete_peso: string;
  paquete_dimensiones: string;
  paquete_estado: string;
  paquete_destinatario: string;
  paquete_fecha: string;
  usuario_correo: string;
  ruta_id: number;
}

interface ClientHomeProps {
  navigation: any;
}

// Main dashboard component for client users to track packages
const ClientHome: React.FC<ClientHomeProps> = ({ navigation }) => {
  // State for user data and notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentPackages, setRecentPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState({
    active: 0,
    delivered: 0,
    total: 0
  });
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  
  const MAX_VISIBLE_NOTIFICATIONS = 3;
  const MAX_VISIBLE_PACKAGES = 3;
  
  // Fetch user data and packages from storage and API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (!userInfoString) {
          console.error('No user info found in storage');
          return;
        }

        const userInfo = JSON.parse(userInfoString);
        setUserName(userInfo.name || '');
        
        const userEmail = userInfo.email;
        if (!userEmail) {
          console.error('No user email found');
          return;
        }
        
        const packages = await packageService.getUserPackages(userEmail);
        setRecentPackages(packages);
        
        const active = packages.filter(p => p.paquete_estado !== 'Entregado').length;
        const delivered = packages.filter(p => p.paquete_estado === 'Entregado').length;
        
        setStats({
          active,
          delivered,
          total: packages.length
        });
        
      } catch (error) {
        console.error('Error loading data:', error);
        setRecentPackages([]);
      }
    };
    
    loadUserData();
  }, []);
  
  // Determine color based on package status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Por enviar': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  // Format date string to Chilean format
  const formatChileanDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      const options = { 
        timeZone: 'America/Santiago',
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit'
      };
      
      return date.toLocaleDateString('es-CL', options);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
  };
  
  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {/* Header section with welcome message and action button */}
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeText}>
              {userName ? `Hola, ${userName}` : 'Bienvenido'}
            </Text>
            <Text style={styles.subtitle}>Panel de seguimiento</Text>
          </View>
          <TouchableOpacity 
            style={styles.newPackageButton}
            onPress={() => navigation.navigate(ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM)}
          >
            <Ionicons name="add-circle" size={18} color="#fff" />
            <Text style={styles.newPackageButtonText}>Nuevo Paquete</Text>
          </TouchableOpacity>
        </View>
        
        {/* Package statistics summary */}
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
              <Text style={styles.emptyText}>PROXIMAMENTE</Text>
              <Ionicons name="notifications-off-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No hay notificaciones nuevas</Text>
            </View>
          )}
        </View>
        
        {/* Recent packages list with navigation to details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="cube-outline" size={20} color="#333" style={{marginRight: 6}} />
              <Text style={styles.sectionTitle}>Paquetes Recientes</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CLIENT.PACKAGE_TRACKING, {
              screen: ROUTES.CLIENT.PACKAGE_TRACKING_LIST
            })}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {recentPackages.length > 0 ? (
            <View style={styles.packagesContainer}>
              {recentPackages.slice(0, MAX_VISIBLE_PACKAGES).map(item => (
                <TouchableOpacity 
                  key={item.paquete_id}
                  style={styles.packageItem}
                  onPress={() => navigation.navigate(ROUTES.CLIENT.PACKAGE_TRACKING, {
                    screen: ROUTES.CLIENT.PACKAGE_DETAIL,
                    params: { package: item }
                  })}
                >
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.paquete_estado) }]} />
                  <View style={styles.packageInfo}>
                    <Text style={styles.packageId}>Paquete #{item.paquete_id}</Text>
                    <Text style={styles.packageDestination}>{item.paquete_destinatario}</Text>
                    <Text style={styles.packageDate}>{formatChileanDate(item.paquete_fecha)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.paquete_estado) }]}>
                    <Text style={styles.statusBadgeText}>{item.paquete_estado}</Text>
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