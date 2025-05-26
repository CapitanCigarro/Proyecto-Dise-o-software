import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header section with user greeting
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  welcomeText: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  
  // Delivery metrics cards row
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    ...shadows.small,
  },
  statNumber: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.text.secondary,
  },
  statIcon: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    opacity: 0.7,
  },
  
  // Content card sections (packages, notifications)
  section: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    margin: spacing.section,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: typography.fontSize.body,
    color: colors.primary,
  },
  
  // Packages list container
  packagesList: {
    marginTop: spacing.xs,
  },
  
  // Package item layout and styling
  packageItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  packageInfo: {
    flex: 1,
  },
  packageId: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  packageDestination: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  packageDate: {
    fontSize: typography.fontSize.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  
  // Status badge for delivery states
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: typography.fontSize.caption,
    color: colors.text.light,
    fontWeight: typography.fontWeight.semiBold,
  },
  
  // Notifications section
  notificationsList: {
    marginTop: spacing.xs,
  },
  
  // Notification item layout
  notificationItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.notification,
    marginRight: spacing.sm,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: typography.fontSize.body,
    color: colors.text.primary,
  },
  notificationDate: {
    fontSize: typography.fontSize.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  
  // Empty state display
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  
  // Action button for creating new packages
  newPackageButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    alignItems: 'center',
  },
  newPackageButtonText: {
    color: '#fff',
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.caption,
  }
});

export default styles;