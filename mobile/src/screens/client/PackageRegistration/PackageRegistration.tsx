import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import styles from './PackageRegistration.styles';
import { packageService } from '../../../services/packageService';
import { Picker } from '@react-native-picker/picker';

// Screen for registering new packages with form and confirmation modal
const PackageRegistration = ({ navigation }) => {
  // Main form state to store all package information
  const [formData, setFormData] = useState({
    paquete_peso: '',
    paquete_dimensiones: '',
    paquete_destinatario: '',
    paquete_fecha: new Date().toISOString().split('T')[0],
    usuario_correo: '',
    ruta_id: ''
  });
  
  // Separate state for tracking individual dimension values
  const [dimensions, setDimensions] = useState({
    width: '',
    height: '',
    length: ''
  });

  // UI and form state management
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Load user data and available routes on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (!userInfo) {
          Alert.alert('Sesión expirada', 'Por favor inicie sesión nuevamente.');
          navigation.replace('Login');
          return;
        }
        
        const parsedUserInfo = JSON.parse(userInfo);
        
        if (!parsedUserInfo.token) {
          Alert.alert('Sesión inválida', 'Por favor inicie sesión nuevamente.');
          navigation.replace('Login');
          return;
        }
        
        if (parsedUserInfo.email) {
          setFormData(prev => ({
            ...prev,
            usuario_correo: parsedUserInfo.email
          }));
        }
        
        setIsLoadingRoutes(true);
        const routesData = await packageService.getRoutes();
        setAvailableRoutes(routesData);
        
        if (routesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            ruta_id: routesData[0].ruta_id.toString()
          }));
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        
        if (error.status === 401) {
          Alert.alert(
            'Sesión expirada', 
            'Su sesión ha expirado. Por favor inicie sesión nuevamente.',
            [{ text: 'OK', onPress: () => navigation.replace('Login') }]
          );
          return;
        }
        
        Alert.alert('Error', 'No se pudieron cargar las rutas disponibles');
      } finally {
        setIsLoadingRoutes(false);
      }
    };
    
    initializeData();
  }, [navigation]);
  
  // Update package dimensions string when individual dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height && dimensions.length) {
      const dimensionsString = `${dimensions.width}x${dimensions.height}x${dimensions.length} cm`;
      setFormData(prev => ({
        ...prev,
        paquete_dimensiones: dimensionsString
      }));
    }
  }, [dimensions]);
  
  // Validate all form fields and return whether form is valid
  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.paquete_destinatario) {
      newErrors.paquete_destinatario = 'El nombre del destinatario es requerido';
    }
    
    if (!formData.paquete_peso) {
      newErrors.paquete_peso = 'El peso es requerido';
    } else if (isNaN(formData.paquete_peso) || parseFloat(formData.paquete_peso) <= 0) {
      newErrors.paquete_peso = 'El peso debe ser un número positivo';
    }
    
    if (!dimensions.width) {
      newErrors.width = 'El ancho es requerido';
    } else if (isNaN(dimensions.width) || parseInt(dimensions.width) <= 0) {
      newErrors.width = 'El ancho debe ser un número positivo';
    }
    
    if (!dimensions.height) {
      newErrors.height = 'La altura es requerida';
    } else if (isNaN(dimensions.height) || parseInt(dimensions.height) <= 0) {
      newErrors.height = 'La altura debe ser un número positivo';
    }
    
    if (!dimensions.length) {
      newErrors.length = 'El largo es requerido';
    } else if (isNaN(dimensions.length) || parseInt(dimensions.length) <= 0) {
      newErrors.length = 'El largo debe ser un número positivo';
    }
    
    if (!formData.paquete_fecha) newErrors.paquete_fecha = 'La fecha es requerida';
    if (!formData.usuario_correo) newErrors.usuario_correo = 'El correo del usuario es requerido';
    if (!formData.ruta_id) newErrors.ruta_id = 'La ruta es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Show confirmation dialog when user attempts to cancel registration
  const confirmCancel = () => {
    Alert.alert(
      "¿Cancelar registro?",
      "Si sales ahora, perderás todos los datos ingresados.",
      [
        { text: "Seguir editando", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive", 
          onPress: () => {
            setFormData({
              paquete_peso: '',
              paquete_dimensiones: '',
              paquete_destinatario: '',
              paquete_fecha: new Date().toISOString().split('T')[0],
              usuario_correo: formData.usuario_correo,
              ruta_id: availableRoutes.length > 0 ? availableRoutes[0].ruta_id.toString() : ''
            });
            setDimensions({
              width: '',
              height: '',
              length: ''
            });
            setErrors({});
            
            navigation.goBack();
          } 
        }
      ]
    );
  };
  
  // Validate form and show review modal if valid
  const showReview = () => {
    if (validateForm()) {
      setShowReviewModal(true);
    }
  };
  
  // Submit package data to the server and handle response
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setShowReviewModal(false);
      
      const packageDataToSubmit = {
        ...formData,
        paquete_peso: parseFloat(formData.paquete_peso),
        ruta_id: parseInt(formData.ruta_id)
      };
      
      const response = await packageService.createPackage(packageDataToSubmit);
      
      setIsSubmitting(false);
      
      Alert.alert(
        "Registro exitoso", 
        "Su paquete ha sido registrado correctamente",
        [{ 
          text: "OK", 
          onPress: () => {
            setFormData({
              paquete_peso: '',
              paquete_dimensiones: '',
              paquete_destinatario: '',
              paquete_fecha: new Date().toISOString().split('T')[0],
              usuario_correo: formData.usuario_correo,
              ruta_id: availableRoutes.length > 0 ? availableRoutes[0].ruta_id.toString() : ''
            });
            setDimensions({
              width: '',
              height: '',
              length: ''
            });
            setErrors({});
            
            navigation.navigate('ClientHome');
          }
        }]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        "Error", 
        error.message || "No se pudo registrar el paquete"
      );
      console.error(error);
    }
  };
  
  // Update form data and clear related validation errors
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Update dimension values and clear related validation errors
  const handleDimensionChange = (field, value) => {
    setDimensions({
      ...dimensions,
      [field]: value
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Utility function to get route name from route ID
  const getRouteName = (routeId) => {
    const route = availableRoutes.find(r => r.ruta_id.toString() === routeId);
    return route ? `${route.ruta_origen} a ${route.ruta_destino}` : 'Ruta no encontrada';
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Registro de Paquete</Text>
          </View>
          
          {/* Form content - All fields in one view */}
          <ScrollView style={styles.formContainer}>
            <View style={styles.stepContainer}>
              {/* Recipient Information Section */}
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={20} color="#007AFF" />
                <Text style={styles.sectionTitle}>Información del Destinatario</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre completo del destinatario *</Text>
                <TextInput
                  style={[styles.input, errors.paquete_destinatario && styles.inputError]}
                  placeholder="Ej: Juan Pérez González"
                  value={formData.paquete_destinatario}
                  onChangeText={(text) => handleChange('paquete_destinatario', text)}
                />
                {errors.paquete_destinatario && <Text style={styles.errorText}>{errors.paquete_destinatario}</Text>}
              </View>
              
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color="#007AFF" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  Ingrese el nombre completo de la persona que recibirá el paquete.
                </Text>
              </View>
              
              {/* Basic Information Section */}
              <View style={[styles.sectionHeader, {marginTop: 20}]}>
                <Ionicons name="document-outline" size={20} color="#007AFF" />
                <Text style={styles.sectionTitle}>Información Básica</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Peso (kg) *</Text>
                <TextInput
                  style={[styles.input, errors.paquete_peso && styles.inputError]}
                  placeholder="Ej: 2.5"
                  value={formData.paquete_peso}
                  onChangeText={(text) => handleChange('paquete_peso', text)}
                  keyboardType="numeric"
                />
                {errors.paquete_peso && <Text style={styles.errorText}>{errors.paquete_peso}</Text>}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dimensiones (cm) *</Text>
                <View style={styles.dimensionsContainer}>
                  <View style={styles.dimensionInputWrapper}>
                    <TextInput
                      style={[styles.dimensionInput, errors.width && styles.inputError]}
                      placeholder="Ancho"
                      value={dimensions.width}
                      onChangeText={(text) => handleDimensionChange('width', text)}
                      keyboardType="numeric"
                    />
                    {errors.width && <Text style={styles.errorText}>{errors.width}</Text>}
                  </View>
                  <Text style={styles.dimensionX}>×</Text>
                  <View style={styles.dimensionInputWrapper}>
                    <TextInput
                      style={[styles.dimensionInput, errors.height && styles.inputError]}
                      placeholder="Alto"
                      value={dimensions.height}
                      onChangeText={(text) => handleDimensionChange('height', text)}
                      keyboardType="numeric"
                    />
                    {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
                  </View>
                  <Text style={styles.dimensionX}>×</Text>
                  <View style={styles.dimensionInputWrapper}>
                    <TextInput
                      style={[styles.dimensionInput, errors.length && styles.inputError]}
                      placeholder="Largo"
                      value={dimensions.length}
                      onChangeText={(text) => handleDimensionChange('length', text)}
                      keyboardType="numeric"
                    />
                    {errors.length && <Text style={styles.errorText}>{errors.length}</Text>}
                  </View>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ruta de envío *</Text>
                {isLoadingRoutes ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                  <View style={[styles.input, errors.ruta_id && styles.inputError]}>
                    <Picker
                      selectedValue={formData.ruta_id}
                      style={{height: 50}}
                      onValueChange={(itemValue) => handleChange('ruta_id', itemValue)}
                    >
                      <Picker.Item label="Seleccione una ruta" value="" />
                      {availableRoutes.map(route => (
                        <Picker.Item 
                          key={route.ruta_id} 
                          label={`${route.ruta_origen} a ${route.ruta_destino}`} 
                          value={route.ruta_id.toString()} 
                        />
                      ))}
                    </Picker>
                  </View>
                )}
                {errors.ruta_id && <Text style={styles.errorText}>{errors.ruta_id}</Text>}
              </View>
              
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color="#007AFF" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  Especifique el peso exacto y las dimensiones del paquete para un cálculo correcto.
                </Text>
              </View>
            </View>
          </ScrollView>
          
          {/* Action buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={[styles.navigationButton, styles.cancelButton]}
              onPress={confirmCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navigationButton, styles.nextButton]}
              onPress={showReview}
            >
              <Text style={styles.navigationButtonText}>Revisar</Text>
            </TouchableOpacity>
          </View>
          
          {/* Review Modal */}
          <Modal
            transparent={true}
            visible={showReviewModal}
            animationType="slide"
            onRequestClose={() => setShowReviewModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.reviewModal}>
                <View style={styles.reviewModalHeader}>
                  <Text style={styles.reviewModalTitle}>Confirmar Envío</Text>
                  <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                    <Ionicons name="close" size={24} color="#555" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.reviewModalContent}>
                  <Text style={styles.reviewTitle}>Resumen de Envío</Text>
                  
                  <View style={styles.reviewSection}>
                    <Text style={styles.reviewSectionTitle}>
                      <Ionicons name="person-outline" size={18} color="#007AFF" style={{marginRight: 6}} /> 
                      Destinatario
                    </Text>
                    <Text style={styles.reviewText}>{formData.paquete_destinatario}</Text>
                  </View>
                  
                  <View style={styles.reviewSection}>
                    <Text style={styles.reviewSectionTitle}>
                      <Ionicons name="document-outline" size={18} color="#007AFF" style={{marginRight: 6}} /> 
                      Información Básica
                    </Text>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Peso:</Text>
                      <Text style={styles.reviewValue}>{formData.paquete_peso} kg</Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Dimensiones:</Text>
                      <Text style={styles.reviewValue}>{formData.paquete_dimensiones}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Fecha:</Text>
                      <Text style={styles.reviewValue}>{formData.paquete_fecha}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Ruta:</Text>
                      <Text style={styles.reviewValue}>{getRouteName(formData.ruta_id)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.confirmationBox}>
                    <Ionicons name="information-circle" size={22} color="#007AFF" />
                    <Text style={styles.confirmationText}>
                      Al registrar este paquete, confirma que la información proporcionada es correcta.
                    </Text>
                  </View>
                </ScrollView>
                
                <View style={styles.reviewModalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={() => setShowReviewModal(false)}
                  >
                    <Text style={styles.modalCancelButtonText}>Volver a editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalConfirmButton]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          
          {/* Loading modal */}
          <Modal
            transparent={true}
            visible={isSubmitting}
            animationType="fade"
          >
            <View style={styles.modalBackground}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Registrando paquete...</Text>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default PackageRegistration;