import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header section with title and subtitle
  header: {
    backgroundColor: colors.background.card,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.section,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  headerContent: {
    position: 'relative',
  },
  headerTitle: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  
  // Collapsed header state for scrolling
  collapsedHeaderTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    position: 'absolute',
    bottom: 0,
  },
  
  // Header action buttons container
  headerActions: {
    position: 'absolute',
    right: spacing.section,
    bottom: spacing.md,
    flexDirection: 'row',
  },
  sortButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Sort options dropdown menu
  sortOptionsContainer: {
    position: 'absolute',
    top: 120,
    right: spacing.section,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.small,
    ...shadows.small,
    zIndex: 100,
    width: 210,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedSortOption: {
    backgroundColor: colors.primary + '15',
  },
  sortOptionText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.primary,
  },
  selectedSortOptionText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  
  // Search bar for finding packages
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.body,
  },
  
  // Status filter buttons row
  filterContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    backgroundColor: '#eee',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterIcon: {
    marginRight: spacing.xs,
  },
  filterText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.light,
    fontWeight: typography.fontWeight.bold,
  },
  
  // Search results counter
  resultsContainer: {
    paddingHorizontal: spacing.section,
    paddingVertical: spacing.xs,
  },
  resultsText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  
  // Package list container
  listContainer: {
    padding: spacing.md,
    paddingTop: spacing.xs,
  },
  
  // Date group headers for package lists
  dateHeader: {
    backgroundColor: colors.background.main,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.small,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  dateHeaderText: {
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.secondary,
  },
  
  // Individual package card
  packageItem: {
    borderRadius: borderRadius.medium,
    marginBottom: spacing.md,
    ...shadows.small,
    overflow: 'hidden',
  },
  
  // Package card header with ID and status
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  packageId: {
    flex: 1,
  },
  idText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  
  // Package status indicator
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 15,
  },
  statusText: {
    fontSize: typography.fontSize.tiny,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.xs,
  },
  
  // Package details section
  packageDetails: {
    padding: spacing.md,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: spacing.sm,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientText: {
    fontSize: typography.fontSize.body - 1,
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
  
  // Footer for package card with timestamp
  packageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  packageFooterText: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.tertiary,
    marginRight: spacing.xs,
  },
  
  // Loading state container
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.section,
  },
  loaderText: {
    marginTop: spacing.sm,
    color: colors.text.secondary,
    fontSize: typography.fontSize.body,
  },
  
  // Error state display
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.section,
  },
  errorText: {
    fontSize: typography.fontSize.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.section,
    borderRadius: borderRadius.small,
    marginTop: spacing.sm,
  },
  retryButtonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
  
  // Empty state when no packages found
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.section,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: spacing.section,
  },
  emptyTitle: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.section,
  },
  
  // Register new package button
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.section,
    borderRadius: borderRadius.small,
    marginTop: spacing.xs,
  },
  registerButtonIcon: {
    marginRight: spacing.sm,
  },
  registerButtonText: {
    color: colors.text.light,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
  
  // Floating action button for quick actions
  fab: {
    position: 'absolute',
    bottom: spacing.section,
    right: spacing.section,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
});

export default styles;