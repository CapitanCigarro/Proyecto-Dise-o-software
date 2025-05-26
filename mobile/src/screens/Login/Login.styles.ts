import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/globalStyles';

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
        paddingHorizontal: spacing.section + 9,
    },
    
    // Logo and title section styles
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl + 12,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize.heading + 2,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.light,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.fontSize.body,
        color: 'rgba(255,255,255,0.8)',
        marginTop: spacing.sm,
        textAlign: 'center',
    },
    
    // User role selection toggle styles
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xxl + 6,
        paddingHorizontal: spacing.sm + 2,
    },
    roleButton: {
        flex: 1,
        backgroundColor: colors.border,
        borderRadius: borderRadius.medium,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: spacing.sm,
        ...shadows.small,
    },
    roleButtonActive: {
        backgroundColor: `#E6F2FF`,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    roleText: {
        fontSize: typography.fontSize.bodySmall + 1,
        color: colors.text.tertiary,
        marginLeft: spacing.sm,
        fontWeight: typography.fontWeight.medium,
    },
    roleTextActive: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    
    // Input field container and control styles
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.lg,
        ...shadows.small,
        overflow: 'hidden',
    },
    inputIconContainer: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        fontSize: typography.fontSize.body,
        color: colors.text.primary,
    },
    visibilityButton: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Error message styling
    errorText: {
        fontSize: typography.fontSize.bodySmall,
        color: colors.palette.red,
        marginTop: -spacing.sm - 2,
        marginBottom: spacing.lg,
        marginLeft: spacing.sm,
    },
    
    // Additional form options row styles
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl + 5,
        paddingHorizontal: spacing.sm,
    },
    
    // Checkbox control styles
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: borderRadius.small - 2,
        borderWidth: 1,
        borderColor: '#ced4da',
        backgroundColor: colors.background.card,
        marginRight: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkboxLabel: {
        fontSize: typography.fontSize.bodySmall,
        color: colors.text.secondary,
    },
    
    // Password recovery link style
    forgotPasswordText: {
        fontSize: typography.fontSize.bodySmall,
        color: colors.primary,
        fontWeight: typography.fontWeight.medium,
    },
    
    // Login button styles with states
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.medium,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
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
        color: colors.text.light,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    
    // App version display style
    versionText: {
        fontSize: typography.fontSize.tiny,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.xl + 20,
    },
});

export default styles;