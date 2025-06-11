import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  ScrollView,
  Animated,
  RefreshControl,
  Image,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './PackageTracking.styles';
import { packageService } from '../../../services/packageService';
import { ROUTES } from '../../../navigation/routes';

// Interface defining the structure of package data from backend
interface Package {
  paquete_id: number;
  paquete_peso: string;
  paquete_dimensiones: string;
  paquete_estado: string;
  paquete_destinatario: string;
  paquete_fecha: string;
  usuario_correo: string;
  ruta_id: number;
}

// Main component for viewing and tracking packages with filtering and sorting
const PackageTracking = ({ route, navigation }) => {
  // State management for package data, filtering, and UI
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // References for animation and navigation parameters
  const specificPackageId = route.params?.packageId;
  const searchInputRef = useRef<TextInput>(null);
  const animatedHeaderHeight = useRef(new Animated.Value(120)).current;
  
  // Initialize data and fetch packages from API on component mount
  useEffect(() => {
    loadPackages();
  }, [specificPackageId]);
  
  // Fetch packages from API and update state with sorted results
  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (!userInfoString) {
        setError('No se encontró información del usuario. Por favor inicie sesión nuevamente.');
        setLoading(false);
        return;
      }
      
      const userInfo = JSON.parse(userInfoString);
      const userEmail = userInfo.email;
      
      if (!userEmail) {
        setError('No se encontró el correo del usuario. Por favor inicie sesión nuevamente.');
        setLoading(false);
        return;
      }
      
      const packagesData = await packageService.getUserPackages(userEmail);
      
      const sortedPackages = sortPackages(packagesData, sortOrder);
      
      setPackages(sortedPackages);
      
      if (specificPackageId) {
        setSearchQuery(specificPackageId.toString());
        const filtered = sortedPackages.filter(pkg => 
          pkg.paquete_id.toString().includes(specificPackageId.toString())
        );
        setFilteredPackages(filtered);
      } else if (selectedFilter !== 'all') {
        const filtered = sortedPackages.filter(pkg => pkg.paquete_estado === selectedFilter);
        setFilteredPackages(filtered);
      } else {
        setFilteredPackages(sortedPackages);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
      setError("No se pudieron cargar los paquetes. Intente nuevamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh functionality to reload data
  const onRefresh = () => {
    setRefreshing(true);
    loadPackages();
  };
  
  // Filter packages based on search query text
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text) {
      const filtered = packages.filter(pkg => 
        pkg.paquete_id.toString().includes(text) || 
        pkg.paquete_destinatario.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPackages(filtered);
    } else {
      if (selectedFilter !== 'all') {
        const filtered = packages.filter(pkg => pkg.paquete_estado === selectedFilter);
        setFilteredPackages(filtered);
      } else {
        setFilteredPackages(packages);
      }
    }
  };
  
  // Apply status-based filter to packages list
  const filterByStatus = (status: string) => {
    setSelectedFilter(status);
    
    if (searchQuery) {
      setSearchQuery('');
    }
    
    if (status === 'all') {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(pkg => pkg.paquete_estado === status);
      setFilteredPackages(filtered);
    }
  };
  
  // Sort packages by date in ascending or descending order
  const sortPackages = (packagesToSort, order) => {
    return [...packagesToSort].sort((a, b) => {
      const dateA = new Date(a.paquete_fecha).getTime();
      const dateB = new Date(b.paquete_fecha).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };
  
  // Update sort order and apply to package list
  const toggleSortOrder = (order: string) => {
    setSortOrder(order);
    setShowSortOptions(false);
    
    const sorted = sortPackages(packages, order);
    setPackages(sorted);
    
    if (selectedFilter !== 'all') {
      const filtered = sorted.filter(pkg => pkg.paquete_estado === selectedFilter);
      setFilteredPackages(filtered);
    } else {
      setFilteredPackages(sorted);
    }
  };
  
  // Determine color for package status indicators
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Por enviar': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  // Get background color for package cards based on status
  const getStatusBackground = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#fff8e1';
      case 'Entregado': return '#f1f8f1';
      case 'Por enviar': return '#fff6f6';
      default: return '#f0f7ff';
    }
  };
  
  // Render appropriate icon for each package status
  const renderStatusIcon = (status: string) => {
    switch(status) {
      case 'En tránsito':
        return <Ionicons name="time-outline" size={24} color="#f0ad4e" />;
      case 'Entregado':
        return <Ionicons name="checkmark-circle-outline" size={24} color="#5cb85c" />;
      case 'Por enviar':
        return <Ionicons name="hourglass-outline" size={24} color="#d9534f" />;
      default:
        return <Ionicons name="help-circle-outline" size={24} color="#0275d8" />;
    }
  };
  
  // Format date strings using Chile's timezone
  const formatChileanDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        timeZone: 'America/Santiago',
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit'
      };
      return date.toLocaleDateString('es-CL', options);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
  };
  
  // Convert date to relative format (Today, Yesterday) or formatted date
  const getDateLabel = (dateString) => {
    const now = new Date();
    
    const packageDate = new Date(dateString);
    
    const chileOptions = { timeZone: 'America/Santiago' };
    
    const todayInChile = new Date(now.toLocaleDateString('en-US', chileOptions));
    
    const packageDateInChile = new Date(packageDate.toLocaleDateString('en-US', chileOptions));
    
    const yesterdayInChile = new Date(todayInChile);
    yesterdayInChile.setDate(yesterdayInChile.getDate() - 1);
    
    if (packageDateInChile.getTime() === todayInChile.getTime()) {
      return 'Hoy';
    } else if (packageDateInChile.getTime() === yesterdayInChile.getTime()) {
      return 'Ayer';
    } else {
      return formatChileanDate(dateString);
    }
  };
  
  // Format date for display in package details
  const formatDate = (dateString: string) => {
    return formatChileanDate(dateString);
  };
  
  // Handle scroll events for collapsing header animation
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: animatedHeaderHeight } } }],
    { useNativeDriver: false }
  );
  
  // Render individual package item with conditional date header
  const renderPackageItem = ({ item, index }: { item: Package, index: number }) => {
    const showDateHeader = index === 0 || 
      item.paquete_fecha !== filteredPackages[index - 1].paquete_fecha;
    
    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>{getDateLabel(item.paquete_fecha)}</Text>
          </View>
        )}
        <TouchableOpacity 
          style={[
            styles.packageItem, 
            { backgroundColor: getStatusBackground(item.paquete_estado) }
          ]}
          onPress={() => navigation.navigate(ROUTES.CLIENT.PACKAGE_DETAIL, { package: item })}
          activeOpacity={0.8}
        >
          <View style={styles.packageHeader}>
            <View style={styles.packageId}>
              <Text style={styles.idText}>#{item.paquete_id}</Text>
            </View>
            <View style={[
              styles.statusContainer, 
              { backgroundColor: getStatusColor(item.paquete_estado) + '22' }
            ]}>
              {renderStatusIcon(item.paquete_estado)}
              <Text style={[styles.statusText, { color: getStatusColor(item.paquete_estado) }]}>
                {item.paquete_estado}
              </Text>
            </View>
          </View>
          
          <View style={styles.packageDetails}>
            <View style={styles.recipientRow}>
              <Ionicons name="person-outline" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.recipientText}>{item.paquete_destinatario}</Text>
            </View>
            
            <View style={styles.dimensionsRow}>
              <Ionicons name="cube-outline" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.dimensionsText}>
                {item.paquete_dimensiones} - {item.paquete_peso} kg
              </Text>
            </View>
            
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.dateText}>Creado: {formatDate(item.paquete_fecha)}</Text>
            </View>
          </View>
          
          <View style={styles.packageFooter}>
            <Text style={styles.packageFooterText}>Toque para ver detalles</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </View>
        </TouchableOpacity>
      </>
    );
  };
  
  // Animation interpolation values for collapsing header effect
  const headerHeight = animatedHeaderHeight.interpolate({
    inputRange: [0, 60],
    outputRange: [120, 60],
    extrapolate: 'clamp'
  });
  
  const headerTitleOpacity = animatedHeaderHeight.interpolate({
    inputRange: [40, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const headerSubtitleOpacity = animatedHeaderHeight.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Animated header */}
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <View style={styles.headerContent}>
            <Animated.Text 
              style={[
                styles.headerTitle, 
                { opacity: headerSubtitleOpacity }
              ]}
            >
              Seguimiento de Paquetes
            </Animated.Text>
            
            <Animated.Text 
              style={[
                styles.headerSubtitle, 
                { opacity: headerSubtitleOpacity }
              ]}
            >
              Visualiza y gestiona tus envíos
            </Animated.Text>
            
            <Animated.Text 
              style={[
                styles.collapsedHeaderTitle, 
                { opacity: headerTitleOpacity }
              ]}
            >
              Paquetes
            </Animated.Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => setShowSortOptions(!showSortOptions)}
            >
              <Ionicons name="funnel-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Sort options popup */}
        {showSortOptions && (
          <View style={styles.sortOptionsContainer}>
            <TouchableOpacity 
              style={[
                styles.sortOption, 
                sortOrder === 'newest' && styles.selectedSortOption
              ]}
              onPress={() => toggleSortOrder('newest')}
            >
              <Text style={[
                styles.sortOptionText,
                sortOrder === 'newest' && styles.selectedSortOptionText
              ]}>
                Más recientes primero
              </Text>
              {sortOrder === 'newest' && (
                <Ionicons name="checkmark" size={18} color="#007AFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sortOption, 
                sortOrder === 'oldest' && styles.selectedSortOption
              ]}
              onPress={() => toggleSortOrder('oldest')}
            >
              <Text style={[
                styles.sortOptionText,
                sortOrder === 'oldest' && styles.selectedSortOptionText
              ]}>
                Más antiguos primero
              </Text>
              {sortOrder === 'oldest' && (
                <Ionicons name="checkmark" size={18} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Buscar por ID o destinatario"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        {/* Filter tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
              onPress={() => filterByStatus('all')}
            >
              <Ionicons 
                name="apps-outline" 
                size={16} 
                color={selectedFilter === 'all' ? "#fff" : "#666"}
                style={styles.filterIcon}
              />
              <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'Por enviar' && styles.filterButtonActive]}
              onPress={() => filterByStatus('Por enviar')}
            >
              <Ionicons 
                name="hourglass-outline" 
                size={16} 
                color={selectedFilter === 'Por enviar' ? "#fff" : "#666"}
                style={styles.filterIcon}
              />
              <Text style={[styles.filterText, selectedFilter === 'Por enviar' && styles.filterTextActive]}>
                Por enviar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'En tránsito' && styles.filterButtonActive]}
              onPress={() => filterByStatus('En tránsito')}
            >
              <Ionicons 
                name="time-outline" 
                size={16} 
                color={selectedFilter === 'En tránsito' ? "#fff" : "#666"}
                style={styles.filterIcon}
              />
              <Text style={[styles.filterText, selectedFilter === 'En tránsito' && styles.filterTextActive]}>
                En tránsito
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, selectedFilter === 'Entregado' && styles.filterButtonActive]}
              onPress={() => filterByStatus('Entregado')}
            >
              <Ionicons 
                name="checkmark-circle-outline" 
                size={16} 
                color={selectedFilter === 'Entregado' ? "#fff" : "#666"}
                style={styles.filterIcon}
              />
              <Text style={[styles.filterText, selectedFilter === 'Entregado' && styles.filterTextActive]}>
                Entregados
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Results count */}
        {!loading && !error && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {filteredPackages.length === 0 ? (
                "No hay paquetes que coincidan con tu búsqueda"
              ) : filteredPackages.length === 1 ? (
                "1 paquete encontrado"
              ) : (
                `${filteredPackages.length} paquetes encontrados`
              )}
            </Text>
          </View>
        )}
        
        {/* Main content - packages list or empty/loading states */}
        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loaderText}>Cargando paquetes...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#d9534f" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadPackages}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : filteredPackages.length > 0 ? (
          <FlatList
            data={filteredPackages}
            renderItem={renderPackageItem}
            keyExtractor={item => item.paquete_id.toString()}
            contentContainerStyle={styles.listContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={["#007AFF"]}
                tintColor="#007AFF"
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/color/144/000000/box-important--v1.png' }} 
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No hay paquetes</Text>
            {searchQuery ? (
              <Text style={styles.emptyText}>
                Prueba a cambiar tu búsqueda o filtros
              </Text>
            ) : (
              <Text style={styles.emptyText}>
                Aún no tienes paquetes registrados
              </Text>
            )}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => navigation.navigate(ROUTES.CLIENT.PACKAGE_TRACKING, {
                screen: ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM
              })}
            >
              <Ionicons name="add-circle-outline" size={18} color="#fff" style={styles.registerButtonIcon} />
              <Text style={styles.registerButtonText}>Registrar nuevo paquete</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Floating action button for adding new packages */}
        {filteredPackages.length > 0 && !searchQuery && (
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => navigation.navigate(ROUTES.CLIENT.PACKAGE_TRACKING, {
              screen: ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM
            })}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default PackageTracking;