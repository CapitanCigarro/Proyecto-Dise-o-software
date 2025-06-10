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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/authService';

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
    
    // Check for saved credentials on component mount
    useEffect(() => {
        const loadSavedCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('savedEmail');
                const savedPassword = await AsyncStorage.getItem('savedPassword');
                const savedRememberMe = await AsyncStorage.getItem('rememberMe');
                
                if (savedEmail && savedPassword && savedRememberMe === 'true') {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Error loading saved credentials:', error);
            }
        };
        
        loadSavedCredentials();
    }, []);

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

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({}); // Limpio errores previos

        try {
            // Pass the role as third parameter
            const data = await authService.login(email, password, role);
            
            console.log('Login exitoso', data);

            // Save credentials if rememberMe is checked
            if (rememberMe) {
                await AsyncStorage.setItem('savedEmail', email);
                await AsyncStorage.setItem('savedPassword', password);
                await AsyncStorage.setItem('rememberMe', 'true');
            } else {
                // Clear saved credentials if rememberMe is unchecked
                await AsyncStorage.removeItem('savedEmail');
                await AsyncStorage.removeItem('savedPassword');
                await AsyncStorage.removeItem('rememberMe');
            }

            // Guarda el token usando AsyncStorage
            await AsyncStorage.setItem('token', data.token);

            await login({
                email,
                role: role, 
                token: data.token,
            });
        } catch (error: any) {
            console.error('Error al iniciar sesión:', error);
            
            if (error.status === 401) {
                setErrors({ email: 'Credenciales incorrectas' });
            } else if (error.status === 403) {
                setErrors({ email: 'No tienes permiso para acceder con este rol' });
            } else {
                setErrors({ email: error.message || 'Error al conectar con el servidor' });
            }
        } finally {
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
                    onPress: async () => {
                        if (!email || !/\S+@\S+\.\S+/.test(email)) {
                            Alert.alert('Error', 'Por favor, ingrese un correo electrónico válido primero.');
                            return;
                        }
                        
                        try {
                            await authService.requestPasswordReset(email);
                            Alert.alert('Correo enviado', `Se ha enviado un enlace de recuperación a ${email}`);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo enviar el correo de recuperación.');
                        }
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