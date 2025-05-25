import React, { useState } from 'react';
import { 
  View, 
  Text,
  ScrollView, 
  TouchableOpacity, 
  Image,
  Share,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PackageDetailScreenRouteProp, PackageDetailScreenNavigationProp } from '../../../navigation/types';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './PackageDetail.styles';

const { width } = Dimensions.get('window');

// Component to display detailed information about a package shipment
const PackageDetail = () => {
  const navigation = useNavigation<PackageDetailScreenNavigationProp>();
  const route = useRoute<PackageDetailScreenRouteProp>();
  const { package: packageData } = route.params;
  
  // Track the current step in delivery process
  const [currentStep, setCurrentStep] = useState(getStatusStep(packageData.status));

  // Determine color based on package delivery status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Pendiente': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  // Convert status string to numeric step for timeline display
  function getStatusStep(status: string) {
    switch(status) {
      case 'Pendiente': return 0;
      case 'En tránsito': return 1;
      case 'Entregado': return 2;
      default: return 0;
    }
  }
  
  // Calculate delivery dates based on current status
  const getDeliveryInfo = () => {
    const today = new Date();
    
    switch(packageData.status) {
      case 'Pendiente':
        const pickup = new Date(today);
        pickup.setDate(today.getDate() + 1);
        return {
          estimatedPickup: pickup.toLocaleDateString(),
          estimatedDelivery: 'Pendiente de recolección'
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
          estimatedDelivery: 'Entregado el ' + packageData.date
        };
      default:
        return {
          estimatedPickup: 'Pendiente',
          estimatedDelivery: 'Pendiente'
        };
    }
  };
  
  const deliveryInfo = getDeliveryInfo();
  
  // Share package tracking information with others
  const shareTracking = async () => {
    try {
      await Share.share({
        message: `Seguimiento de mi paquete #${packageData.id}. Estado actual: ${packageData.status}. Puedes seguirlo en nuestra aplicación.`,
        title: `Seguimiento de Paquete #${packageData.id}`
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header with status */}
        <View style={[styles.header, { backgroundColor: getStatusColor(packageData.status) + '22' }]}>
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
                name={packageData.status === 'Entregado' ? "checkmark-circle" : "cube"} 
                size={32} 
                color={getStatusColor(packageData.status)} 
              />
            </View>
            <View style={styles.packageInfo}>
              <Text style={styles.packageId}>Paquete #{packageData.id}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(packageData.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(packageData.status) }]}>
                  {packageData.status}
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
                  <Text style={styles.stepDate}>{packageData.date}</Text>
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
                    {currentStep >= 2 ? packageData.date : deliveryInfo.estimatedDelivery}
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
            
            {packageData.status !== 'Pendiente' && (
              <View style={styles.deliveryInfoItem}>
                <Ionicons name="person-outline" size={22} color="#007AFF" />
                <View style={styles.deliveryInfoText}>
                  <Text style={styles.deliveryInfoLabel}>Entregado por</Text>
                  <Text style={styles.deliveryInfoValue}>Mensajería Express</Text>
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
                  <Text style={styles.infoValue}>{packageData.date}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tipo</Text>
                  <Text style={styles.infoValue}>{packageData.type || 'Paquete'}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Peso</Text>
                  <Text style={styles.infoValue}>{packageData.weight || '2.5'} kg</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Dimensiones</Text>
                  <Text style={styles.infoValue}>{packageData.dimensions || '30 x 20 x 15'} cm</Text>
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
                  <Text style={styles.addressText}>{packageData.origin || 'Centro de Distribución'}</Text>
                  <Text style={styles.addressSecondary}>{packageData.sender || 'Remitente Principal'}</Text>
                </View>
              </View>
              
              <View style={styles.addressDivider} />
              
              <View style={styles.addressRow}>
                <View style={[styles.addressDot, { backgroundColor: '#5cb85c22' }]}>
                  <Ionicons name="flag" size={16} color="#5cb85c" />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressLabel}>Destino</Text>
                  <Text style={styles.addressText}>{packageData.address || packageData.destination}</Text>
                  <Text style={styles.addressSecondary}>{packageData.recipient || 'Destinatario'}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Description */}
          {(packageData.description || packageData.notes) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <View style={styles.descriptionCard}>
                <Text style={styles.description}>{packageData.description || packageData.notes || 'Sin descripción'}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default PackageDetail;