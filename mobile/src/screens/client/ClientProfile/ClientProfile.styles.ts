import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

const styles = StyleSheet.create({
  // Main container for the entire profile screen
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header section with user avatar and basic info
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  name: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.light,
  },
  role: {
    fontSize: typography.fontSize.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  
  // User statistics display in header
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xs,
    width: '80%',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  statNumber: {
    color: colors.text.light,
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSize.tiny,
    marginTop: spacing.xs/2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  
  // Edit profile button in header
  editProfileButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  editButtonText: {
    color: colors.text.light,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.bodySmall,
  },
  
  // Section containers for profile information
  sectionContainer: {
    marginHorizontal: spacing.xl,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    marginLeft: spacing.xs,
  },
  
  // Card container for info groups
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    padding: spacing.xs,
    ...shadows.small,
  },
  
  // Information row layout with icon and text
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl - 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.main,
  },
  icon: {
    marginRight: spacing.xl,
    width: 25,
    textAlign: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.tertiary,
  },
  infoText: {
    fontSize: typography.fontSize.body,
    color: colors.text.primary,
    marginTop: spacing.xs/2,
  },
  
  // Preference row with label and toggle
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl - 5,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: typography.fontSize.body,
    color: colors.text.primary,
  },
  preferenceDescription: {
    fontSize: typography.fontSize.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs/2,
  },
  
  // Logout button at bottom of screen
  logoutButton: {
    backgroundColor: colors.palette.red,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.medium,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl + 6,
    marginBottom: spacing.md - 2,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
  
  // App version display
  versionText: {
    textAlign: 'center',
    color: colors.text.tertiary,
    fontSize: typography.fontSize.tiny,
    marginBottom: spacing.xxl + 6,
  },
  
  // Modal for editing profile information
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  
  // Modal header with title and close button
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  
  // Form container and input fields
  formContainer: {
    maxHeight: '70%',
  },
  inputLabel: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs + 2,
    marginLeft: spacing.xs/2,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: borderRadius.medium - 2,
    padding: spacing.md,
    marginBottom: spacing.xl,
    fontSize: typography.fontSize.body,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Save button for form submission
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.md - 2,
  },
  saveButtonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  }
});

export default styles;