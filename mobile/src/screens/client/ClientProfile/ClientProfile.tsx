import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './ClientProfile.styles';

// Client profile screen component displaying user information and settings
const ClientProfile = () => {
  // Mock user data state for profile information
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

  const { logout } = useAuth();
  
  // State for managing notification preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // State for managing profile editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({...userData});

  // Handle user logout with confirmation dialog
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
  
  // Initialize edit form with current user data
  const handleEditProfile = () => {
    setEditFormData({...userData});
    setIsEditing(true);
  };
  
  // Validate and save profile changes
  const handleSaveProfile = () => {
    if (!editFormData.name || !editFormData.email || !editFormData.phone || !editFormData.address) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }
    
    setUserData({...userData, ...editFormData});
    setIsEditing(false);
    
    Alert.alert('Perfil actualizado', 'Tus datos han sido actualizados correctamente');
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {/* Profile header with user avatar and stats */}
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
        
        {/* Personal information section with contact details */}
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
        
        {/* Notification preferences section */}
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
        
        {/* Logout button and app version */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </ScrollView>
      
      {/* Modal for editing profile information */}
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

export default ClientProfile;