import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

const styles = StyleSheet.create({
  // Main container for the package registration screen
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header bar with screen title
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
  
  // Progress indicator showing current step in registration flow
  progressContainer: {
    backgroundColor: colors.background.card,
    paddingBottom: spacing.section,
    marginBottom: spacing.sm,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.section,
    marginBottom: spacing.sm + 2,
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
    marginBottom: spacing.xs + 1,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleInactive: {
    backgroundColor: colors.text.tertiary + '40', // Usando color terciario con opacidad
  },
  stepText: {
    fontSize: typography.fontSize.tiny,
  },
  stepTextActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  stepTextInactive: {
    color: colors.text.tertiary,
  },
  
  // Progress bar showing overall completion
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.small,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.border,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
  },
  
  // Form container for input fields
  formContainer: {
    flex: 1,
    backgroundColor: colors.background.card,
  },
  stepContainer: {
    padding: spacing.xl,
  },
  
  // Input field styling and groups
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
  
  // Address input with clear button
  addressInputContainer: {
    position: 'relative',
  },
  addressInput: {
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  
  // Error state for form validation
  inputError: {
    borderColor: colors.palette.red,
  },
  errorText: {
    color: colors.palette.red,
    fontSize: typography.fontSize.tiny,
    marginTop: spacing.xs + 1,
  },
  
  // Multiline text area input
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // Navigation buttons for form steps
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
  backButton: {
    backgroundColor: colors.background.main,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.palette.red + '18',
    borderWidth: 1,
    borderColor: colors.palette.red + '50',
  },
  submitButton: {
    backgroundColor: colors.palette.green,
  },
  navigationButtonText: {
    fontWeight: typography.fontWeight.bold,
    color: colors.text.light,
  },
  backButtonText: {
    color: colors.text.secondary,
  },
  cancelButtonText: {
    color: colors.palette.red,
  },
  
  // Address suggestions dropdown
  suggestionsContainer: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    marginTop: spacing.xs + 1,
    maxHeight: 120,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionIcon: {
    marginRight: spacing.sm,
  },
  suggestionText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.primary,
  },
  
  // Information box for additional guidance
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
  
  // Package type selection options
  groupTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm + 2,
    color: colors.text.primary,
  },
  packageTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  packageTypeOption: {
    flex: 1,
    marginHorizontal: spacing.xs + 1,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background.main,
  },
  packageTypeSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  packageTypeText: {
    marginTop: spacing.xs + 1,
    color: colors.text.secondary,
    fontSize: typography.fontSize.bodySmall,
  },
  packageTypeTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  
  // Package dimensions input row
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Cost estimation display
  costEstimation: {
    backgroundColor: colors.background.main,
    padding: spacing.section,
    borderRadius: borderRadius.medium,
    marginTop: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.palette.green,
  },
  costEstimationText: {
    fontSize: typography.fontSize.body,
    color: colors.text.primary,
  },
  costEstimationAmount: {
    fontWeight: typography.fontWeight.bold,
    color: colors.palette.green,
  },
  costEstimationNote: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
    marginTop: spacing.xs + 1,
  },
  
  // Review form section for final confirmation
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
  
  // Cost summary display in review
  costSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.palette.green,
    padding: spacing.section,
    borderRadius: borderRadius.medium,
    marginVertical: spacing.section,
  },
  costSummaryLabel: {
    fontSize: typography.fontSize.body,
    color: colors.text.light,
    fontWeight: typography.fontWeight.semiBold,
  },
  costSummaryValue: {
    fontSize: typography.fontSize.subheading,
    color: colors.text.light,
    fontWeight: typography.fontWeight.bold,
  },
  
  // Terms confirmation checkbox
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
  
  // Loading indicator modal
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
});

export default styles;