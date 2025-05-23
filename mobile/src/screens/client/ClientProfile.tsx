import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const ClientProfile = () => {
  // Mock user data - in a real app, you would get this from your auth context or state
  const userData = {
    name: 'Juan Pérez',
    email: 'cliente@example.com',
    phone: '123-456-7890',
    role: 'Cliente',
    address: 'Av. Principal 123',
    memberSince: 'Enero 2023',
    shippingCompleted: 18,
    shippingInProgress: 2,
    preferredPayment: 'Tarjeta de crédito'
  };

  // Get logout function from auth context
  const { logout } = useAuth();
  
  // State for settings switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleLogout = async () => {
    try {
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
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const handleEditProfile = () => {
    Alert.alert(
      'Editar Perfil',
      'Esta funcionalidad estará disponible próximamente.'
    );
  };
  
  const handleOpenHelp = () => {
    Alert.alert(
      'Ayuda',
      'Para asistencia, contacte a soporte@example.com o llame al 0800-123-4567.'
    );
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {/* Header with gradient background */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.editProfileButton} 
            onPress={handleEditProfile}
          >
            <Ionicons name="pencil" size={18} color="white" />
          </TouchableOpacity>
          
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color="white" />
          </View>
          
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.role}>{userData.role}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.shippingCompleted}</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.shippingInProgress}</Text>
              <Text style={styles.statLabel}>En progreso</Text>
            </View>
          </View>
        </View>
        
        {/* Personal Information */}
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
                <Text style={styles.infoText}>{userData.phone}</Text>
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
        
        {/* Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
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
            
            <View style={styles.preferenceRow}>
              <Ionicons name="location-outline" size={22} color="#007AFF" style={styles.icon} />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceLabel}>Ubicación</Text>
                <Text style={styles.preferenceDescription}>Usar ubicación para mejores resultados</Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: "#d8d8d8", true: "#a3d2ff" }}
                thumbColor={locationEnabled ? "#007AFF" : "#f4f3f4"}
              />
            </View>
            
            <View style={styles.preferenceRow}>
              <Ionicons name="card-outline" size={22} color="#007AFF" style={styles.icon} />
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceLabel}>Método de Pago</Text>
                <Text style={styles.preferenceDescription}>{userData.preferredPayment}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changeText}>Cambiar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Support & Account Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Soporte y Cuenta</Text>
          
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow} onPress={handleOpenHelp}>
              <Ionicons name="help-circle-outline" size={22} color="#007AFF" style={styles.icon} />
              <Text style={styles.actionText}>Centro de Ayuda</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.iconRight} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionRow}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#007AFF" style={styles.icon} />
              <Text style={styles.actionText}>Política de Privacidad</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.iconRight} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionRow}>
              <Ionicons name="document-text-outline" size={22} color="#007AFF" style={styles.icon} />
              <Text style={styles.actionText}>Términos y Condiciones</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.iconRight} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        {/* App version */}
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  editProfileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  role: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 5,
    width: '80%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  icon: {
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  iconRight: {
    marginLeft: 'auto',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333',
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  changeText: {
    color: '#007AFF',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 30,
  }
});

export default ClientProfile;