import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Mock users for testing when backend isn't ready
const MOCK_USERS = [
    { email: 'cliente@example.com', password: 'password123', role: 'cliente' },
    { email: 'conductor@example.com', password: 'password123', role: 'conductor' },
];

const Login = () => {
    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('cliente');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [activeTab, setActiveTab] = useState('cliente');
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const tabPositionAnim = useRef(new Animated.Value(0)).current;
    
    // Input refs for focus handling
    const passwordInputRef = useRef<TextInput>(null);
    
    // Get auth context
    const { login } = useAuth();

    // Start entrance animation on component mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);
    
    // Auto-fill email and password when role changes
    useEffect(() => {
        const selectedUser = MOCK_USERS.find(user => user.role === role);
        if (selectedUser) {
            setEmail(selectedUser.email);
            setPassword(selectedUser.password);
            // Clear any previous validation errors when auto-filling
            setErrors({});
        }
        
        // Animate tab change
        Animated.timing(tabPositionAnim, {
            toValue: role === 'cliente' ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [role]);

    const validateForm = () => {
        let formErrors: { email?: string; password?: string } = {};
        let isValid = true;

        // Email validation
        if (!email) {
            formErrors.email = 'El correo es obligatorio';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = 'El correo no es válido';
            isValid = false;
        }

        // Password validation
        if (!password) {
            formErrors.password = 'La contraseña es obligatoria';
            isValid = false;
        } else if (password.length < 6) {
            formErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            // Shake animation for error
            Animated.sequence([
                Animated.timing(slideAnim, { 
                    toValue: -10, 
                    duration: 50, 
                    useNativeDriver: true 
                }),
                Animated.timing(slideAnim, { 
                    toValue: 10, 
                    duration: 50, 
                    useNativeDriver: true 
                }),
                Animated.timing(slideAnim, { 
                    toValue: -10, 
                    duration: 50, 
                    useNativeDriver: true 
                }),
                Animated.timing(slideAnim, { 
                    toValue: 0, 
                    duration: 50, 
                    useNativeDriver: true 
                }),
            ]).start();
            return;
        }

        setLoading(true);

        try {
            // In a real app, this would be replaced with an API call
            // For now, using mock data with a simulated delay
            setTimeout(async () => {
                const user = MOCK_USERS.find(
                    (u) => u.email === email && u.password === password && u.role === role
                );

                if (user) {
                    // Use the login function from AuthContext
                    await login({
                        email: user.email,
                        role: user.role,
                        token: 'mock-jwt-token'
                    });
                } else {
                    // Shake animation for invalid credentials
                    Animated.sequence([
                        Animated.timing(slideAnim, { 
                            toValue: -15, 
                            duration: 50, 
                            useNativeDriver: true 
                        }),
                        Animated.timing(slideAnim, { 
                            toValue: 15, 
                            duration: 50, 
                            useNativeDriver: true 
                        }),
                        Animated.timing(slideAnim, { 
                            toValue: -15, 
                            duration: 50, 
                            useNativeDriver: true 
                        }),
                        Animated.timing(slideAnim, { 
                            toValue: 15, 
                            duration: 50, 
                            useNativeDriver: true 
                        }),
                        Animated.timing(slideAnim, { 
                            toValue: 0, 
                            duration: 50, 
                            useNativeDriver: true 
                        }),
                    ]).start();
                    
                    Alert.alert(
                        'Error de autenticación',
                        'Credenciales incorrectas. Por favor intente nuevamente.'
                    );
                }
                setLoading(false);
            }, 1500); // Simulating network request
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
            setLoading(false);
        }
    };
    
    const handleTabPress = (selectedRole: string) => {
        setRole(selectedRole);
        setActiveTab(selectedRole);
    };
    
    const handleForgotPassword = () => {
        Alert.alert(
            'Recuperar contraseña',
            'Se enviará un enlace de recuperación a su correo electrónico.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Enviar', 
                    onPress: () => {
                        if (!email || !/\S+@\S+\.\S+/.test(email)) {
                            Alert.alert('Error', 'Por favor, ingrese un correo electrónico válido primero.');
                            return;
                        }
                        Alert.alert(
                            'Correo enviado', 
                            `Se ha enviado un enlace de recuperación a ${email}`
                        );
                    }
                }
            ]
        );
    };
    
    // Calculate tab indicator position
    const tabIndicatorPosition = tabPositionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width / 2]
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View 
                        style={[
                            styles.container,
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        {/* Logo and Title */}
                        <View style={styles.logoContainer}>
                            <Image 
                                source={{ uri: 'https://img.icons8.com/color/96/000000/delivery-truck.png' }}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.title}>Sistema de Entrega de Paquetes</Text>
                            <Text style={styles.subtitle}>Accede a tu cuenta</Text>
                        </View>
                        
                        {/* Role Selection Tabs */}
                        <View style={styles.tabContainer}>
                            <Animated.View 
                                style={[
                                    styles.tabIndicator, 
                                    { 
                                        width: width / 2 - 40, 
                                        left: tabIndicatorPosition
                                    }
                                ]} 
                            />
                            <TouchableOpacity 
                                style={[
                                    styles.tab, 
                                    activeTab === 'cliente' && styles.activeTab
                                ]}
                                onPress={() => handleTabPress('cliente')}
                            >
                                <Ionicons 
                                    name="person-outline" 
                                    size={20} 
                                    color={activeTab === 'cliente' ? "#007AFF" : "#6c757d"} 
                                />
                                <Text 
                                    style={[
                                        styles.tabText,
                                        activeTab === 'cliente' && styles.activeTabText
                                    ]}
                                >
                                    Cliente
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.tab, 
                                    activeTab === 'conductor' && styles.activeTab
                                ]}
                                onPress={() => handleTabPress('conductor')}
                            >
                                <Ionicons 
                                    name="car-outline" 
                                    size={20} 
                                    color={activeTab === 'conductor' ? "#007AFF" : "#6c757d"} 
                                />
                                <Text 
                                    style={[
                                        styles.tabText,
                                        activeTab === 'conductor' && styles.activeTabText
                                    ]}
                                >
                                    Conductor
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* Form Container */}
                        <View style={styles.formContainer}>
                            {/* Email Field */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Correo electrónico</Text>
                                <View style={[
                                    styles.inputContainer,
                                    errors.email && styles.inputContainerError
                                ]}>
                                    <Ionicons name="mail-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="ejemplo@correo.com"
                                        placeholderTextColor="#adb5bd"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (errors.email) {
                                                setErrors({...errors, email: undefined});
                                            }
                                        }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                                    />
                                </View>
                                {errors.email && (
                                    <Text style={styles.errorText}>
                                        <Ionicons name="alert-circle" size={14} color="#dc3545" /> {errors.email}
                                    </Text>
                                )}
                            </View>
                            
                            {/* Password Field */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Contraseña</Text>
                                <View style={[
                                    styles.inputContainer,
                                    errors.password && styles.inputContainerError
                                ]}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#6c757d" style={styles.inputIcon} />
                                    <TextInput
                                        ref={passwordInputRef}
                                        style={styles.input}
                                        placeholder="Contraseña"
                                        placeholderTextColor="#adb5bd"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (errors.password) {
                                                setErrors({...errors, password: undefined});
                                            }
                                        }}
                                        returnKeyType="done"
                                        onSubmitEditing={handleLogin}
                                    />
                                    <TouchableOpacity 
                                        style={styles.visibilityButton}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Ionicons 
                                            name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                            size={20} 
                                            color="#6c757d" 
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.password && (
                                    <Text style={styles.errorText}>
                                        <Ionicons name="alert-circle" size={14} color="#dc3545" /> {errors.password}
                                    </Text>
                                )}
                            </View>
                            
                            {/* Additional Options */}
                            <View style={styles.optionsRow}>
                                <TouchableOpacity 
                                    style={styles.checkboxContainer}
                                    onPress={() => setRememberMe(!rememberMe)}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Recordarme</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={handleForgotPassword}>
                                    <Text style={styles.forgotPasswordText}>¿Olvidó su contraseña?</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Login Button */}
                            <TouchableOpacity
                                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.buttonIcon} />
                                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                        
                        {/* Help Text */}
                        <View style={styles.helpTextContainer}>
                            <Text style={styles.helpText}>
                                Para probar, use las credenciales precargadas o modifíquelas.
                            </Text>
                            <View style={styles.credentialsInfo}>
                                <Text style={styles.credentialsTitle}>Credenciales de Prueba</Text>
                                <View style={styles.credentialsRow}>
                                    <Text style={styles.credentialsLabel}>Cliente:</Text>
                                    <Text style={styles.credentialsText}>cliente@example.com / password123</Text>
                                </View>
                                <View style={styles.credentialsRow}>
                                    <Text style={styles.credentialsLabel}>Conductor:</Text>
                                    <Text style={styles.credentialsText}>conductor@example.com / password123</Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* Company info footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>© 2023 Sistema de Entrega de Paquetes</Text>
                            <Text style={styles.versionText}>v1.0.0</Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#343a40',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        marginTop: 8,
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#e9ecef',
        borderRadius: 12,
        marginBottom: 25,
        position: 'relative',
        overflow: 'hidden',
    },
    tabIndicator: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        top: 0,
        zIndex: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    activeTab: {
        // Style handled with the animated indicator
    },
    tabText: {
        fontSize: 15,
        color: '#6c757d',
        marginLeft: 6,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#343a40',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 54,
    },
    inputContainerError: {
        borderColor: '#dc3545',
        borderWidth: 1.5,
        backgroundColor: '#fff8f8',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#343a40',
    },
    visibilityButton: {
        padding: 10,
    },
    errorText: {
        fontSize: 14,
        color: '#dc3545',
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ced4da',
        backgroundColor: '#ffffff',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#495057',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    loginButtonDisabled: {
        backgroundColor: '#b3d7ff',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonIcon: {
        marginRight: 8,
    },
    helpTextContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    helpText: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 12,
    },
    credentialsInfo: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    credentialsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 8,
        textAlign: 'center',
    },
    credentialsRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    credentialsLabel: {
        fontSize: 13,
        color: '#495057',
        fontWeight: '600',
        width: 80,
    },
    credentialsText: {
        fontSize: 13,
        color: '#6c757d',
        flex: 1,
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#6c757d',
    },
    versionText: {
        fontSize: 12,
        color: '#adb5bd',
        marginTop: 4,
    },
});

export default Login;