import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const ClientProfile = () => {
  // Mock user data - in a real app, you would get this from your auth context or state
  const [userData, setUserData] = useState({
    name: 'Juan Pérez',
    email: 'cliente@example.com',
    phone: '123-456-7890',
    role: 'Cliente',
    address: 'Av. Principal 123',
    memberSince: 'Enero 2023',
    shippingCompleted: 18,
    shippingInProgress: 2
  });

  // Get logout function from auth context
  const { logout } = useAuth();
  
  // State for settings switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // State for edit profile modal
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({...userData});

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
    setEditFormData({...userData});
    setIsEditing(true);
  };
  
  const handleSaveProfile = () => {
    // Validate fields
    if (!editFormData.name || !editFormData.email || !editFormData.phone || !editFormData.address) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }
    
    // Update user data
    setUserData({...userData, ...editFormData});
    setIsEditing(false);
    
    // Show success message
    Alert.alert('Perfil actualizado', 'Tus datos han sido actualizados correctamente');
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {/* Header with profile info */}
        <View style={styles.header}>
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
          
          <TouchableOpacity 
            style={styles.editProfileButton} 
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
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
        
        {/* Notifications Preference */}
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
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        {/* App version */}
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={editFormData.name}
                onChangeText={(text) => setEditFormData({...editFormData, name: text})}
                placeholder="Nombre completo"
              />
              
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={editFormData.email}
                onChangeText={(text) => setEditFormData({...editFormData, email: text})}
                placeholder="Correo electrónico"
                keyboardType="email-address"
              />
              
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={editFormData.phone}
                onChangeText={(text) => setEditFormData({...editFormData, phone: text})}
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
              />
              
              <Text style={styles.inputLabel}>Dirección</Text>
              <TextInput
                style={styles.input}
                value={editFormData.address}
                onChangeText={(text) => setEditFormData({...editFormData, address: text})}
                placeholder="Dirección de envío"
              />
            </ScrollView>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 15,
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
  editProfileButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
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
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    maxHeight: '70%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ClientProfile;