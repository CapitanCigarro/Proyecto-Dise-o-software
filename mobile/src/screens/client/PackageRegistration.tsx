import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
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
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const PackageRegistration = ({ navigation }) => {
  // Form state
  const [formData, setFormData] = useState({
    sender: '',
    recipient: '',
    address: '',
    phone: '',
    weight: '',
    width: '',
    height: '',
    length: '',
    description: '',
    packageType: 'standard' // default package type
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState('');
  const [progressValue] = useState(new Animated.Value(0));

  // Steps configuration
  const steps = [
    { title: "Remitente", icon: "person-outline" },
    { title: "Destinatario", icon: "location-outline" },
    { title: "Paquete", icon: "cube-outline" },
    { title: "Revisión", icon: "checkmark-circle-outline" }
  ];

  // Calculate progress based on current step
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: (currentStep + 1) / steps.length,
      duration: 300,
      useNativeDriver: false
    }).start();
    
    // Calculate cost estimation when on package step
    if (currentStep === 2) {
      calculateCost();
    }
  }, [currentStep, formData.weight, formData.width, formData.height, formData.length]);

  // Mock address suggestions
  useEffect(() => {
    if (formData.address.length > 3 && currentStep === 1) {
      // Simulate API call delay
      const timer = setTimeout(() => {
        const mockSuggestions = [
          { id: 1, address: `${formData.address}, Calle Principal 123` },
          { id: 2, address: `${formData.address}, Avenida Central 456` },
          { id: 3, address: `${formData.address}, Plaza Mayor 789` }
        ];
        setAddressSuggestions(mockSuggestions);
        setShowAddressSuggestions(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setShowAddressSuggestions(false);
    }
  }, [formData.address]);
  
  // Simple cost calculation based on dimensions and weight
  const calculateCost = () => {
    const { weight, width, height, length, packageType } = formData;
    
    // Only calculate if we have all the values
    if (weight && width && height && length && 
        !isNaN(weight) && !isNaN(width) && !isNaN(height) && !isNaN(length)) {
      
      // Calculate volume in cubic cm
      const volume = Number(width) * Number(height) * Number(length);
      
      // Base price calculation
      let price = Number(weight) * 5 + volume * 0.001;
      
      // Add premium for package type
      if (packageType === 'fragile') price *= 1.5;
      if (packageType === 'express') price *= 1.75;
      
      // Format the price
      setEstimatedCost(price.toFixed(2));
    } else {
      setEstimatedCost('');
    }
  };
  
  // Form validation
  const validateCurrentStep = () => {
    let newErrors = {};
    
    switch (currentStep) {
      case 0: // Sender validation
        if (!formData.sender) newErrors.sender = 'El nombre del remitente es requerido';
        break;
        
      case 1: // Recipient validation
        if (!formData.recipient) newErrors.recipient = 'El nombre del destinatario es requerido';
        if (!formData.address) newErrors.address = 'La dirección es requerida';
        if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
        
        // Validate phone format
        const phoneRegex = /^\d{7,15}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
          newErrors.phone = 'Ingrese un número de teléfono válido';
        }
        break;
        
      case 2: // Package validation
        // Validate numeric fields
        if (!formData.weight) {
          newErrors.weight = 'El peso es requerido';
        } else if (isNaN(Number(formData.weight))) {
          newErrors.weight = 'El peso debe ser un número';
        }
        
        if (!formData.width) {
          newErrors.width = 'El ancho es requerido';
        } else if (isNaN(Number(formData.width))) {
          newErrors.width = 'El ancho debe ser un número';
        }
        
        if (!formData.height) {
          newErrors.height = 'El alto es requerido'; 
        } else if (isNaN(Number(formData.height))) {
          newErrors.height = 'El alto debe ser un número';
        }
        
        if (!formData.length) {
          newErrors.length = 'El largo es requerido';
        } else if (isNaN(Number(formData.length))) {
          newErrors.length = 'El largo debe ser un número';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateForm = () => {
    let newErrors = {};
    
    // Check required fields
    if (!formData.sender) newErrors.sender = 'El nombre del remitente es requerido';
    if (!formData.recipient) newErrors.recipient = 'El nombre del destinatario es requerido';
    if (!formData.address) newErrors.address = 'La dirección es requerida';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    if (!formData.weight) newErrors.weight = 'El peso es requerido';
    if (!formData.width) newErrors.width = 'El ancho es requerido';
    if (!formData.height) newErrors.height = 'El alto es requerido';
    if (!formData.length) newErrors.length = 'El largo es requerido';
    
    // Validate numeric fields
    if (formData.weight && isNaN(Number(formData.weight))) {
      newErrors.weight = 'El peso debe ser un número';
    }
    if (formData.width && isNaN(Number(formData.width))) {
      newErrors.width = 'El ancho debe ser un número';
    }
    if (formData.height && isNaN(Number(formData.height))) {
      newErrors.height = 'El alto debe ser un número';
    }
    if (formData.length && isNaN(Number(formData.length))) {
      newErrors.length = 'El largo debe ser un número';
    }
    
    // Validate phone format
    const phoneRegex = /^\d{7,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Ingrese un número de teléfono válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigation between steps
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        handleSubmit();
      }
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    } else {
      confirmCancel();
    }
  };
  
  const confirmCancel = () => {
    Alert.alert(
      "¿Cancelar registro?",
      "Si sales ahora, perderás todos los datos ingresados.",
      [
        { text: "Seguir editando", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: () => navigation.goBack() }
      ]
    );
  };
  
  // Form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Format dimensions
        const dimensions = `${formData.width}x${formData.height}x${formData.length}`;
        
        // Create package object with ID and status
        const packageObj = {
          ...formData,
          dimensions,
          id: Math.floor(1000 + Math.random() * 9000).toString(), // Generate random 4-digit ID
          status: 'Pendiente',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          estimatedCost
        };
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get existing packages or initialize empty array
        const packagesJson = await AsyncStorage.getItem('packages');
        const packages = packagesJson ? JSON.parse(packagesJson) : [];
        
        // Add new package
        packages.push(packageObj);
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('packages', JSON.stringify(packages));
        
        setIsSubmitting(false);
        
        // Show success message
        Alert.alert(
          "Registro exitoso", 
          `Su paquete ha sido registrado con ID: #${packageObj.id}`,
          [{ text: "OK", onPress: () => navigation.navigate('Home') }]
        );
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert("Error", "No se pudo registrar el paquete");
        console.error(error);
      }
    }
  };
  
  // Form field change handler
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Select address from suggestions
  const selectAddress = (address) => {
    handleChange('address', address);
    setShowAddressSuggestions(false);
  };
  
  // Select package type
  const selectPackageType = (type) => {
    handleChange('packageType', type);
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Sender information
        return (
          <View style={styles.stepContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo *</Text>
              <TextInput
                style={[styles.input, errors.sender && styles.inputError]}
                placeholder="Nombre del remitente"
                value={formData.sender}
                onChangeText={(text) => handleChange('sender', text)}
              />
              {errors.sender && <Text style={styles.errorText}>{errors.sender}</Text>}
            </View>
            
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#007AFF" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Como remitente, usted es responsable de proporcionar información precisa sobre el paquete.
              </Text>
            </View>
          </View>
        );
        
      case 1: // Recipient information
        return (
          <View style={styles.stepContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo del destinatario *</Text>
              <TextInput
                style={[styles.input, errors.recipient && styles.inputError]}
                placeholder="Nombre del destinatario"
                value={formData.recipient}
                onChangeText={(text) => handleChange('recipient', text)}
              />
              {errors.recipient && <Text style={styles.errorText}>{errors.recipient}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección de entrega *</Text>
              <View style={styles.addressInputContainer}>
                <TextInput
                  style={[
                    styles.input, 
                    styles.addressInput,
                    errors.address && styles.inputError
                  ]}
                  placeholder="Ingrese la dirección de entrega"
                  value={formData.address}
                  onChangeText={(text) => handleChange('address', text)}
                />
                {formData.address.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => handleChange('address', '')}
                  >
                    <Ionicons name="close-circle" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              
              {/* Address suggestions */}
              {showAddressSuggestions && (
                <View style={styles.suggestionsContainer}>
                  {addressSuggestions.map(suggestion => (
                    <TouchableOpacity 
                      key={suggestion.id}
                      style={styles.suggestionItem}
                      onPress={() => selectAddress(suggestion.address)}
                    >
                      <Ionicons name="location-outline" size={16} color="#007AFF" style={styles.suggestionIcon} />
                      <Text style={styles.suggestionText}>{suggestion.address}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono de contacto *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Número de teléfono"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
          </View>
        );
        
      case 2: // Package information
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.groupTitle}>Tipo de Paquete</Text>
            <View style={styles.packageTypeContainer}>
              <TouchableOpacity 
                style={[
                  styles.packageTypeOption,
                  formData.packageType === 'standard' && styles.packageTypeSelected
                ]}
                onPress={() => selectPackageType('standard')}
              >
                <Ionicons 
                  name="cube-outline" 
                  size={28} 
                  color={formData.packageType === 'standard' ? "#007AFF" : "#666"} 
                />
                <Text style={[
                  styles.packageTypeText,
                  formData.packageType === 'standard' && styles.packageTypeTextSelected
                ]}>
                  Estándar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.packageTypeOption,
                  formData.packageType === 'fragile' && styles.packageTypeSelected
                ]}
                onPress={() => selectPackageType('fragile')}
              >
                <Ionicons 
                  name="wine-outline" 
                  size={28} 
                  color={formData.packageType === 'fragile' ? "#007AFF" : "#666"} 
                />
                <Text style={[
                  styles.packageTypeText,
                  formData.packageType === 'fragile' && styles.packageTypeTextSelected
                ]}>
                  Frágil
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.packageTypeOption,
                  formData.packageType === 'express' && styles.packageTypeSelected
                ]}
                onPress={() => selectPackageType('express')}
              >
                <Ionicons 
                  name="flash-outline" 
                  size={28} 
                  color={formData.packageType === 'express' ? "#007AFF" : "#666"} 
                />
                <Text style={[
                  styles.packageTypeText,
                  formData.packageType === 'express' && styles.packageTypeTextSelected
                ]}>
                  Express
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.groupTitle}>Dimensiones y Peso</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg) *</Text>
              <TextInput
                style={[styles.input, errors.weight && styles.inputError]}
                placeholder="Ej: 2.5"
                value={formData.weight}
                onChangeText={(text) => handleChange('weight', text)}
                keyboardType="numeric"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>
            
            <View style={styles.dimensionsContainer}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Ancho (cm) *</Text>
                <TextInput
                  style={[styles.input, errors.width && styles.inputError]}
                  placeholder="Ancho"
                  value={formData.width}
                  onChangeText={(text) => handleChange('width', text)}
                  keyboardType="numeric"
                />
                {errors.width && <Text style={styles.errorText}>{errors.width}</Text>}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 4 }]}>
                <Text style={styles.label}>Alto (cm) *</Text>
                <TextInput
                  style={[styles.input, errors.height && styles.inputError]}
                  placeholder="Alto"
                  value={formData.height}
                  onChangeText={(text) => handleChange('height', text)}
                  keyboardType="numeric"
                />
                {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Largo (cm) *</Text>
                <TextInput
                  style={[styles.input, errors.length && styles.inputError]}
                  placeholder="Largo"
                  value={formData.length}
                  onChangeText={(text) => handleChange('length', text)}
                  keyboardType="numeric"
                />
                {errors.length && <Text style={styles.errorText}>{errors.length}</Text>}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción del contenido del paquete"
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                multiline
                numberOfLines={3}
              />
            </View>
            
            {estimatedCost && (
              <View style={styles.costEstimation}>
                <Text style={styles.costEstimationText}>
                  Costo estimado de envío: <Text style={styles.costEstimationAmount}>${estimatedCost}</Text>
                </Text>
                <Text style={styles.costEstimationNote}>Este es un cálculo aproximado basado en las dimensiones y peso.</Text>
              </View>
            )}
          </View>
        );
        
      case 3: // Review and summary
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.reviewTitle}>Resumen de Envío</Text>
            
            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>
                <Ionicons name="person-outline" size={18} color="#007AFF" style={{marginRight: 6}} /> 
                Información del Remitente
              </Text>
              <Text style={styles.reviewText}>{formData.sender}</Text>
            </View>
            
            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>
                <Ionicons name="location-outline" size={18} color="#007AFF" style={{marginRight: 6}} /> 
                Información del Destinatario
              </Text>
              <Text style={styles.reviewText}>{formData.recipient}</Text>
              <Text style={styles.reviewText}>{formData.address}</Text>
              <Text style={styles.reviewText}>{formData.phone}</Text>
            </View>
            
            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>
                <Ionicons name="cube-outline" size={18} color="#007AFF" style={{marginRight: 6}} /> 
                Información del Paquete
              </Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Tipo:</Text>
                <Text style={styles.reviewValue}>
                  {formData.packageType === 'standard' && 'Estándar'}
                  {formData.packageType === 'fragile' && 'Frágil'}
                  {formData.packageType === 'express' && 'Express'}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Peso:</Text>
                <Text style={styles.reviewValue}>{formData.weight} kg</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Dimensiones:</Text>
                <Text style={styles.reviewValue}>{formData.width} x {formData.height} x {formData.length} cm</Text>
              </View>
              {formData.description && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Descripción:</Text>
                  <Text style={styles.reviewValue}>{formData.description}</Text>
                </View>
              )}
            </View>
            
            {estimatedCost && (
              <View style={styles.costSummary}>
                <Text style={styles.costSummaryLabel}>Costo estimado:</Text>
                <Text style={styles.costSummaryValue}>${estimatedCost}</Text>
              </View>
            )}
            
            <View style={styles.confirmationBox}>
              <Ionicons name="information-circle" size={22} color="#007AFF" />
              <Text style={styles.confirmationText}>
                Al registrar este paquete, confirma que la información proporcionada es correcta.
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={goToPreviousStep}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Registro de Paquete</Text>
          </View>
          
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.stepIndicatorContainer}>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepIndicator}>
                  <View style={[
                    styles.stepCircle,
                    currentStep >= index ? styles.stepCircleActive : styles.stepCircleInactive
                  ]}>
                    <Ionicons 
                      name={currentStep > index ? "checkmark" : step.icon} 
                      size={16} 
                      color={currentStep >= index ? "#fff" : "#999"} 
                    />
                  </View>
                  <Text style={[
                    styles.stepText,
                    currentStep >= index ? styles.stepTextActive : styles.stepTextInactive
                  ]}>
                    {step.title}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  {
                    width: progressValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
            </View>
          </View>
          
          {/* Form content */}
          <ScrollView style={styles.formContainer}>
            {renderStepContent()}
          </ScrollView>
          
          {/* Navigation buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={[
                styles.navigationButton,
                currentStep === 0 ? styles.cancelButton : styles.backButton
              ]}
              onPress={goToPreviousStep}
            >
              <Text style={[
                styles.navigationButtonText,
                currentStep === 0 ? styles.cancelButtonText : styles.backButtonText
              ]}>
                {currentStep === 0 ? 'Cancelar' : 'Anterior'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.navigationButton,
                styles.nextButton,
                currentStep === steps.length - 1 ? styles.submitButton : {}
              ]}
              onPress={goToNextStep}
            >
              <Text style={styles.navigationButtonText}>
                {currentStep === steps.length - 1 ? 'Registrar' : 'Siguiente'}
              </Text>
            </TouchableOpacity>
          </View>
          
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepCircleActive: {
    backgroundColor: '#007AFF',
  },
  stepCircleInactive: {
    backgroundColor: '#e0e0e0',
  },
  stepText: {
    fontSize: 12,
  },
  stepTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  stepTextInactive: {
    color: '#999',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stepContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  addressInputContainer: {
    position: 'relative',
  },
  addressInput: {
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 5,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navigationButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#ff3b3018',
    borderWidth: 1,
    borderColor: '#ff3b3050',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  navigationButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  backButtonText: {
    color: '#666',
  },
  cancelButtonText: {
    color: '#ff3b30',
  },
  // Suggestions
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 120,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  // Info box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    lineHeight: 20,
  },
  // Package type selector
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  packageTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  packageTypeOption: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  packageTypeSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  packageTypeText: {
    marginTop: 5,
    color: '#666',
    fontSize: 14,
  },
  packageTypeTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Cost estimation
  costEstimation: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  costEstimationText: {
    fontSize: 16,
    color: '#333',
  },
  costEstimationAmount: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  costEstimationNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  // Review styles
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  reviewSection: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 5,
  },
  reviewRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewLabel: {
    fontSize: 15,
    color: '#666',
    width: 100,
  },
  reviewValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  costSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
  },
  costSummaryLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  costSummaryValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmationText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  // Loading modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default PackageRegistration;