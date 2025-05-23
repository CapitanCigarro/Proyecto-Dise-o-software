import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  Modal,
  TextInput,
  Animated,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const DriverProfile = ({ navigation }) => {
  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  
  // State
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditPhotoOptions, setShowEditPhotoOptions] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  
  // Mock user data - in a real app, you would get this from your auth context or state
  const [userData, setUserData] = useState({
    name: 'Carlos Rodríguez',
    email: 'conductor@example.com',
    phone: '987-654-3210',
    role: 'Conductor Senior',
    vehicleType: 'Camioneta de Reparto',
    licensePlate: 'ABC-123',
    memberSince: 'Marzo 2023',
    bio: 'Conductor experimentado con 5 años en logística y entregas. Especializado en entregas urbanas rápidas.',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    totalDeliveries: 342,
    completionRate: 98.5,
    preferredArea: 'Zona Norte',
    availability: 'Lun-Vie, 8:00-18:00'
  });
  
  // Stats
  const stats = [
    { label: 'Entregas', value: userData.totalDeliveries, icon: 'cube-outline', color: '#007AFF' },
    { label: 'Valoración', value: userData.rating, icon: 'star-outline', color: '#FFD700' },
    { label: 'Efectividad', value: `${userData.completionRate}%`, icon: 'checkmark-circle-outline', color: '#5cb85c' }
  ];

  // Get logout function from auth context
  const { logout } = useAuth();

  // Start animation on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

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
              // No need to navigate - App.tsx will handle this
            } catch (error) {
              console.error('Error during logout:', error);
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const toggleEditMode = () => {
    if (editMode) {
      // Save changes
      Alert.alert(
        "Guardar Cambios",
        "¿Deseas guardar los cambios a tu perfil?",
        [
          { 
            text: "Descartar", 
            style: "cancel",
            onPress: () => setEditMode(false)
          },
          { 
            text: "Guardar", 
            onPress: async () => {
              setLoading(true);
              // Simulate network delay for saving profile
              await new Promise(resolve => setTimeout(resolve, 1000));
              setLoading(false);
              setEditMode(false);
              Alert.alert("Perfil actualizado", "Tus cambios han sido guardados correctamente.");
            }
          }
        ]
      );
    } else {
      setEditMode(true);
    }
  };
  
  const handleEditPhoto = () => {
    setShowEditPhotoOptions(true);
  };
  
  const handleDriverHistory = () => {
    // Navigate to driver history screen
    Alert.alert("Historial", "Aquí podrás ver todo tu historial de entregas");
  };
  
  const handleViewPerformance = () => {
    // Navigate to performance metrics screen
    Alert.alert("Rendimiento", "Aquí podrás ver métricas detalladas de tu rendimiento");
  };
  
  const handleUpdateAvailability = () => {
    // Open availability settings
    Alert.alert("Disponibilidad", "Actualiza tus horarios de disponibilidad");
  };
  
  const renderEditableField = (label, value, fieldName, keyboardType = 'default', multiline = false) => {
    return (
      <View style={styles.editableField}>
        <Text style={styles.editFieldLabel}>{label}</Text>
        <TextInput
          style={[
            styles.editFieldInput, 
            multiline && { height: 80, textAlignVertical: 'top' }
          ]}
          value={value}
          onChangeText={(text) => setUserData({ ...userData, [fieldName]: text })}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
    );
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header with back button and edit */}
        <View style={styles.headerNav}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={toggleEditMode}
          >
            <Ionicons name={editMode ? "save-outline" : "create-outline"} size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header with Image and Basic Info */}
          <Animated.View 
            style={[
              styles.profileHeader,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }]
              }
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: userData.profileImage }} 
                style={styles.avatar}
              />
              {editMode && (
                <TouchableOpacity 
                  style={styles.editPhotoButton}
                  onPress={handleEditPhoto}
                >
                  <Ionicons name="camera" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{userData.name}</Text>
              <View style={styles.roleContainer}>
                <Ionicons name="car-outline" size={16} color="#007AFF" />
                <Text style={styles.role}>{userData.role}</Text>
              </View>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={18} color="#FFD700" />
                <Text style={styles.rating}>{userData.rating}</Text>
                <Text style={styles.ratingCount}>({userData.totalDeliveries} entregas)</Text>
              </View>
            </View>
          </Animated.View>
          
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon} size={24} color={stat.color} style={styles.statIcon} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          
          {/* Main Content */}
          {!editMode ? (
            <>
              {/* Bio Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sobre mí</Text>
                <View style={styles.bioContainer}>
                  <Text style={styles.bioText}>{userData.bio}</Text>
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
              
              {/* Vehicle Info Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Vehículo</Text>
                <View style={styles.vehicleCard}>
                  <View style={styles.vehicleImageContainer}>
                    <Ionicons name="car" size={60} color="#007AFF" />
                  </View>
                  <View style={styles.vehicleDetails}>
                    <Text style={styles.vehicleType}>{userData.vehicleType}</Text>
                    <View style={styles.licensePlateContainer}>
                      <Text style={styles.licensePlateLabel}>Placa</Text>
                      <Text style={styles.licensePlate}>{userData.licensePlate}</Text>
                    </View>
                    <Text style={styles.preferredArea}>Área: {userData.preferredArea}</Text>
                  </View>
                </View>
              </View>
              
              {/* Quick Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleDriverHistory}
                  >
                    <View style={[styles.actionButtonIcon, { backgroundColor: '#007AFF20' }]}>
                      <Ionicons name="time-outline" size={22} color="#007AFF" />
                    </View>
                    <Text style={styles.actionButtonText}>Historial</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleViewPerformance}
                  >
                    <View style={[styles.actionButtonIcon, { backgroundColor: '#5cb85c20' }]}>
                      <Ionicons name="stats-chart-outline" size={22} color="#5cb85c" />
                    </View>
                    <Text style={styles.actionButtonText}>Rendimiento</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleUpdateAvailability}
                  >
                    <View style={[styles.actionButtonIcon, { backgroundColor: '#f0ad4e20' }]}>
                      <Ionicons name="calendar-outline" size={22} color="#f0ad4e" />
                    </View>
                    <Text style={styles.actionButtonText}>Disponibilidad</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Settings Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configuración</Text>
                <View style={styles.settingsCard}>
                  <View style={styles.settingRow}>
                    <Ionicons name="notifications-outline" size={22} color="#666" style={styles.icon} />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingText}>Notificaciones</Text>
                      <Text style={styles.settingSubtext}>Recibir alertas de nuevos paquetes</Text>
                    </View>
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: "#767577", true: "#007AFF30" }}
                      thumbColor={notificationsEnabled ? "#007AFF" : "#f4f3f4"}
                    />
                  </View>
                  
                  <View style={styles.settingRow}>
                    <Ionicons name="location-outline" size={22} color="#666" style={styles.icon} />
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingText}>Compartir ubicación</Text>
                      <Text style={styles.settingSubtext}>Permitir seguimiento en tiempo real</Text>
                    </View>
                    <Switch
                      value={locationSharing}
                      onValueChange={setLocationSharing}
                      trackColor={{ false: "#767577", true: "#007AFF30" }}
                      thumbColor={locationSharing ? "#007AFF" : "#f4f3f4"}
                    />
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Edit Profile Form */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Editar Información Personal</Text>
                <View style={styles.editFormCard}>
                  {renderEditableField('Nombre completo', userData.name, 'name')}
                  {renderEditableField('Teléfono', userData.phone, 'phone', 'phone-pad')}
                  {renderEditableField('Biografía', userData.bio, 'bio', 'default', true)}
                  {renderEditableField('Disponibilidad', userData.availability, 'availability')}
                  {renderEditableField('Área preferida', userData.preferredArea, 'preferredArea')}
                </View>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Editar Información del Vehículo</Text>
                <View style={styles.editFormCard}>
                  {renderEditableField('Tipo de vehículo', userData.vehicleType, 'vehicleType')}
                  {renderEditableField('Placa del vehículo', userData.licensePlate, 'licensePlate')}
                </View>
              </View>
              
              <View style={styles.editFormNote}>
                <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
                <Text style={styles.editFormNoteText}>
                  Algunos campos como el correo electrónico no se pueden modificar. Contacta a soporte si necesitas cambiarlos.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
        
        {/* Logout button */}
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
        
        {/* Photo options modal */}
        <Modal
          visible={showEditPhotoOptions}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEditPhotoOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cambiar foto de perfil</Text>
              
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="camera-outline" size={24} color="#007AFF" style={styles.modalOptionIcon} />
                <Text style={styles.modalOptionText}>Tomar foto</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="image-outline" size={24} color="#007AFF" style={styles.modalOptionIcon} />
                <Text style={styles.modalOptionText}>Elegir de la galería</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="trash-outline" size={24} color="#ff3b30" style={styles.modalOptionIcon} />
                <Text style={[styles.modalOptionText, { color: '#ff3b30' }]}>Eliminar foto actual</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowEditPhotoOptions(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bioContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bioText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
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
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 40,
    marginRight: 15,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  licensePlateContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  licensePlateLabel: {
    fontSize: 10,
    color: '#666',
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  preferredArea: {
    fontSize: 14,
    color: '#666',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '30%',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  editFormCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editableField: {
    marginBottom: 15,
  },
  editFieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  editFieldInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editFormNote: {
    flexDirection: 'row',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  editFormNoteText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 15,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionIcon: {
    marginRight: 15,
    width: 24,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  }
});

export default DriverProfile;