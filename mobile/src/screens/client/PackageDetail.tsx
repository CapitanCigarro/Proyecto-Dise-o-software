import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Share,
  Linking,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PackageDetailScreenRouteProp, PackageDetailScreenNavigationProp } from '../../navigation/types';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const { width } = Dimensions.get('window');

const PackageDetail = () => {
  const navigation = useNavigation<PackageDetailScreenNavigationProp>();
  const route = useRoute<PackageDetailScreenRouteProp>();
  const { package: packageData } = route.params;
  
  // Current step in tracking journey
  const [currentStep, setCurrentStep] = useState(getStatusStep(packageData.status));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En tránsito': return '#f0ad4e';
      case 'Entregado': return '#5cb85c';
      case 'Pendiente': return '#d9534f';
      default: return '#0275d8';
    }
  };
  
  function getStatusStep(status: string) {
    switch(status) {
      case 'Pendiente': return 0;
      case 'En tránsito': return 1;
      case 'Entregado': return 2;
      default: return 0;
    }
  }
  
  // Expected delivery data based on status
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
  
  const callSupport = () => {
    Linking.openURL('tel:0800-123-4567');
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
          
          {/* Support Section */}
          <View style={styles.supportSection}>
            <Text style={styles.supportText}>¿Tienes alguna pregunta sobre tu envío?</Text>
            <TouchableOpacity style={styles.supportButton} onPress={callSupport}>
              <Ionicons name="call-outline" size={18} color="#fff" />
              <Text style={styles.supportButtonText}>Contactar a Soporte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginRight: 15,
  },
  packageInfo: {
    flex: 1,
  },
  packageId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  trackingContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trackingTimeline: {
    position: 'relative',
    paddingLeft: 30,
    marginTop: 10,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 15,
    bottom: 15,
    width: 2,
    backgroundColor: '#ddd',
    zIndex: 1,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    position: 'relative',
    zIndex: 2,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: -15,
  },
  stepCompleted: {
    backgroundColor: '#5cb85c',
  },
  stepPending: {
    backgroundColor: '#ddd',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stepDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  deliveryInfoText: {
    marginLeft: 10,
  },
  deliveryInfoLabel: {
    fontSize: 12,
    color: '#666',
  },
  deliveryInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingHorizontal: 5,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  addressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    marginLeft: 45,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
    marginBottom: 2,
  },
  addressSecondary: {
    fontSize: 14,
    color: '#666',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  supportSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  supportButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default PackageDetail;