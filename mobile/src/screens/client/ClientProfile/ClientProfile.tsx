import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './ClientProfile.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../../../services/api';
import { packageService } from '../../../services/packageService';

// Profile screen that displays user information and package delivery statistics
const ClientProfile = () => {
  // User personal information state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    role: 'Cliente',
    memberSince: new Date().toLocaleDateString('es-CL'),
  });
  
  // Package delivery statistics state
  const [packageStats, setPackageStats] = useState({
    completed: 0,
    inProgress: 0
  });
  
  // Loading indicator state
  const [loading, setLoading] = useState(true);

  // Auth context for handling user logout
  const { logout } = useAuth();
  
  // User notification preference state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load user data and calculate package statistics
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userInfoString = await AsyncStorage.getItem('userInfo');
        
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          
          const token = userInfo.token;
          const userEmail = userInfo.email;
          
          try {
            // Get user packages to calculate statistics
            const packages = await packageService.getUserPackages(userEmail);
            
            // Calculate package statistics
            const completedPackages = packages.filter(pkg => pkg.paquete_estado === 'Entregado').length;
            const inProgressPackages = packages.filter(pkg => pkg.paquete_estado === 'En tránsito' || pkg.paquete_estado === 'Por enviar').length;
            
            setPackageStats({
              completed: completedPackages,
              inProgress: inProgressPackages
            });
            
            setUserData({
              name: userInfo.name || 'Usuario',
              email: userEmail,
              address: userInfo.address || 'No disponible',
              role: 'Cliente',
              memberSince: new Date().toLocaleDateString('es-CL'),
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Show confirmation dialog before logging out
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sí, salir',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };
  
  // Display "coming soon" message for profile editing feature
  const handleEditProfile = () => {
    Alert.alert(
      'Próximamente',
      'La función de editar perfil estará disponible en futuras actualizaciones.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#555' }}>Cargando perfil...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {/* Header section with profile picture and package statistics */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color="white" />
          </View>
          
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.role}>{userData.role}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{packageStats.completed}</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{packageStats.inProgress}</Text>
              <Text style={styles.statLabel}>En progreso</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileButton} 
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
        
        {/* Personal information card with contact details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={22} color="#007AFF" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Correo</Text>
                <Text style={styles.infoText}>{userData.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={22} color="#007AFF" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoText}>Próximamente</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={22} color="#007AFF" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoText}>{userData.address}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={22} color="#007AFF" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Miembro desde</Text>
                <Text style={styles.infoText}>{userData.memberSince}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Notification settings section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          
          <View style={styles.card}>
            <View style={styles.preferenceRow}>
              <Ionicons name="notifications-outline" size={22} color="#007AFF" style={styles.icon} />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceLabel}>Notificaciones</Text>
                <Text style={styles.preferenceDescription}>Recibir alertas de envíos</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#d8d8d8", true: "#a3d2ff" }}
                thumbColor={notificationsEnabled ? "#007AFF" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>
        
        {/* Logout button and app version information */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ClientProfile;