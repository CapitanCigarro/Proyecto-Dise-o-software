import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions for responsive layouts
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    // Main container and background styles
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
    
    // Logo and title section styles
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
    
    // User role selection toggle styles
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
    
    // Input field container and control styles
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
    
    // Error message styling
    errorText: {
        fontSize: 14,
        color: '#dc3545',
        marginTop: -10,
        marginBottom: 16,
        marginLeft: 8,
    },
    
    // Additional form options row styles
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 8,
    },
    
    // Checkbox control styles
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
    
    // Password recovery link style
    forgotPasswordText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    
    // Login button styles with states
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
    
    // App version display style
    versionText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 40,
    },
});

export default styles;