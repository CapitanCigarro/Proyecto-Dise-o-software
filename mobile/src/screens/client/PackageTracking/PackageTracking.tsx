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

// Data structure for package information
interface Package {
  id: string;
  sender: string;
  recipient: string;
  address: string;
  status: string;
  date: string;
  description?: string;
}

// Screen component for viewing and tracking packages
const PackageTracking = ({ route, navigation }) => {
  // State management for package data and UI
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // References and parameters for navigation
  const specificPackageId = route.params?.packageId;
  const searchInputRef = useRef<TextInput>(null);
  const animatedHeaderHeight = useRef(new Animated.Value(120)).current;
  
  // Load packages on component mount or when package ID changes
  useEffect(() => {
    loadPackages();
  }, [specificPackageId]);
  
  // Fetch package data from storage or create mock data
  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const packagesJson = await AsyncStorage.getItem('packages');
      let packagesData = [];
      
      if (packagesJson) {
        packagesData = JSON.parse(packagesJson);
      } else {
        // If no data, set mock data for demo
        packagesData = [
          { 
            id: '1234', 
            sender: 'Juan Pérez', 
            recipient: 'María García', 
            address: 'Calle Principal 123', 
            status: 'En tránsito',
            date: '2023-05-20',
            description: 'Caja mediana'
          },
          { 
            id: '5678', 
            sender: 'Juan Pérez', 
            recipient: 'Carlos Rodríguez', 
            address: 'Avenida Central 456', 
            status: 'Entregado',
            date: '2023-05-18',
            description: 'Sobre pequeño'
          },
          { 
            id: '9012', 
            sender: 'Juan Pérez', 
            recipient: 'Ana López', 
            address: 'Plaza Mayor 789', 
            status: 'Pendiente',
            date: '2023-05-23',
            description: 'Paquete frágil'
          },
          { 
            id: '3456', 
            sender: 'Juan Pérez', 
            recipient: 'Luis Torres', 
            address: 'Boulevard Norte 234', 
            status: 'Entregado',
            date: '2023-05-15',
            description: 'Documentos importantes'
          },
          { 
            id: '7890', 
            sender: 'Juan Pérez', 
            recipient: 'Sandra Vega', 
            address: 'Paseo del Río 567', 
            status: 'En tránsito',
            date: '2023-05-21',
            description: 'Paquete electrónico'
          },
        ];
        
        await AsyncStorage.setItem('packages', JSON.stringify(packagesData));
      }
      
      packagesData = sortPackages(packagesData, sortOrder);
      
      setPackages(packagesData);
      
      if (specificPackageId) {
        setSearchQuery(specificPackageId);
        const filtered = packagesData.filter(pkg => 
          pkg.id.includes(specificPackageId)
        );
        setFilteredPackages(filtered);
      } else if (selectedFilter !== 'all') {
        const filtered = packagesData.filter(pkg => pkg.status === selectedFilter);
        setFilteredPackages(filtered);
      } else {
        setFilteredPackages(packagesData);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
      setError("No se pudieron cargar los paquetes. Intente nuevamente.");
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
  
  // Filter packages based on search text
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text) {
      const filtered = packages.filter(pkg => 
        pkg.id.includes(text) || 
        pkg.recipient.toLowerCase().includes(text.toLowerCase()) ||
        pkg.address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPackages(filtered);
    } else {
      if (selectedFilter !== 'all') {
        const filtered = packages.filter(pkg => pkg.status === selectedFilter);
        setFilteredPackages(filtered);
      } else {
        setFilteredPackages(packages);
      }
    }
  };
  
  // Filter packages by delivery status
  const filterByStatus = (status: string) => {
    setSelectedFilter(status);
    
    if (searchQuery) {
      setSearchQuery('');
    }
    
    if (status === 'all') {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(pkg => pkg.status === status);
      setFilteredPackages(filtered);
    }
  };
  
  // Sort packages by date
  const sortPackages = (packagesToSort, order) => {
    return [...packagesToSort].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };
  
  // Change sort order and update package list
  const toggleSortOrder = (order: string) => {
    setSortOrder(order);
    setShowSortOptions(false);
    
    const sorted = sortPackages(packages, order);
    setPackages(sorted);
    
    if (selectedFilter !== 'all') {
      const filtered = sorted.filter(pkg => pkg.status === selectedFilter);
      setFilteredPackages(filtered);
    } else {
      setFilteredPackages(sorted);
    }
  };
  
  // Get appropriate color for package status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Pendiente': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  // Get background color based on package status
  const getStatusBackground = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#fff8e1';
      case 'Entregado': return '#f1f8f1';
      case 'Pendiente': return '#fff6f6';
      default: return '#f0f7ff';
    }
  };
  
  // Render icon based on package status
  const renderStatusIcon = (status: string) => {
    switch(status) {
      case 'En tránsito':
        return <Ionicons name="time-outline" size={24} color="#f0ad4e" />;
      case 'Entregado':
        return <Ionicons name="checkmark-circle-outline" size={24} color="#5cb85c" />;
      case 'Pendiente':
        return <Ionicons name="hourglass-outline" size={24} color="#d9534f" />;
      default:
        return <Ionicons name="help-circle-outline" size={24} color="#0275d8" />;
    }
  };
  
  // Convert date string to readable format (Today, Yesterday, etc.)
  const getDateLabel = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return 'Hoy';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Ayer';
    } else {
      return dateString;
    }
  };
  
  // Format date for display in user's locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };
  
  // Handle scroll events for collapsing header animation
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: animatedHeaderHeight } } }],
    { useNativeDriver: false }
  );
  
  // Render individual package item in the list
  const renderPackageItem = ({ item, index }: { item: Package, index: number }) => {
    const showDateHeader = index === 0 || 
      item.date !== filteredPackages[index - 1].date;
    
    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>{getDateLabel(item.date)} - {formatDate(item.date)}</Text>
          </View>
        )}
        <TouchableOpacity 
          style={[
            styles.packageItem, 
            { backgroundColor: getStatusBackground(item.status) }
          ]}
          onPress={() => navigation.navigate('PackageDetail', { package: item })}
          activeOpacity={0.8}
        >
          <View style={styles.packageHeader}>
            <View style={styles.packageId}>
              <Text style={styles.idText}>#{item.id}</Text>
            </View>
            <View style={[
              styles.statusContainer, 
              { backgroundColor: getStatusColor(item.status) + '22' }
            ]}>
              {renderStatusIcon(item.status)}
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.packageDetails}>
            <View style={styles.recipientRow}>
              <Ionicons name="person-outline" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.recipientText}>{item.recipient}</Text>
            </View>
            
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={18} color="#666" style={styles.detailIcon} />
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
            
            {item.description && (
              <View style={styles.descriptionRow}>
                <Ionicons name="information-circle-outline" size={18} color="#666" style={styles.detailIcon} />
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.packageFooter}>
            <Text style={styles.packageFooterText}>Toque para ver detalles</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </View>
        </TouchableOpacity>
      </>
    );
  };
  
  // Animation values for collapsing header
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
            placeholder="Buscar por ID, destinatario o dirección"
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
              style={[styles.filterButton, selectedFilter === 'Pendiente' && styles.filterButtonActive]}
              onPress={() => filterByStatus('Pendiente')}
            >
              <Ionicons 
                name="hourglass-outline" 
                size={16} 
                color={selectedFilter === 'Pendiente' ? "#fff" : "#666"}
                style={styles.filterIcon}
              />
              <Text style={[styles.filterText, selectedFilter === 'Pendiente' && styles.filterTextActive]}>
                Pendientes
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
            keyExtractor={item => item.id}
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
              onPress={() => navigation.navigate('PackageRegistration')}
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
            onPress={() => navigation.navigate('PackageRegistration')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default PackageTracking;