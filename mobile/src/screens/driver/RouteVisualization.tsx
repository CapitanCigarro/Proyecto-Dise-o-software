import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  Linking,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Enhanced mock data for routes
const MOCK_ROUTES = {
  origin: { 
    name: 'Centro de Distribución',
    address: 'Avenida Industrial 1050',
    coordinates: { latitude: 19.4326, longitude: -99.1332 }
  },
  destinations: [
    { 
      id: '1234', 
      name: 'Calle Principal 123', 
      coordinates: { latitude: 19.4288, longitude: -99.1379 },
      distance: 2.5, 
      time: 15,
      estimatedArrival: '10:15 AM',
      instructions: 'Entregar en recepción. Edificio de apartamentos azul.'
    },
    { 
      id: '5678', 
      name: 'Avenida Central 456', 
      coordinates: { latitude: 19.4231, longitude: -99.1387 },
      distance: 3.8, 
      time: 22,
      estimatedArrival: '10:45 AM',
      instructions: 'Casa con puerta roja. Si no hay nadie, dejar con el vecino.'
    },
    { 
      id: '9012', 
      name: 'Plaza Mayor 789', 
      coordinates: { latitude: 19.4356, longitude: -99.1414 },
      distance: 1.7, 
      time: 10,
      estimatedArrival: '11:15 AM',
      instructions: 'Local comercial. Preguntar por María en la entrada.'
    },
  ],
  routeStats: {
    totalDistance: 8.0,
    totalTime: 47,
    estimatedCompletion: '11:30 AM'
  }
};

interface RouteVisualizationProps {
  route: any;
  navigation: any;
}

const RouteVisualization: React.FC<RouteVisualizationProps> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(MOCK_ROUTES);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'map'
  const [currentRoute, setCurrentRoute] = useState<number | null>(null);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const detailsTranslateY = useRef(new Animated.Value(height)).current;

  // Get the package ID from navigation params (if provided)
  const packageId = route.params?.packageId;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reset to initial mock data instead of loading from storage
        const initialPackagesData = [
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
          }
        ];
        
        // Save to AsyncStorage for this session
        await AsyncStorage.setItem('packages', JSON.stringify(initialPackagesData));
        setPackages(initialPackagesData);
        
        // If packageId is provided, select that destination
        if (packageId) {
          const destination = MOCK_ROUTES.destinations.find(dest => dest.id === packageId);
          if (destination) {
            setSelectedDestination(destination);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [packageId]);

  const getPackageDetails = (id: string) => {
    return packages.find(pkg => pkg.id === id) || { recipient: 'Desconocido', status: 'Desconocido' };
  };

  const selectDestination = (destination: any) => {
    // Make this a no-op or just use it for viewing details in the map
    // We're no longer toggling selection in the list view
    if (activeTab === 'map') {
      setSelectedDestination(destination);
    }
  };
  
  const startNavigation = (destination: any) => {
    const { coordinates } = destination;
    const packageDetails = getPackageDetails(destination.id);
    const destinationLabel = encodeURIComponent(destination.name);
    
    // Set this destination as the current route
    const index = routeData.destinations.findIndex(dest => dest.id === destination.id);
    setCurrentRoute(index);
    
    // Switch to map view first
    setActiveTab('map');
    
    // Open in native maps app
    let url = '';
    if (Platform.OS === 'ios') {
      url = `maps://?q=${destinationLabel}&ll=${coordinates.latitude},${coordinates.longitude}`;
    } else {
      url = `google.navigation:q=${coordinates.latitude},${coordinates.longitude}`;
    }
    
    Alert.alert(
      'Iniciar Navegación',
      `¿Deseas iniciar la navegación hacia la dirección del paquete #${destination.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Iniciar', 
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert('Error', 'No se encontró una aplicación de mapas');
              }
            } catch (error) {
              console.error('Error opening navigation:', error);
              Alert.alert('Error', 'No se pudo abrir la navegación');
            }
          }
        }
      ]
    );
  };
  
  const markAsDelivered = async (destinationId: string) => {
    try {
      setLoading(true);
      
      // Update package status
      const newPackages = packages.map(pkg => {
        if (pkg.id === destinationId) {
          return { ...pkg, status: 'Entregado' };
        }
        return pkg;
      });
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('packages', JSON.stringify(newPackages));
      
      // Update state
      setPackages(newPackages);
      
      // Check if we're at the end of the route
      const currentIndex = routeData.destinations.findIndex(dest => dest.id === destinationId);
      const isLastDestination = currentIndex === routeData.destinations.length - 1;
      
      if (isLastDestination) {
        Alert.alert(
          '¡Ruta Completada!',
          'Has completado todas las entregas en esta ruta.',
          [
            { text: 'Ver Resumen', onPress: () => navigation.navigate('DriverHome') },
            { text: 'OK' }
          ]
        );
      } else {
        // Suggest next destination
        Alert.alert(
          'Entrega Completada',
          `¿Deseas continuar a la siguiente parada?`,
          [
            { text: 'Más tarde', style: 'cancel' },
            { 
              text: 'Continuar', 
              onPress: () => {
                const nextDestination = routeData.destinations[currentIndex + 1];
                setSelectedDestination(nextDestination);
                startNavigation(nextDestination);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error marking as delivered:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del paquete');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateCompletionPercentage = () => {
    const delivered = packages.filter(pkg => pkg.status === 'Entregado').length;
    return Math.round((delivered / packages.length) * 100);
  };

  // Details panel animation
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: detailsTranslateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY } = event.nativeEvent;
      
      if (translationY > 150) {
        // If dragged down far enough, close the panel
        Animated.spring(detailsTranslateY, {
          toValue: height,
          useNativeDriver: true,
        }).start(() => {
          setSelectedDestination(null);
        });
      } else {
        // Otherwise snap back
        Animated.spring(detailsTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12
        }).start();
      }
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header with title only */}
        <View style={styles.header}>
          <Text style={styles.title}>Mis Rutas</Text>
        </View>
        
        {/* Tab navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'list' && styles.activeTab]}
            onPress={() => setActiveTab('list')}
          >
            <Ionicons 
              name={activeTab === 'list' ? "list" : "list-outline"} 
              size={20} 
              color={activeTab === 'list' ? "#007AFF" : "#666"} 
            />
            <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
              Destinos Asignados
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'map' && styles.activeTab]}
            onPress={() => setActiveTab('map')}
          >
            <Ionicons 
              name={activeTab === 'map' ? "map" : "map-outline"} 
              size={20} 
              color={activeTab === 'map' ? "#007AFF" : "#666"} 
            />
            <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
              Mapa
            </Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loaderText}>Cargando datos de la ruta...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'list' ? (
              /* Routes List View */
              <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                {/* Sort destinations by status: 'En tránsito' first, then 'Pendiente', then 'Entregado' */}
                {routeData.destinations
                  .slice()
                  .sort((a, b) => {
                    const statusA = getPackageDetails(a.id).status;
                    const statusB = getPackageDetails(b.id).status;
                    
                    // First priority: In transit packages
                    if (statusA === 'En tránsito' && statusB !== 'En tránsito') return -1;
                    if (statusB === 'En tránsito' && statusA !== 'En tránsito') return 1;
                    
                    // Second priority: Pending packages
                    if (statusA === 'Pendiente' && statusB === 'Entregado') return -1;
                    if (statusB === 'Pendiente' && statusA === 'Entregado') return 1;
                    
                    // If same status, maintain original order
                    return 0;
                  })
                  .map((dest, index) => {
                    const package_details = getPackageDetails(dest.id);
                    const isSelected = selectedDestination?.id === dest.id;
                    
                    // FIXED: Determine step style based on status, not on currentRoute
                    const stepStyle = package_details.status === 'Entregado'
                      ? styles.stepCompleted
                      : package_details.status === 'En tránsito'
                        ? styles.stepCurrent
                        : styles.stepPending;
                    
                    // FIXED: Determine icon based on status
                    const stepIconName = package_details.status === 'Entregado'
                      ? 'checkmark'
                      : package_details.status === 'En tránsito'
                        ? 'navigate'
                        : (index + 1).toString();
                        
                    // Add this line to define statusColor
                    const statusColor = package_details.status === 'Entregado' 
                      ? '#5cb85c' 
                      : package_details.status === 'En tránsito' 
                        ? '#f0ad4e' 
                        : '#d9534f';
                    
                    return (
                      <View 
                        key={index}
                        style={styles.destinationCard}
                      >
                        {/* Step indicator */}
                        <View style={styles.stepIndicatorContainer}>
                          <View style={[styles.stepIndicator, stepStyle]}>
                            {package_details.status === 'Entregado' || package_details.status === 'En tránsito' ? (
                              <Ionicons 
                                name={stepIconName} 
                                size={16} 
                                color="#fff" 
                              />
                            ) : (
                              <Text style={styles.stepNumber}>{index + 1}</Text>
                            )}
                          </View>
                          {index < routeData.destinations.length - 1 && (
                            <View style={[
                              styles.stepConnector,
                              package_details.status === 'Entregado' && styles.stepConnectorCompleted
                            ]} />
                          )}
                        </View>
                        
                        <View style={styles.destinationCardContent}>
                          <View style={styles.destinationHeader}>
                            <View>
                              <Text style={styles.destinationId}>Paquete #{dest.id}</Text>
                              <Text style={styles.destinationAddress}>{dest.name}</Text>
                            </View>
                            <View style={[
                              styles.statusBadge,
                              { backgroundColor: statusColor + '22', borderColor: statusColor }
                            ]}>
                              <Ionicons 
                                name={
                                  package_details.status === 'Entregado' 
                                    ? 'checkmark-circle' 
                                    : package_details.status === 'En tránsito' 
                                      ? 'time' 
                                      : 'hourglass'
                                } 
                                size={14} 
                                color={statusColor} 
                                style={styles.statusIcon}
                              />
                              <Text style={[styles.statusText, { color: statusColor }]}>
                                {package_details.status}
                              </Text>
                            </View>
                          </View>
                          
                          <View style={styles.destinationDetails}>
                            <View style={styles.detailItem}>
                              <Ionicons name="person-outline" size={18} color="#666" style={styles.detailIcon} />
                              <Text style={styles.detailText}>
                                {package_details.recipient}
                              </Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                              <View style={styles.detailItem}>
                                <Ionicons name="trending-up" size={16} color="#666" style={styles.detailIcon} />
                                <Text style={styles.detailText}>
                                  {dest.distance} km
                                </Text>
                              </View>
                              
                              <View style={styles.detailItem}>
                                <Ionicons name="time-outline" size={16} color="#666" style={styles.detailIcon} />
                                <Text style={styles.detailText}>
                                  {dest.time} min
                                </Text>
                              </View>
                              
                              <View style={styles.detailItem}>
                                <Ionicons name="alarm-outline" size={16} color="#666" style={styles.detailIcon} />
                                <Text style={styles.detailText}>
                                  {dest.estimatedArrival}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                
                {/* Add extra space at the bottom for better scrolling */}
                <View style={{ height: 100 }} />
              </ScrollView>
            ) : (
              /* Map View */
              <View style={styles.mapContainer}>
                {/* Map Placeholder - In a real app, this would be a MapView component */}
                <View style={styles.mapContent}>
                  <Image 
                    source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=19.4326,-99.1332&zoom=14&size=600x600&maptype=roadmap&markers=color:red%7Clabel:O%7C19.4326,-99.1332&markers=color:blue%7Clabel:1%7C19.4288,-99.1379&markers=color:blue%7Clabel:2%7C19.4231,-99.1387&markers=color:blue%7Clabel:3%7C19.4356,-99.1414&key=YOUR_API_KEY' }}
                    style={styles.mapImage}
                    resizeMode="cover"
                  />
                  
                  <View style={styles.mapOverlay}>
                    <Text style={styles.mapOverlayText}>
                      Toca para ver el mapa completo
                    </Text>
                  </View>
                </View>
                
                {/* Destination cards in map view */}
                <ScrollView 
                  style={styles.mapDestinationsContainer}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.mapDestinationsContent}
                >
                  {routeData.destinations
                    .slice()
                    .sort((a, b) => {
                      const statusA = getPackageDetails(a.id).status;
                      const statusB = getPackageDetails(b.id).status;
                      
                      // First priority: In transit packages
                      if (statusA === 'En tránsito' && statusB !== 'En tránsito') return -1;
                      if (statusB === 'En tránsito' && statusA !== 'En tránsito') return 1;
                      
                      // Second priority: Pending packages
                      if (statusA === 'Pendiente' && statusB === 'Entregado') return -1;
                      if (statusB === 'Pendiente' && statusA === 'Entregado') return 1;
                      
                      return 0;
                    })
                    .map((dest, index) => {
                      const package_details = getPackageDetails(dest.id);
                      
                      return (
                        <TouchableOpacity 
                          key={index}
                          style={styles.mapDestinationCard}
                          onPress={() => selectDestination(dest)}
                        >
                          <View style={[
                            styles.mapDestinationIndicator,
                            package_details.status === 'Entregado' 
                              ? styles.mapDestinationCompleted
                              : package_details.status === 'En tránsito'
                                ? styles.mapDestinationCurrent
                                : styles.mapDestinationPending
                          ]}>
                            <Text style={styles.mapDestinationNumber}>{index + 1}</Text>
                          </View>
                          
                          <View style={styles.mapDestinationContent}>
                            <Text style={styles.mapDestinationId}>#{dest.id}</Text>
                            <Text style={styles.mapDestinationAddress} numberOfLines={1}>
                              {dest.name}
                            </Text>
                            <View style={styles.mapDestinationDetails}>
                              <Ionicons name="person-outline" size={12} color="#666" />
                              <Text style={styles.mapDestinationPerson} numberOfLines={1}>
                                {package_details.recipient}
                              </Text>
                            </View>
                            
                            <View style={styles.mapDestinationFooter}>
                              <View style={styles.mapDestinationMetric}>
                                <Ionicons name="trending-up" size={12} color="#666" />
                                <Text style={styles.mapDestinationMetricText}>{dest.distance} km</Text>
                              </View>
                              
                              <View style={styles.mapDestinationMetric}>
                                <Ionicons name="time-outline" size={12} color="#666" />
                                <Text style={styles.mapDestinationMetricText}>{dest.time} min</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </View>
            )}
          </>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF20',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
    paddingTop: 5,
  },
  destinationCard: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    paddingRight: 15,
    paddingTop: 20,
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999',
    marginBottom: 5,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepPending: {
    backgroundColor: '#999',
  },
  stepCurrent: {
    backgroundColor: '#f0ad4e',
  },
  stepCompleted: {
    backgroundColor: '#5cb85c',
  },
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
  },
  stepConnectorCompleted: {
    backgroundColor: '#5cb85c',
  },
  destinationCardContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  destinationId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  destinationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  destinationDetails: {
    padding: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 18,
    marginRight: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
  },
  // Map tab styles
  mapContainer: {
    flex: 1,
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  mapDestinationsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    maxHeight: 160,
  },
  mapDestinationsContent: {
    paddingHorizontal: 15,
  },
  mapDestinationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mapDestinationIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  mapDestinationPending: {
    backgroundColor: '#999',
  },
  mapDestinationCurrent: {
    backgroundColor: '#f0ad4e',
  },
  mapDestinationCompleted: {
    backgroundColor: '#5cb85c',
  },
  mapDestinationNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  mapDestinationContent: {
    flex: 1,
  },
  mapDestinationId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  mapDestinationAddress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mapDestinationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  mapDestinationPerson: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  mapDestinationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  mapDestinationMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapDestinationMetricText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
  }
});

export default RouteVisualization;