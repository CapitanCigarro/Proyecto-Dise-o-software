import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
  Animated,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/AuthContext';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './DriverHome.styles';

// Data structure for package delivery information
interface Package {
  id: string;
  status: string;
  recipient: string;
  address: string;
  date: string;
  description?: string;
}

// Props definition for the Driver Home screen
interface DriverHomeProps {
  navigation: any;
}

// Main dashboard component for delivery drivers
const DriverHome: React.FC<DriverHomeProps> = ({ navigation }) => {
  // State management for delivery data and UI
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { logout } = useAuth();
  
  // Screen dimensions for responsive layout
  const { width } = Dimensions.get('window');

  // Statistics for driver dashboard
  const [stats, setStats] = useState({
    pending: 0,
    inTransit: 0,
    delivered: 0,
    total: 0
  });

  // Route statistics for current delivery route
  const [routeStats, setRouteStats] = useState({
    totalDistance: 8.0,
    totalTime: 47,
    estimatedCompletion: '11:30 AM',
    destinations: 3
  });

  // Load packages on component mount
  useEffect(() => {
    loadPackages();
  }, []);
  
  // Apply filter when packages or filter status changes
  useEffect(() => {
    filterPackages();
  }, [packages, filterStatus]);
  
  // Filter packages based on status filter
  const filterPackages = () => {
    let filtered = [...packages];
    
    // Apply status filter if not showing all
    if (filterStatus !== 'all') {
      filtered = filtered.filter(pkg => pkg.status === filterStatus);
    }
    
    setFilteredPackages(filtered);
  };

  // Load mock package data for demonstration
  const loadPackages = async () => {
    setLoading(true);
    try {
      // Always use initial mock data on app start instead of loading from storage
      const mockData = [
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
          status: 'Pendiente',
          recipient: 'Laura Torres', 
          address: 'Calle Norte 567', 
          date: '2023-05-21',
          description: 'Electrónica'
        },
      ];
      
      // Save mock data to AsyncStorage
      await AsyncStorage.setItem('packages', JSON.stringify(mockData));
      
      // Update state with initial data
      setPackages(mockData);
      setFilteredPackages(mockData);
      
      // Calculate stats
      const pending = mockData.filter(p => p.status === 'Pendiente').length;
      const inTransit = mockData.filter(p => p.status === 'En tránsito').length;
      const delivered = mockData.filter(p => p.status === 'Entregado').length;
      
      setStats({
        pending,
        inTransit,
        delivered,
        total: mockData.length
      });
      
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('Error', 'No se pudieron cargar los paquetes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh functionality
  const onRefresh = () => {
    setRefreshing(true);
    loadPackages();
  };
  
  // Update package status and recalculate statistics
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
  
  // Notify client about package status changes
  const handleClientNotification = (packageId: string, status: string) => {
    // In a real app, this would send a push notification to the client
    // Just show a toast or small notification that doesn't need confirmation
    Alert.alert(
      'Notificación Enviada',
      `Se ha notificado al cliente sobre la actualización del paquete #${packageId}`
    );
  };
  
  // Show modal for updating package status
  const openStatusModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setStatusModalVisible(true);
  };
  
  // Get color based on package status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Pendiente': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  // Get icon name based on package status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'En tránsito': return 'car-outline';
      case 'Entregado': return 'checkmark-circle-outline';
      case 'Pendiente': return 'hourglass-outline';
      default: return 'help-circle-outline';
    }
  };
  
  // Handle user logout with confirmation
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
  
  // Apply filter to show packages of specific status
  const applyStatusFilter = (status: string) => {
    setFilterStatus(status);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Render a package item in the list
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
  
  // Empty state component when no packages match current filter
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
        Todos tus paquetes asignados aparecerán aquí
      </Text>
    </View>
  );

  // Navigate to route visualization screen
  const navigateToRoute = () => {
    navigation.navigate('RouteVisualization');
  };

  // Calculate percentage of delivered packages
  const calculateCompletionPercentage = () => {
    const delivered = packages.filter(pkg => pkg.status === 'Entregado').length;
    return packages.length > 0 ? Math.round((delivered / packages.length) * 100) : 0;
  };

  // Mark a package as delivered and update stats
  const handleMarkAsDelivered = async (pkg: Package) => {
    try {
      setLoading(true);
      
      // Update package status to Entregado
      const updatedPackages = packages.map(p => {
        if (p.id === pkg.id) {
          return { ...p, status: 'Entregado' };
        }
        return p;
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
      
      // Show a single combined success message instead of two separate ones
      Alert.alert(
        'Entrega Completada', 
        `El paquete #${pkg.id} ha sido marcado como entregado.\n\nSe ha notificado al cliente sobre la entrega.`
      );
      
    } catch (error) {
      console.error('Error updating package status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del paquete');
    } finally {
      setLoading(false);
    }
  };

  // Start delivery process and navigate to route screen
  const handleStartDelivery = (pkg) => {
    // Use the existing handleStatusUpdate function for status change
    setSelectedPackage(pkg);
    
    // First update status to "En tránsito"
    const updatedPackages = packages.map(p => {
      if (p.id === pkg.id) {
        return { ...p, status: 'En tránsito' };
      }
      return p;
    });
    
    // Update local state
    setPackages(updatedPackages);
    
    // Save to AsyncStorage
    AsyncStorage.setItem('packages', JSON.stringify(updatedPackages)).then(() => {
      // Navigate to RouteVisualization
      navigation.navigate('RouteVisualization', { packageId: pkg.id });
    }).catch(error => {
      console.error('Error updating package status:', error);
      Alert.alert('Error', 'No se pudo iniciar la entrega');
    });
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header with driver title and subtitle */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Panel de Conductor</Text>
            <Text style={styles.subtitle}>Gestiona tus entregas</Text>
          </View>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Route summary card with progress and stats */}
          <View style={styles.routeSummaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summaryTitle}>Resumen de Ruta</Text>
                <Text style={styles.summarySubtitle}>
                  {routeStats.destinations} paradas · {routeStats.totalDistance} km
                </Text>
              </View>
              <View style={styles.summaryStatus}>
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${calculateCompletionPercentage()}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{calculateCompletionPercentage()}% completado</Text>
              </View>
            </View>
            
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <View style={styles.summaryItemText}>
                  <Text style={styles.summaryItemLabel}>Tiempo total</Text>
                  <Text style={styles.summaryItemValue}>{routeStats.totalTime} min</Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="flag-outline" size={20} color="#007AFF" />
                <View style={styles.summaryItemText}>
                  <Text style={styles.summaryItemLabel}>Final estimado</Text>
                  <Text style={styles.summaryItemValue}>{routeStats.estimatedCompletion}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Package status statistics cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statsCard}>
              <View style={[styles.statsIconContainer, { backgroundColor: '#d9534f20' }]}>
                <Ionicons name="hourglass-outline" size={20} color="#d9534f" />
              </View>
              <Text style={styles.statsNumber}>{stats.pending}</Text>
              <Text style={styles.statsLabel}>Pendientes</Text>
            </View>
            
            <View style={styles.statsCard}>
              <View style={[styles.statsIconContainer, { backgroundColor: '#f0ad4e20' }]}>
                <Ionicons name="car-outline" size={20} color="#f0ad4e" />
              </View>
              <Text style={styles.statsNumber}>{stats.inTransit}</Text>
              <Text style={styles.statsLabel}>En tránsito</Text>
            </View>
            
            <View style={styles.statsCard}>
              <View style={[styles.statsIconContainer, { backgroundColor: '#5cb85c20' }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#5cb85c" />
              </View>
              <Text style={styles.statsNumber}>{stats.delivered}</Text>
              <Text style={styles.statsLabel}>Entregados</Text>
            </View>
          </View>
          
          {/* Next delivery section */}
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Próximo destino</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={navigateToRoute}
              >
                <Text style={styles.viewAllButtonText}>Ver todas</Text>
                <Ionicons name="chevron-forward" size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loaderText}>Cargando información...</Text>
              </View>
            ) : (
              <>
                {/* Next Delivery Card */}
                {packages.filter(pkg => pkg.status !== 'Entregado').length > 0 ? (
                  <View style={styles.nextDeliveryContainer}>
                    {(() => {
                      // First look for packages in transit, then pending if none are in transit
                      const inTransitPackages = packages.filter(pkg => pkg.status === 'En tránsito');
                      const nextPackage = inTransitPackages.length > 0 
                        ? inTransitPackages[0] 
                        : packages.filter(pkg => pkg.status !== 'Entregado')[0];
                      
                      if (!nextPackage) return null;
                      
                      return (
                        <View style={styles.nextDeliveryCard}>
                          <View style={styles.nextDeliveryContent}>
                            <View style={styles.nextDeliveryTitleRow}>
                              <Text style={styles.nextDeliveryTitle}>Paquete #{nextPackage.id}</Text>
                              <View style={[
                                styles.statusBadge, 
                                { 
                                  backgroundColor: getStatusColor(nextPackage.status) + '22', 
                                  borderColor: getStatusColor(nextPackage.status) 
                                }
                              ]}>
                                <Ionicons 
                                  name={getStatusIcon(nextPackage.status)} 
                                  size={14} 
                                  color={getStatusColor(nextPackage.status)} 
                                  style={{marginRight: 4}} 
                                />
                                <Text 
                                  style={[styles.statusText, { color: getStatusColor(nextPackage.status) }]}
                                >
                                  {nextPackage.status}
                                </Text>
                              </View>
                            </View>
                            
                            <View style={styles.detailRow}>
                              <Ionicons name="person-outline" size={18} color="#666" style={styles.detailIcon} />
                              <Text style={styles.recipientText}>{nextPackage.recipient}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                              <Ionicons name="location-outline" size={18} color="#666" style={styles.detailIcon} />
                              <Text style={styles.addressText}>{nextPackage.address}</Text>
                            </View>
                            
                            {nextPackage.description && (
                              <View style={styles.detailRow}>
                                <Ionicons name="information-circle-outline" size={18} color="#666" style={styles.detailIcon} />
                                <Text style={styles.descriptionText}>{nextPackage.description}</Text>
                              </View>
                            )}
                          </View>
                          
                          <View style={styles.nextDeliveryActions}>
                            {nextPackage.status === 'En tránsito' && (
                              <TouchableOpacity 
                                style={styles.secondaryButton}
                                onPress={() => handleMarkAsDelivered(nextPackage)}
                              >
                                <Ionicons name="checkmark-circle-outline" size={20} color="#007AFF" />
                                <Text style={styles.secondaryButtonText}>Marcar Entregado</Text>
                              </TouchableOpacity>
                            )}
                            
                            {nextPackage.status === 'Pendiente' && (
                              <TouchableOpacity 
                                style={styles.primaryButton}
                                onPress={() => handleStartDelivery(nextPackage)}
                              >
                                <Ionicons name="navigate" size={20} color="#FFF" />
                                <Text style={styles.primaryButtonText}>Comenzar Entrega</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    })()}
                  </View>
                ) : (
                  <View style={styles.timelineEmptyState}>
                    <Ionicons name="checkmark-circle" size={50} color="#5cb85c" />
                    <Text style={styles.timelineEmptyText}>¡No hay entregas pendientes!</Text>
                    <Text style={styles.timelineEmptySubtext}>Has completado todas las entregas programadas.</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
        
        {/* Modal for updating package status */}
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
      </View>
    </SafeAreaWrapper>
  );
};

export default DriverHome;