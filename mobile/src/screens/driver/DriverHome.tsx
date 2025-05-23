import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
  TextInput,
  Animated,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

interface Package {
  id: string;
  status: string;
  recipient: string;
  address: string;
  date: string;
  description?: string;
}

interface DriverHomeProps {
  navigation: any;
}

const DriverHome: React.FC<DriverHomeProps> = ({ navigation }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout } = useAuth();
  const searchInputRef = useRef<TextInput>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(50)).current;
  
  // Screen dimensions
  const { width } = Dimensions.get('window');

  // Statistics for dashboard
  const [stats, setStats] = useState({
    pending: 0,
    inTransit: 0,
    delivered: 0,
    total: 0
  });

  useEffect(() => {
    loadPackages();
    
    // Start intro animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  // Apply search/filter when packages or search terms change
  useEffect(() => {
    filterPackages();
  }, [packages, searchQuery, filterStatus]);
  
  // Filter packages based on search and status filter
  const filterPackages = () => {
    let filtered = [...packages];
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(pkg => 
        pkg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter if not showing all
    if (filterStatus !== 'all') {
      filtered = filtered.filter(pkg => pkg.status === filterStatus);
    }
    
    setFilteredPackages(filtered);
  };

  const loadPackages = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const packagesJson = await AsyncStorage.getItem('packages');
      let packagesData = [];
      
      if (packagesJson) {
        packagesData = JSON.parse(packagesJson);
      } else {
        // Mock data if no saved packages
        packagesData = [
          { 
            id: '1234', 
            status: 'Pendiente',
            recipient: 'María García', 
            address: 'Calle Principal 123', 
            date: '2023-05-20',
            description: 'Caja mediana'
          },
          { 
            id: '5678', 
            status: 'En tránsito',
            recipient: 'Carlos Rodríguez', 
            address: 'Avenida Central 456', 
            date: '2023-05-18',
            description: 'Sobre pequeño'
          },
          { 
            id: '9012', 
            status: 'Entregado',
            recipient: 'Ana López', 
            address: 'Plaza Mayor 789', 
            date: '2023-05-15',
            description: 'Paquete frágil'
          },
          { 
            id: '3456', 
            status: 'Pendiente',
            recipient: 'Roberto Méndez', 
            address: 'Avenida Libertad 234', 
            date: '2023-05-19',
            description: 'Documentos importantes'
          },
          { 
            id: '7890', 
            status: 'En tránsito',
            recipient: 'Laura Torres', 
            address: 'Calle Norte 567', 
            date: '2023-05-21',
            description: 'Electrónica'
          },
        ];
        
        // Save mock data
        await AsyncStorage.setItem('packages', JSON.stringify(packagesData));
      }
      
      // Sort by date (newest first)
      packagesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setPackages(packagesData);
      setFilteredPackages(packagesData);
      
      // Calculate stats
      const pending = packagesData.filter(p => p.status === 'Pendiente').length;
      const inTransit = packagesData.filter(p => p.status === 'En tránsito').length;
      const delivered = packagesData.filter(p => p.status === 'Entregado').length;
      
      setStats({
        pending,
        inTransit,
        delivered,
        total: packagesData.length
      });
      
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('Error', 'No se pudieron cargar los paquetes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadPackages();
  };
  
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedPackage) return;
    
    try {
      // Start loading animation
      setStatusModalVisible(false);
      setLoading(true);
      
      // Update package status
      const updatedPackages = packages.map(pkg => {
        if (pkg.id === selectedPackage.id) {
          return { ...pkg, status: newStatus };
        }
        return pkg;
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('packages', JSON.stringify(updatedPackages));
      
      // Update state
      setPackages(updatedPackages);
      
      // Recalculate stats
      const pending = updatedPackages.filter(p => p.status === 'Pendiente').length;
      const inTransit = updatedPackages.filter(p => p.status === 'En tránsito').length;
      const delivered = updatedPackages.filter(p => p.status === 'Entregado').length;
      
      setStats({
        pending,
        inTransit,
        delivered,
        total: updatedPackages.length
      });
      
      // Show success message
      Alert.alert(
        'Estado Actualizado', 
        `El paquete #${selectedPackage.id} ahora está ${newStatus}`,
        [
          { 
            text: 'Notificar al cliente', 
            onPress: () => handleClientNotification(selectedPackage.id, newStatus) 
          },
          { text: 'OK' }
        ]
      );
      
    } catch (error) {
      console.error('Error updating package status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del paquete');
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };
  
  const handleClientNotification = (packageId: string, status: string) => {
    // In a real app, this would send a push notification to the client
    // For now, just show a confirmation
    Alert.alert(
      'Notificación Enviada',
      `Se ha notificado al cliente sobre la actualización del paquete #${packageId}`
    );
  };
  
  const openStatusModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setStatusModalVisible(true);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Pendiente': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'En tránsito': return 'car-outline';
      case 'Entregado': return 'checkmark-circle-outline';
      case 'Pendiente': return 'hourglass-outline';
      default: return 'help-circle-outline';
    }
  };
  
  const navigateToRoute = () => {
    navigation.navigate('RouteVisualization');
  };
  
  const navigateToProfile = () => {
    navigation.navigate('DriverProfile');
    setMenuVisible(false);
  };

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro que deseas salir?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: async () => await logout() }
        ]
      );
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };
  
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  
  const applyStatusFilter = (status: string) => {
    setFilterStatus(status);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const renderPackageItem = ({ item }: { item: Package }) => (
    <TouchableOpacity 
      style={[
        styles.packageItem,
        { borderLeftColor: getStatusColor(item.status), borderLeftWidth: 4 }
      ]}
      onPress={() => openStatusModal(item)}
      activeOpacity={0.8}
    >
      <View style={styles.packageHeader}>
        <View style={styles.packageIdContainer}>
          <Text style={styles.packageId}>#{item.id}</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={12} color="#999" style={styles.dateIcon} />
            <Text style={styles.packageDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '22', borderColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} style={{marginRight: 4}} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.packageDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={18} color="#666" style={styles.detailIcon} />
          <Text style={styles.recipientText}>{item.recipient}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color="#666" style={styles.detailIcon} />
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
        
        {item.description && (
          <View style={styles.detailRow}>
            <Ionicons name="information-circle-outline" size={18} color="#666" style={styles.detailIcon} />
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openStatusModal(item)}
        >
          <Ionicons name="refresh-outline" size={18} color="#007AFF" />
          <Text style={styles.actionText}>Actualizar</Text>
        </TouchableOpacity>
        
        <View style={styles.actionDivider} />
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('RouteVisualization', { packageId: item.id })}
        >
          <Ionicons name="navigate-outline" size={18} color="#007AFF" />
          <Text style={styles.actionText}>Ver Ruta</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  // Empty state component
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://img.icons8.com/color/96/000000/empty-box.png' }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>
        No hay paquetes {filterStatus !== 'all' ? `con estado "${filterStatus}"` : ''}
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Prueba con otra búsqueda o filtro' : 'Todos tus paquetes asignados aparecerán aquí'}
      </Text>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Panel de Conductor</Text>
            <Text style={styles.subtitle}>Gestiona tus entregas</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleSearch}
            >
              <Ionicons name={showSearch ? "close-outline" : "search-outline"} size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleMenu}
            >
              <Ionicons name="menu-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search bar */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Buscar por ID, destinatario o dirección"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        
        {/* Stats Cards */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.statsCard, 
              filterStatus === 'Pendiente' && styles.statsCardActive
            ]}
            onPress={() => applyStatusFilter(filterStatus === 'Pendiente' ? 'all' : 'Pendiente')}
          >
            <View style={[styles.statsIconContainer, { backgroundColor: '#d9534f20' }]}>
              <Ionicons name="hourglass-outline" size={24} color="#d9534f" />
            </View>
            <Text style={styles.statsNumber}>{stats.pending}</Text>
            <Text style={styles.statsLabel}>Pendientes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statsCard,
              filterStatus === 'En tránsito' && styles.statsCardActive
            ]}
            onPress={() => applyStatusFilter(filterStatus === 'En tránsito' ? 'all' : 'En tránsito')}
          >
            <View style={[styles.statsIconContainer, { backgroundColor: '#f0ad4e20' }]}>
              <Ionicons name="car-outline" size={24} color="#f0ad4e" />
            </View>
            <Text style={styles.statsNumber}>{stats.inTransit}</Text>
            <Text style={styles.statsLabel}>En tránsito</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statsCard,
              filterStatus === 'Entregado' && styles.statsCardActive
            ]}
            onPress={() => applyStatusFilter(filterStatus === 'Entregado' ? 'all' : 'Entregado')}
          >
            <View style={[styles.statsIconContainer, { backgroundColor: '#5cb85c20' }]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#5cb85c" />
            </View>
            <Text style={styles.statsNumber}>{stats.delivered}</Text>
            <Text style={styles.statsLabel}>Entregados</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Route Action Button */}
        <TouchableOpacity 
          style={styles.routeButton}
          onPress={navigateToRoute}
        >
          <View style={styles.routeButtonIcon}>
            <Ionicons name="map-outline" size={22} color="white" />
          </View>
          <Text style={styles.routeButtonText}>Ver todas mis rutas de entrega</Text>
          <Ionicons name="chevron-forward" size={20} color="white" style={styles.routeButtonArrow} />
        </TouchableOpacity>
        
        {/* Package List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {filterStatus !== 'all' 
                ? `Paquetes ${filterStatus}s` 
                : 'Todos los Paquetes'
              }
            </Text>
            <Text style={styles.listSubtitle}>
              Total: {filteredPackages.length}
            </Text>
          </View>
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loaderText}>Cargando paquetes...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredPackages}
              renderItem={renderPackageItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.packagesList}
              ListEmptyComponent={renderEmptyList}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#007AFF"]}
                  tintColor="#007AFF"
                />
              }
            />
          )}
        </View>
        
        {/* Status Update Modal */}
        <Modal
          visible={statusModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setStatusModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Actualizar Estado</Text>
                <TouchableOpacity 
                  onPress={() => setStatusModalVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.packageSummary}>
                <Text style={styles.modalPackageId}>
                  Paquete #{selectedPackage?.id}
                </Text>
                <Text style={styles.modalPackageDestination}>
                  Para: {selectedPackage?.recipient}
                </Text>
                <Text style={styles.modalPackageAddress}>
                  {selectedPackage?.address}
                </Text>
              </View>
              
              <View style={styles.statusOptionDivider}>
                <Text style={styles.statusOptionDividerText}>Selecciona nuevo estado</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.statusOption, { backgroundColor: '#d9534f20' }]}
                onPress={() => handleStatusUpdate('Pendiente')}
              >
                <View style={[styles.statusOptionIcon, { backgroundColor: '#d9534f' }]}>
                  <Ionicons name="hourglass-outline" size={24} color="white" />
                </View>
                <View style={styles.statusOptionContent}>
                  <Text style={[styles.statusOptionText, { color: '#d9534f' }]}>Pendiente</Text>
                  <Text style={styles.statusOptionDescription}>El paquete está pendiente de ser recogido</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.statusOption, { backgroundColor: '#f0ad4e20' }]}
                onPress={() => handleStatusUpdate('En tránsito')}
              >
                <View style={[styles.statusOptionIcon, { backgroundColor: '#f0ad4e' }]}>
                  <Ionicons name="car-outline" size={24} color="white" />
                </View>
                <View style={styles.statusOptionContent}>
                  <Text style={[styles.statusOptionText, { color: '#f0ad4e' }]}>En tránsito</Text>
                  <Text style={styles.statusOptionDescription}>El paquete está en camino al destinatario</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.statusOption, { backgroundColor: '#5cb85c20' }]}
                onPress={() => handleStatusUpdate('Entregado')}
              >
                <View style={[styles.statusOptionIcon, { backgroundColor: '#5cb85c' }]}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                </View>
                <View style={styles.statusOptionContent}>
                  <Text style={[styles.statusOptionText, { color: '#5cb85c' }]}>Entregado</Text>
                  <Text style={styles.statusOptionDescription}>El paquete ha sido entregado con éxito</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Menu Modal */}
        {menuVisible && (
          <View style={styles.menuOverlay}>
            <TouchableOpacity 
              style={styles.menuCloseArea}
              onPress={() => setMenuVisible(false)}
            />
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={navigateToProfile}
              >
                <Ionicons name="person-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Mi Perfil</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={navigateToRoute}
              >
                <Ionicons name="map-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Mis Rutas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert('Notificaciones', 'Aquí podrás gestionar tus notificaciones');
                }}
              >
                <Ionicons name="notifications-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Notificaciones</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert('Ayuda', 'Contacte a soporte técnico: soporte@example.com');
                }}
              >
                <Ionicons name="help-circle-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Ayuda</Text>
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutMenuItem]}
                onPress={() => {
                  setMenuVisible(false);
                  handleLogout();
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="#d9534f" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsCardActive: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#333',
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  routeButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  routeButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  routeButtonArrow: {
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  packagesList: {
    padding: 15,
    paddingBottom: 30,
  },
  packageItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  packageIdContainer: {
    flex: 1,
  },
  packageId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateIcon: {
    marginRight: 4,
  },
  packageDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  packageDetails: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailIcon: {
    width: 24,
    marginRight: 8,
  },
  recipientText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  actionText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  packageSummary: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalPackageId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalPackageDestination: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  modalPackageAddress: {
    fontSize: 14,
    color: '#777',
  },
  statusOptionDivider: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  statusOptionDividerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusOptionContent: {
    flex: 1,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    minHeight: 300,
  },
  emptyImage: {
    width: 96,
    height: 96,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuCloseArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 270,
    backgroundColor: 'white',
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  logoutMenuItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#d9534f',
  },
});

export default DriverHome;