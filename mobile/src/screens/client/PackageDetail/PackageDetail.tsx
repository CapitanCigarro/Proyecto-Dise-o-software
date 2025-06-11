import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  ScrollView, 
  TouchableOpacity, 
  Image,
  Share,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './PackageDetail.styles';

const { width } = Dimensions.get('window');

// Detailed view screen for displaying package shipping information and status
const PackageDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const packageData = route.params?.package;
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize timeline step based on package status
  useEffect(() => {
    if (packageData) {
      setCurrentStep(getStatusStep(packageData.paquete_estado));
    }
  }, [packageData]);

  // Map package status to appropriate color scheme
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Por enviar': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  // Convert status string to numeric step for progress visualization
  function getStatusStep(status: string) {
    switch(status) {
      case 'Por enviar': return 0;
      case 'En tránsito': return 1;
      case 'Entregado': return 2;
      default: return 0;
    }
  }
  
  // Calculate estimated delivery dates based on current package status
  const getDeliveryInfo = () => {
    if (!packageData) return { estimatedPickup: 'Cargando...', estimatedDelivery: 'Cargando...' };
    
    const today = new Date();
    
    switch(packageData.paquete_estado) {
      case 'Por enviar':
        const pickup = new Date(today);
        pickup.setDate(today.getDate() + 1);
        return {
          estimatedPickup: pickup.toLocaleDateString(),
          estimatedDelivery: 'Próximamente'
        };
      case 'En tránsito':
        const delivery = new Date(today);
        delivery.setDate(today.getDate() + 2);
        return {
          estimatedPickup: 'Recogido',
          estimatedDelivery: delivery.toLocaleDateString()
        };
      case 'Entregado':
        return {
          estimatedPickup: 'Recogido',
          estimatedDelivery: 'Entregado el ' + formatDate(packageData.paquete_fecha)
        };
      default:
        return {
          estimatedPickup: 'Próximamente',
          estimatedDelivery: 'Próximamente'
        };
    }
  };
  
  // Format date strings to Chilean format
  const formatDate = (dateString: string) => {
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
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  const deliveryInfo = getDeliveryInfo();
  
  // Allow users to share package tracking information via device sharing options
  const shareTracking = async () => {
    if (!packageData) return;
    
    try {
      await Share.share({
        message: `Seguimiento de mi paquete #${packageData.paquete_id}. Estado actual: ${packageData.paquete_estado}. Puedes seguirlo en nuestra aplicación.`,
        title: `Seguimiento de Paquete #${packageData.paquete_id}`
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Display loading state while fetching package data
  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando detalles del paquete...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  // Handle case when package data is not available
  if (!packageData) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, styles.errorContainer]}>
          <Ionicons name="alert-circle-outline" size={60} color="#d9534f" />
          <Text style={styles.errorText}>Paquete no encontrado</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header with status */}
        <View style={[styles.header, { backgroundColor: getStatusColor(packageData.paquete_estado) + '22' }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={shareTracking}>
              <Ionicons name="share-social-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.packageHeader}>
            <View style={styles.packageIcon}>
              <Ionicons 
                name={packageData.paquete_estado === 'Entregado' ? "checkmark-circle" : "cube"} 
                size={32} 
                color={getStatusColor(packageData.paquete_estado)} 
              />
            </View>
            <View style={styles.packageInfo}>
              <Text style={styles.packageId}>Paquete #{packageData.paquete_id}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(packageData.paquete_estado) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(packageData.paquete_estado) }]}>
                  {packageData.paquete_estado}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Tracking Progress */}
          <View style={styles.trackingContainer}>
            <Text style={styles.sectionTitle}>Estado del Envío</Text>
            
            <View style={styles.trackingTimeline}>
              <View style={styles.timelineLine} />
              
              <View style={styles.trackingStep}>
                <View style={[
                  styles.stepCircle, 
                  currentStep >= 0 ? styles.stepCompleted : styles.stepPending
                ]}>
                  {currentStep >= 0 && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Paquete Registrado</Text>
                  <Text style={styles.stepDate}>{formatDate(packageData.paquete_fecha)}</Text>
                </View>
              </View>
              
              <View style={styles.trackingStep}>
                <View style={[
                  styles.stepCircle, 
                  currentStep >= 1 ? styles.stepCompleted : styles.stepPending
                ]}>
                  {currentStep >= 1 && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>En Tránsito</Text>
                  <Text style={styles.stepDate}>
                    {currentStep >= 1 ? 'En camino a destino' : 'Esperando envío'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.trackingStep}>
                <View style={[
                  styles.stepCircle, 
                  currentStep >= 2 ? styles.stepCompleted : styles.stepPending
                ]}>
                  {currentStep >= 2 && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Entregado</Text>
                  <Text style={styles.stepDate}>
                    {currentStep >= 2 ? formatDate(packageData.paquete_fecha) : deliveryInfo.estimatedDelivery}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Delivery Info */}
          <View style={styles.deliveryInfoContainer}>
            <View style={styles.deliveryInfoItem}>
              <Ionicons name="calendar-outline" size={22} color="#007AFF" />
              <View style={styles.deliveryInfoText}>
                <Text style={styles.deliveryInfoLabel}>Fecha Estimada</Text>
                <Text style={styles.deliveryInfoValue}>{deliveryInfo.estimatedDelivery}</Text>
              </View>
            </View>
            
            {packageData.paquete_estado !== 'Por enviar' && (
              <View style={styles.deliveryInfoItem}>
                <Ionicons name="person-outline" size={22} color="#007AFF" />
                <View style={styles.deliveryInfoText}>
                  <Text style={styles.deliveryInfoLabel}>Entregado por</Text>
                  <Text style={styles.deliveryInfoValue}>Próximamente</Text>
                </View>
              </View>
            )}
          </View>

          {/* Package Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Paquete</Text>
            <View style={styles.detailCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Fecha de Registro</Text>
                  <Text style={styles.infoValue}>{formatDate(packageData.paquete_fecha)}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tipo</Text>
                  <Text style={styles.infoValue}>Estándar</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Peso</Text>
                  <Text style={styles.infoValue}>{packageData.paquete_peso} kg</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Dimensiones</Text>
                  <Text style={styles.infoValue}>{packageData.paquete_dimensiones || 'No especificado'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Addresses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Direcciones</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressRow}>
                <View style={styles.addressDot}>
                  <Ionicons name="locate" size={16} color="#007AFF" />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressLabel}>Origen</Text>
                  <Text style={styles.addressText}>Próximamente</Text>
                  <Text style={styles.addressSecondary}>{packageData.usuario_correo}</Text>
                </View>
              </View>
              
              <View style={styles.addressDivider} />
              
              <View style={styles.addressRow}>
                <View style={[styles.addressDot, { backgroundColor: '#5cb85c22' }]}>
                  <Ionicons name="flag" size={16} color="#5cb85c" />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressLabel}>Destino</Text>
                  <Text style={styles.addressText}>Próximamente</Text>
                  <Text style={styles.addressSecondary}>{packageData.paquete_destinatario}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.description}>Próximamente se habilitará la descripción del paquete</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default PackageDetail;