import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

const styles = StyleSheet.create({
  // Main container and layout styles
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header navigation bar with title
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.section,
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  
  // Profile header section with name and delivery stats
  profileHeader: {
    padding: spacing.xxl,
    backgroundColor: colors.background.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: spacing.section,
    ...shadows.small,
    alignItems: 'center',
  },
  name: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  deliveriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  deliveriesText: {
    fontSize: typography.fontSize.bodySmall + 1,
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing.sm,
  },
  
  // Performance metrics button
  performanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  performanceButtonText: {
    color: colors.text.light,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.bodySmall,
    marginLeft: spacing.xs + 2,
  },
  
  // Content section containers
  section: {
    marginBottom: spacing.section,
    paddingHorizontal: spacing.section,
  },
  sectionTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  
  // Vehicle information card styles
  licensePlateCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large - 1,
    padding: spacing.xl - 5,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  licensePlateIcon: {
    width: 60,
    height: 60,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xl - 5,
  },
  vehicleInfo: {
    flex: 1,
  },
  licensePlateLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  licensePlate: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  vehicleType: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  
  // Personal information card styles
  infoCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large - 1,
    ...shadows.small,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl - 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    marginRight: spacing.xl - 5,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  infoText: {
    fontSize: typography.fontSize.body,
    color: colors.text.primary,
  },
  
  // Logout button styles
  logoutButton: {
    backgroundColor: colors.palette.red,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl - 5,
    borderRadius: borderRadius.medium,
    margin: spacing.section,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
  
  // Additional space at bottom for better scrolling
  bottomSpace: {
    height: spacing.section,
  }
});

export default styles;