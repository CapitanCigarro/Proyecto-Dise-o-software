import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

// Get screen dimensions for responsive layouts
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header section with title and subtitle
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.section,
    paddingBottom: spacing.xs - 4,
  },
  title: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  
  // Statistics cards container for delivery metrics
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  statsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    padding: spacing.sm,
    alignItems: 'center',
    width: '30%',
    ...shadows.small,
  },
  statsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  statsNumber: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    marginVertical: spacing.xs - 1,
    color: colors.text.primary,
  },
  statsLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Route summary card with delivery route information
  routeSummaryCard: {
    backgroundColor: colors.background.card,
    margin: spacing.xl,
    marginBottom: spacing.xxl,
    borderRadius: borderRadius.medium,
    ...shadows.small,
    overflow: 'hidden',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  summarySubtitle: {
    fontSize: typography.fontSize.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs - 2,
  },
  
  // Progress indicator for route completion
  summaryStatus: {
    alignItems: 'flex-end',
  },
  progressContainer: {
    width: 100,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.status.delivered,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  
  // Route details information with time and distance
  summaryDetails: {
    flexDirection: 'row',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItemText: {
    marginLeft: spacing.sm,
  },
  summaryItemLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
  },
  summaryItemValue: {
    fontSize: typography.fontSize.bodySmall + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  
  // Container for listing package deliveries
  listContainer: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large + 4,
    paddingTop: spacing.xxl - 4,
    ...shadows.medium,
    marginHorizontal: spacing.section + 5,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.section + 5,
    marginBottom: spacing.xl,
  },
  listTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  listSubtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  packagesList: {
    padding: spacing.xl,
    paddingBottom: spacing.section * 2,
  },
  
  // Individual package card styles
  packageItem: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.xl,
    ...shadows.small,
    overflow: 'hidden',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  packageIdContainer: {
    flex: 1,
  },
  packageId: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dateIcon: {
    marginRight: spacing.xs,
  },
  packageDate: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.tertiary,
  },
  
  // Status badge showing package delivery status
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 15,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: typography.fontWeight.semiBold,
    fontSize: typography.fontSize.tiny,
  },
  
  // Package content details styles
  packageDetails: {
    padding: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  detailIcon: {
    width: 24,
    marginRight: spacing.sm,
  },
  recipientText: {
    fontSize: typography.fontSize.bodySmall + 1,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    flex: 1,
  },
  addressText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
  descriptionText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    flex: 1,
  },
  
  // Action buttons container for package operations
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  actionDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  actionText: {
    color: colors.primary,
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.medium,
  },
  
  // Modal for package status updates
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: borderRadius.large + 4,
    borderTopRightRadius: borderRadius.large + 4,
    padding: spacing.section + 5,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  modalTitle: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  
  // Package summary in the status update modal
  packageSummary: {
    backgroundColor: '#f9f9f9',
    padding: spacing.xl,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.xxl,
  },
  modalPackageId: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  modalPackageDestination: {
    fontSize: typography.fontSize.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  modalPackageAddress: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  
  // Status option selector in modal
  statusOptionDivider: {
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  statusOptionDividerText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.md,
  },
  statusOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  statusOptionContent: {
    flex: 1,
  },
  statusOptionText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statusOptionDescription: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  
  // Loading state container
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.section * 2,
  },
  loaderText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.body,
    color: colors.text.secondary,
  },
  
  // Empty state when no packages are available
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.section * 2,
    minHeight: 300,
  },
  emptyImage: {
    width: 96,
    height: 96,
    marginBottom: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Empty timeline state when all deliveries are completed
  timelineEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.section,
  },
  timelineEmptyText: {
    fontSize: typography.fontSize.bodySmall + 1,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  timelineEmptySubtext: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  
  // "View all" button for navigation
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  
  // Next delivery card styles
  nextDeliveryContainer: {
    marginBottom: spacing.xxl,
  },
  nextDeliveryCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    marginTop: -spacing.xl,
  },
  nextDeliveryContent: {
    padding: spacing.xl,
  },
  nextDeliveryTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  nextDeliveryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nextDeliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Primary action button (blue background)
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...shadows.small,
    marginHorizontal: spacing.section,  
  },
  primaryButtonText: {
    color: colors.text.light,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.bodySmall,
    marginLeft: spacing.sm,
  },
  
  // Secondary action button (outlined)
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: spacing.section, 
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.bodySmall,
    marginLeft: spacing.sm,
  },
});

export default styles;