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
  Image,
  Modal
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [sortBy, setSortBy] = useState('efficient'); // 'efficient', 'distance', 'time'

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
        
        // Load packages to get names and details
        const packagesJson = await AsyncStorage.getItem('packages');
        if (packagesJson) {
          const packagesData = JSON.parse(packagesJson);
          setPackages(packagesData);
          
          // If packageId is provided, select that destination
          if (packageId) {
            const destination = MOCK_ROUTES.destinations.find(dest => dest.id === packageId);
            if (destination) {
              setSelectedDestination(destination);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();

    // Animate details panel up when a destination is selected
    if (selectedDestination) {
      Animated.spring(detailsTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12
      }).start();
    } else {
      Animated.spring(detailsTranslateY, {
        toValue: height,
        useNativeDriver: true
      }).start();
    }
  }, [packageId, selectedDestination]);

  // Handler for optimizing the route
  const optimizeRoute = async () => {
    try {
      setOptimizing(true);
      // Simulate API call to optimize route
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reorder destinations based on selected optimization criteria
      let optimizedDestinations = [...routeData.destinations];
      
      if (sortBy === 'distance') {
        optimizedDestinations.sort((a, b) => a.distance - b.distance);
      } else if (sortBy === 'time') {
        optimizedDestinations.sort((a, b) => a.time - b.time);
      }
      // 'efficient' is already the default order in our mock data
      
      // Update route data with optimized destinations
      setRouteData({
        ...routeData,
        destinations: optimizedDestinations
      });
      
      // Show success message
      Alert.alert(
        'Ruta Optimizada', 
        `La ruta ha sido optimizada por ${
          sortBy === 'distance' ? 'distancia más corta' : 
          sortBy === 'time' ? 'tiempo más rápido' : 
          'eficiencia general'
        }`
      );
    } catch (error) {
      console.error('Error optimizing route:', error);
      Alert.alert('Error', 'No se pudo optimizar la ruta');
    } finally {
      setOptimizing(false);
    }
  };

  const getPackageDetails = (id: string) => {
    return packages.find(pkg => pkg.id === id) || { recipient: 'Desconocido', status: 'Desconocido' };
  };

  const selectDestination = (destination: any) => {
    // If the same destination is selected, deselect it
    if (selectedDestination?.id === destination.id) {
      setSelectedDestination(null);
    } else {
      // Pulse animation when selecting a new destination
      cardScale.setValue(1);
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ]).start();
      
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

  // Header opacity animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

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
        {/* Header with back button and title */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Mis Rutas</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerIcon}
              onPress={() => {
                setShowDetailsModal(true);
              }}
            >
              <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
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
              Lista
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
            {/* Route Summary Card - Animate opacity based on scroll */}
            <Animated.View style={[styles.summaryCard, { opacity: headerOpacity }]}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryTitle}>Resumen de Ruta</Text>
                  <Text style={styles.summarySubtitle}>
                    {routeData.destinations.length} paradas · {routeData.routeStats.totalDistance} km
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
                    <Text style={styles.summaryItemValue}>{routeData.routeStats.totalTime} min</Text>
                  </View>
                </View>
                
                <View style={styles.summaryItem}>
                  <Ionicons name="flag-outline" size={20} color="#007AFF" />
                  <View style={styles.summaryItemText}>
                    <Text style={styles.summaryItemLabel}>Final estimado</Text>
                    <Text style={styles.summaryItemValue}>{routeData.routeStats.estimatedCompletion}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.optimizeContainer}>
                <TouchableOpacity 
                  style={styles.optimizeButton}
                  onPress={optimizeRoute}
                  disabled={optimizing}
                >
                  {optimizing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="git-compare-outline" size={16} color="#fff" />
                      <Text style={styles.optimizeButtonText}>Optimizar Ruta</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                <View style={styles.optimizeOptions}>
                  <TouchableOpacity 
                    style={[
                      styles.optimizeOption,
                      sortBy === 'efficient' && styles.optimizeOptionSelected
                    ]}
                    onPress={() => setSortBy('efficient')}
                  >
                    <Text style={[
                      styles.optimizeOptionText,
                      sortBy === 'efficient' && styles.optimizeOptionTextSelected
                    ]}>
                      Eficiente
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optimizeOption,
                      sortBy === 'distance' && styles.optimizeOptionSelected
                    ]}
                    onPress={() => setSortBy('distance')}
                  >
                    <Text style={[
                      styles.optimizeOptionText,
                      sortBy === 'distance' && styles.optimizeOptionTextSelected
                    ]}>
                      Distancia
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optimizeOption,
                      sortBy === 'time' && styles.optimizeOptionSelected
                    ]}
                    onPress={() => setSortBy('time')}
                  >
                    <Text style={[
                      styles.optimizeOptionText,
                      sortBy === 'time' && styles.optimizeOptionTextSelected
                    ]}>
                      Tiempo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            
            {activeTab === 'list' ? (
              /* Routes List View */
              <Animated.ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
              >
                {/* Origin Card */}
                <View style={styles.originCard}>
                  <View style={styles.originIconContainer}>
                    <Ionicons name="business-outline" size={24} color="#007AFF" />
                  </View>
                  <View style={styles.originInfo}>
                    <Text style={styles.originName}>{routeData.origin.name}</Text>
                    <Text style={styles.originAddress}>{routeData.origin.address}</Text>
                  </View>
                </View>
                
                <Text style={styles.sectionTitle}>
                  Destinos Asignados ({routeData.destinations.length})
                </Text>
                
                {/* Destinations List */}
                {routeData.destinations.map((dest, index) => {
                  const package_details = getPackageDetails(dest.id);
                  const isSelected = selectedDestination?.id === dest.id;
                  const isCurrentRoute = currentRoute === index;
                  
                  // Status color based on package status
                  const statusColor = package_details.status === 'Entregado' 
                    ? '#5cb85c' 
                    : package_details.status === 'En tránsito' 
                      ? '#f0ad4e' 
                      : '#d9534f';
                  
                  // Determine the step indicator style
                  const stepStyle = package_details.status === 'Entregado'
                    ? styles.stepCompleted
                    : isCurrentRoute
                      ? styles.stepCurrent
                      : styles.stepPending;
                  
                  const stepIconName = package_details.status === 'Entregado'
                    ? 'checkmark'
                    : isCurrentRoute
                      ? 'navigate'
                      : (index + 1).toString();
                  
                  return (
                    <Animated.View 
                      key={index}
                      style={[
                        styles.destinationCard,
                        isSelected && { transform: [{ scale: cardScale }] }
                      ]}
                    >
                      {/* Step indicator */}
                      <View style={styles.stepIndicatorContainer}>
                        <View style={[styles.stepIndicator, stepStyle]}>
                          {package_details.status === 'Entregado' || isCurrentRoute ? (
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
                      
                      <TouchableOpacity
                        style={[
                          styles.destinationCardContent,
                          isSelected && styles.selectedDestinationCard
                        ]}
                        onPress={() => selectDestination(dest)}
                        activeOpacity={0.9}
                      >
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
                        
                        {isSelected && (
                          <View style={styles.destinationActions}>
                            <TouchableOpacity
                              style={[styles.actionButton, styles.navigationButton]}
                              onPress={() => startNavigation(dest)}
                            >
                              <Ionicons name="navigate" size={18} color="white" style={styles.actionButtonIcon} />
                              <Text style={styles.actionButtonText}>Navegar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                              style={[
                                styles.actionButton, 
                                styles.deliveredButton,
                                package_details.status === 'Entregado' && styles.disabledButton
                              ]}
                              onPress={() => markAsDelivered(dest.id)}
                              disabled={package_details.status === 'Entregado'}
                            >
                              <Ionicons name="checkmark-circle" size={18} color="white" style={styles.actionButtonIcon} />
                              <Text style={styles.actionButtonText}>
                                {package_details.status === 'Entregado' ? 'Entregado' : 'Marcar Entregado'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        
                        {isSelected ? (
                          <TouchableOpacity 
                            style={styles.collapseButton}
                            onPress={() => setSelectedDestination(null)}
                          >
                            <Ionicons name="chevron-up" size={20} color="#999" />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.cardFooter}>
                            <Text style={styles.tapForMoreText}>Toca para más opciones</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
                
                <View style={styles.endOfRoute}>
                  <Ionicons name="flag" size={24} color="#007AFF" />
                  <Text style={styles.endOfRouteText}>Fin de la ruta</Text>
                </View>
                
                {/* Add extra space at the bottom for better scrolling */}
                <View style={{ height: 100 }} />
              </Animated.ScrollView>
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
                  {routeData.destinations.map((dest, index) => {
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
                            : currentRoute === index
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
        
        {/* Route details modal */}
        <Modal
          visible={showDetailsModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDetailsModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalles de la Ruta</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowDetailsModal(false)}
                >
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Información General</Text>
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="location" size={20} color="#007AFF" style={styles.modalInfoIcon} />
                    <View>
                      <Text style={styles.modalInfoLabel}>Origen</Text>
                      <Text style={styles.modalInfoValue}>{routeData.origin.name}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="flag" size={20} color="#007AFF" style={styles.modalInfoIcon} />
                    <View>
                      <Text style={styles.modalInfoLabel}>Destinos</Text>
                      <Text style={styles.modalInfoValue}>{routeData.destinations.length} paradas</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="speedometer" size={20} color="#007AFF" style={styles.modalInfoIcon} />
                    <View>
                      <Text style={styles.modalInfoLabel}>Distancia Total</Text>
                      <Text style={styles.modalInfoValue}>{routeData.routeStats.totalDistance} km</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="time" size={20} color="#007AFF" style={styles.modalInfoIcon} />
                    <View>
                      <Text style={styles.modalInfoLabel}>Tiempo Total Estimado</Text>
                      <Text style={styles.modalInfoValue}>{routeData.routeStats.totalTime} minutos</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Estado de Entregas</Text>
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#5cb85c" style={styles.modalInfoIcon} />
                    <View>
                      <Text style={styles.modalInfoLabel}>Completadas</Text>
                      <Text style={styles.modalInfoValue}>
                        {packages.filter(pkg => pkg.status === 'Entregado').length} de {packages.length}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalProgressContainer}>
                    <View style={styles.modalProgressBar}>
                      <View 
                        style={[
                          styles.modalProgressFill, 
                          { width: `${calculateCompletionPercentage()}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.modalProgressText}>{calculateCompletionPercentage()}% completado</Text>
                  </View>
                </View>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Instrucciones de Ruta</Text>
                  <View style={styles.modalInstructions}>
                    <Text style={styles.modalInstructionsText}>
                      1. Asegúrate de tener suficiente combustible para completar la ruta.
                    </Text>
                    <Text style={styles.modalInstructionsText}>
                      2. Verifica el estado de los paquetes antes de cada entrega.
                    </Text>
                    <Text style={styles.modalInstructionsText}>
                      3. Marca cada entrega como completada inmediatamente.
                    </Text>
                    <Text style={styles.modalInstructionsText}>
                      4. Si no puedes entregar un paquete, documenta el motivo.
                    </Text>
                  </View>
                </View>
              </ScrollView>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowDetailsModal(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerIcon: {
    padding: 5,
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
  summaryCard: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 5,
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
  optimizeContainer: {
    padding: 15,
  },
  optimizeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  optimizeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  optimizeOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optimizeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  optimizeOptionSelected: {
    backgroundColor: '#007AFF20',
  },
  optimizeOptionText: {
    fontSize: 13,
    color: '#666',
  },
  optimizeOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
    paddingTop: 5,
  },
  originCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  originIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  originInfo: {
    flex: 1,
  },
  originName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  originAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
  selectedDestinationCard: {
    borderColor: '#007AFF',
    borderWidth: 1,
    backgroundColor: '#f8f9ff',
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
  destinationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  navigationButton: {
    backgroundColor: '#007AFF',
  },
  deliveredButton: {
    backgroundColor: '#5cb85c',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  actionButtonIcon: {
    marginRight: 6,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  collapseButton: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
  },
  cardFooter: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  tapForMoreText: {
    fontSize: 12,
    color: '#999',
  },
  endOfRoute: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  endOfRouteText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalBody: {
    maxHeight: height * 0.6,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalInfoIcon: {
    marginRight: 12,
    width: 24,
  },
  modalInfoLabel: {
    fontSize: 13,
    color: '#666',
  },
  modalInfoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  modalProgressContainer: {
    marginTop: 10,
  },
  modalProgressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#5cb85c',
    borderRadius: 3,
  },
  modalProgressText: {
    fontSize: 12,
    color: '#666',
  },
  modalInstructions: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  modalInstructionsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RouteVisualization;