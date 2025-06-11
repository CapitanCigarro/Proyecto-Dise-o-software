import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

// Styles for the package registration screen components
const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header with title
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.section,
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  
  // Form container and scrollable content
  formContainer: {
    flex: 1,
    backgroundColor: colors.background.card,
  },
  stepContainer: {
    padding: spacing.xl,
  },
  
  // Form input field styling
  inputGroup: {
    marginBottom: spacing.section,
  },
  label: {
    fontSize: typography.fontSize.bodySmall,
    marginBottom: spacing.xs + 1,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    fontSize: typography.fontSize.body,
    backgroundColor: colors.background.main,
  },
  
  // Error styling for validation feedback
  inputError: {
    borderColor: colors.palette.red,
  },
  errorText: {
    color: colors.palette.red,
    fontSize: typography.fontSize.tiny,
    marginTop: spacing.xs + 1,
  },
  
  // Multiline text input
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // Bottom navigation buttons
  navigationButtons: {
    flexDirection: 'row',
    padding: spacing.section,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navigationButton: {
    flex: 1,
    padding: spacing.md + 2,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs + 1,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.palette.red + '18',
    borderWidth: 1,
    borderColor: colors.palette.red + '50',
  },
  navigationButtonText: {
    fontWeight: typography.fontWeight.bold,
    color: colors.text.light,
  },
  cancelButtonText: {
    color: colors.palette.red,
  },
  
  // Information box for help text
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginVertical: spacing.sm + 2,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: spacing.sm + 2,
    marginTop: 2,
  },
  infoText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  
  // Package dimensions input layout
  dimensionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dimensionInputWrapper: {
    flex: 1,
  },
  dimensionInput: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlign: 'center',
  },
  dimensionX: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginHorizontal: 8,
  },
  
  // Review form section styles
  reviewTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.section,
    color: colors.text.primary,
    textAlign: 'center',
  },
  reviewSection: {
    marginBottom: spacing.xl,
    backgroundColor: colors.background.main,
    padding: spacing.section,
    borderRadius: borderRadius.medium,
  },
  reviewSectionTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.sm + 2,
    color: colors.text.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: typography.fontSize.body - 1,
    color: colors.text.primary,
    marginBottom: spacing.xs + 1,
  },
  reviewRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs + 1,
  },
  reviewLabel: {
    fontSize: typography.fontSize.body - 1,
    color: colors.text.secondary,
    width: 100,
  },
  reviewValue: {
    fontSize: typography.fontSize.body - 1,
    color: colors.text.primary,
    flex: 1,
  },
  
  // Terms and conditions confirmation box
  confirmationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    padding: spacing.section,
    borderRadius: borderRadius.medium,
    marginTop: spacing.sm + 2,
  },
  confirmationText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.primary,
    marginLeft: spacing.sm + 2,
    flex: 1,
  },
  
  // Modal background overlay
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: colors.background.card,
    padding: 25,
    borderRadius: borderRadius.large,
    alignItems: 'center',
    minWidth: 200,
    ...shadows.small,
  },
  loadingText: {
    marginTop: spacing.section,
    fontSize: typography.fontSize.body,
    color: colors.text.primary,
  },
  
  // Section header with icon and title
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  
  // Confirmation modal styling
  reviewModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 0,
    overflow: 'hidden',
  },
  reviewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  reviewModalContent: {
    padding: 16,
  },
  reviewModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: '45%',
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f1f1f1',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  modalConfirmButton: {
    backgroundColor: '#007AFF',
  },
  modalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default styles;