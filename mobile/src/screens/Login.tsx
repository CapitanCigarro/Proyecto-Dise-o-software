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
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

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
    
    // Input refs for focus handling
    const passwordInputRef = useRef<TextInput>(null);
    
    // Get auth context
    const { login } = useAuth();
    
    // Auto-fill email and password when role changes
    useEffect(() => {
        const selectedUser = MOCK_USERS.find(user => user.role === role);
        if (selectedUser) {
            setEmail(selectedUser.email);
            setPassword(selectedUser.password);
            // Clear any previous validation errors when auto-filling
            setErrors({});
        }
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
                        Alert.alert('Correo enviado', `Se ha enviado un enlace de recuperación a ${email}`);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaWrapper>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
                
                {/* Background gradient */}
                <LinearGradient
                    colors={['#007AFF', '#1E90FF']}
                    style={styles.background}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                
                <View style={styles.formWrapper}>
                    {/* Logo and Title */}
                    <View style={styles.logoContainer}>
                        <Image 
                            source={{ uri: 'https://img.icons8.com/color/96/000000/delivery-truck.png' }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Sistema de Entrega</Text>
                        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
                    </View>
                    
                    {/* Role Selection */}
                    <View style={styles.roleContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.roleButton, 
                                role === 'cliente' && styles.roleButtonActive
                            ]}
                            onPress={() => setRole('cliente')}
                        >
                            <Ionicons 
                                name="person" 
                                size={22} 
                                color={role === 'cliente' ? "#007AFF" : "#6c757d"} 
                            />
                            <Text 
                                style={[
                                    styles.roleText,
                                    role === 'cliente' && styles.roleTextActive
                                ]}
                            >
                                Cliente
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[
                                styles.roleButton, 
                                role === 'conductor' && styles.roleButtonActive
                            ]}
                            onPress={() => setRole('conductor')}
                        >
                            <Ionicons 
                                name="car" 
                                size={22} 
                                color={role === 'conductor' ? "#007AFF" : "#6c757d"} 
                            />
                            <Text 
                                style={[
                                    styles.roleText,
                                    role === 'conductor' && styles.roleTextActive
                                ]}
                            >
                                Conductor
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Email Field */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="mail" size={20} color="#007AFF" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
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
                    
                    {/* Password Field */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="lock-closed" size={20} color="#007AFF" />
                        </View>
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
                                name={showPassword ? "eye-off" : "eye"} 
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
                    
                    {/* Options Row */}
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
                            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>
                    
                    {/* Footer */}
                    <Text style={styles.versionText}>v1.0.0</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height * 0.4,
    },
    formWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 8,
        textAlign: 'center',
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    roleButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    roleButtonActive: {
        backgroundColor: '#E6F2FF',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    roleText: {
        fontSize: 15,
        color: '#6c757d',
        marginLeft: 8,
        fontWeight: '500',
    },
    roleTextActive: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    inputIconContainer: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#f0f0f0',
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#343a40',
    },
    visibilityButton: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#dc3545',
        marginTop: -10,
        marginBottom: 16,
        marginLeft: 8,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 8,
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
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
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
    versionText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 40,
    },
});

export default Login;