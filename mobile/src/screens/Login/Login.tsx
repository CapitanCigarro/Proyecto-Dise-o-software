import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import styles from './Login.styles';

// Test user credentials for development and demonstration
const MOCK_USERS = [
    { email: 'cliente@example.com', password: 'password123', role: 'cliente' },
    { email: 'conductor@example.com', password: 'password123', role: 'conductor' },
];

// Authentication screen for user login with role selection
const Login = () => {
    // Form state and UI control variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('cliente');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    // Reference for focus management between inputs
    const passwordInputRef = useRef<TextInput>(null);
    
    // Authentication context for login functionality
    const { login } = useAuth();
    
    // Auto-populate credentials when user switches roles
    useEffect(() => {
        const selectedUser = MOCK_USERS.find(user => user.role === role);
        if (selectedUser) {
            setEmail(selectedUser.email);
            setPassword(selectedUser.password);
            // Clear any previous validation errors when auto-filling
            setErrors({});
        }
    }, [role]);

    // Validate form fields before submission
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

    // Process login submission with validation and authentication
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
    
    // Handle password recovery request
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
                    
                    {/* Additional options row */}
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
                    
                    {/* Login action button */}
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
                    
                    {/* App version information */}
                    <Text style={styles.versionText}>v1.0.0</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaWrapper>
    );
};

export default Login;