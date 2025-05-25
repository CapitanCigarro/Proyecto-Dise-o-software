import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const DriverProfile = () => {
  // State
  const [loading, setLoading] = useState(false);
  
  // Mock user data
  const userData = {
    name: 'Carlos Rodríguez',
    email: 'conductor@example.com',
    phone: '987-654-3210',
    vehicleType: 'Camioneta de Reparto',
    licensePlate: 'ABC-123',
    memberSince: 'Marzo 2023',
    totalDeliveries: 342,
    availability: 'Lun-Vie, 8:00-18:00'
  };

  // Get logout function from auth context
  const { logout } = useAuth();

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
  
  const handleViewPerformance = () => {
    // Navigate to performance metrics screen
    Alert.alert("Rendimiento", "Aquí podrás ver métricas detalladas de tus entregas");
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
            
            {/* Performance button moved here */}
            <TouchableOpacity 
              style={styles.performanceButton}
              onPress={handleViewPerformance}
            >
              <Ionicons name="stats-chart" size={22} color="#fff" />
              <Text style={styles.performanceButtonText}>Rendimiento</Text>
            </TouchableOpacity>
          </View>
          
          {/* Vehicle Info - now full width */}
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
          
          {/* Personal Info Section */}
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
          
          {/* Logout button - moved inside ScrollView */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  deliveriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 16,
  },
  deliveriesText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  performanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  performanceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  // Updated vehicle card to be full width
  licensePlateCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  licensePlateIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f7ff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  vehicleInfo: {
    flex: 1,
  },
  licensePlateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    margin: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 20,
  }
});

export default DriverProfile;