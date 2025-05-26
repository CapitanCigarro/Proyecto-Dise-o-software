import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './DriverProfile.styles';

// Import mock data
import mockDriverData from '../../../../assets/mockDataDriver.json';

// Driver profile screen component displaying driver information and settings
const DriverProfile = () => {
  // State for handling loading indicators
  const [loading, setLoading] = useState(false);
  
  // Get driver profile data from mock data
  const userData = mockDriverData.driverProfile;
  
  // Get performance stats from mock data
  const performanceStats = mockDriverData.stats.performance;

  // Get logout function from auth context
  const { logout } = useAuth();

  // Handle logout with confirmation dialog
  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesión", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              // Simulate network delay
              await new Promise(resolve => setTimeout(resolve, 800));
              await logout();
            } catch (error) {
              console.error('Error during logout:', error);
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Navigate to performance metrics screen
  const handleViewPerformance = () => {
    Alert.alert(
      "Estadísticas de Rendimiento", 
      `Entregas a tiempo: ${performanceStats.onTimeDeliveryRate}%\nSatisfacción del cliente: ${performanceStats.customerSatisfaction}/5\nPromedio de entregas diarias: ${performanceStats.avgDeliveriesPerDay}`
    );
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header with title */}
        <View style={styles.headerNav}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header with Name and Deliveries */}
          <View style={styles.profileHeader}>
            <Text style={styles.name}>{userData.name}</Text>
            <View style={styles.deliveriesContainer}>
              <Ionicons name="cube-outline" size={20} color="#007AFF" />
              <Text style={styles.deliveriesText}>{userData.totalDeliveries} entregas realizadas</Text>
            </View>
            
            {/* Performance statistics button */}
            <TouchableOpacity 
              style={styles.performanceButton}
              onPress={handleViewPerformance}
            >
              <Ionicons name="stats-chart" size={22} color="#fff" />
              <Text style={styles.performanceButtonText}>Rendimiento</Text>
            </TouchableOpacity>
          </View>
          
          {/* Vehicle information section */}
          <View style={styles.section}>
            <View style={styles.licensePlateCard}>
              <View style={styles.licensePlateIcon}>
                <Ionicons name="car" size={32} color="#007AFF" />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.licensePlateLabel}>Vehículo Asignado</Text>
                <Text style={styles.licensePlate}>{userData.licensePlate}</Text>
                <Text style={styles.vehicleType}>{userData.vehicleType}</Text>
              </View>
            </View>
          </View>
          
          {/* Personal information section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={22} color="#666" style={styles.icon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Correo electrónico</Text>
                  <Text style={styles.infoText}>{userData.email}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={22} color="#666" style={styles.icon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Teléfono</Text>
                  <Text style={styles.infoText}>{userData.phone}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={22} color="#666" style={styles.icon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Miembro desde</Text>
                  <Text style={styles.infoText}>{userData.memberSince}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={22} color="#666" style={styles.icon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Disponibilidad</Text>
                  <Text style={styles.infoText}>{userData.availability}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Logout button with loading state */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Extra space at bottom for better scrolling */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default DriverProfile;