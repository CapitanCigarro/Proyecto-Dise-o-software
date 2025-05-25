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
  Animated,
  Image,
  Dimensions,
  ScrollView
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
  const [filterStatus, setFilterStatus] = useState('all');
  const { logout } = useAuth();
  
  // Screen dimensions
  const { width } = Dimensions.get('window');

  // Statistics for dashboard
  const [stats, setStats] = useState({
    pending: 0,
    inTransit: 0,
    delivered: 0,
    total: 0
  });

  // Route statistics
  const [routeStats, setRouteStats] = useState({
    totalDistance: 8.0,
    totalTime: 47,
    estimatedCompletion: '11:30 AM',
    destinations: 3
  });

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

  // Update the loadPackages function to always use initial data
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
    // Just show a toast or small notification that doesn't need confirmation
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
        Todos tus paquetes asignados aparecerán aquí
      </Text>
    </View>
  );

  // Navigate to Route Visualization screen
  const navigateToRoute = () => {
    navigation.navigate('RouteVisualization');
  };

  // Calculate completion percentage for the route
  const calculateCompletionPercentage = () => {
    const delivered = packages.filter(pkg => pkg.status === 'Entregado').length;
    return packages.length > 0 ? Math.round((delivered / packages.length) * 100) : 0;
  };

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
        {/* Header without Route Button */}
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
          {/* Route Summary Card */}
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
          
          {/* Stats Cards */}
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
          
          {/* Next Delivery */}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 3,
    color: '#333',
  },
  statsLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  routeSummaryCard: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summarySubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  summaryStatus: {
    alignItems: 'flex-end',
  },
  progressContainer: {
    width: 100,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5cb85c',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  summaryDetails: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItemText: {
    marginLeft: 10,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryItemValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 20,
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
  timelineEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timelineEmptyText: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  timelineEmptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
  nextDeliveryContainer: {
    marginBottom: 20,
  },
  nextDeliveryContent: {
    padding: 15,
  },
  nextDeliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  nextDeliveryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextDeliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 20,  
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20, 
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default DriverHome;