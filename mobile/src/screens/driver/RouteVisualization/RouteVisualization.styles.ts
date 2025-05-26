import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

// Get screen dimensions for responsive layouts
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header bar with title
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
    textAlign: 'center',
  },
  
  // Tab navigation between list and map views
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.section,
    paddingBottom: spacing.sm + 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    marginRight: spacing.sm + 2,
  },
  activeTab: {
    backgroundColor: `${colors.primary}20`,
  },
  tabText: {
    marginLeft: spacing.xs + 1,
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  
  // Main content container for list view
  content: {
    flex: 1,
    padding: spacing.section,
    paddingTop: spacing.xs + 1,
  },
  
  // Destination card with step indicator
  destinationCard: {
    flexDirection: 'row',
    marginBottom: spacing.section,
  },
  
  // Step indicator showing delivery progress
  stepIndicatorContainer: {
    alignItems: 'center',
    paddingRight: spacing.section,
    paddingTop: spacing.xl,
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.text.tertiary,
    marginBottom: spacing.xs + 1,
  },
  stepNumber: {
    color: colors.text.light,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.bodySmall,
  },
  
  // Step indicator status variants
  stepPending: {
    backgroundColor: colors.text.tertiary,
  },
  stepCurrent: {
    backgroundColor: colors.palette.orange,
  },
  stepCompleted: {
    backgroundColor: colors.palette.green,
  },
  
  // Vertical line connecting step indicators
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.palette.green,
  },
  
  // Card content area for destination details
  destinationCardContent: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    ...shadows.small,
    overflow: 'hidden',
  },
  
  // Header section of the destination card
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.section,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  destinationId: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  destinationAddress: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs - 1,
  },
  
  // Status badge indicating delivery status
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    marginRight: spacing.xs,
  },
  statusText: {
    fontWeight: typography.fontWeight.semiBold,
    fontSize: typography.fontSize.tiny,
  },
  
  // Content section of the destination card
  destinationDetails: {
    padding: spacing.section,
  },
  
  // Detail items with icons
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailIcon: {
    width: 18,
    marginRight: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs + 1,
  },
  detailText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  
  // Loading indicator container
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loaderText: {
    marginTop: spacing.section,
    color: colors.text.secondary,
    fontSize: typography.fontSize.body,
  },
  
  // Map view container
  mapContainer: {
    flex: 1,
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  
  // Map overlay for user interaction hints
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: 20,
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  
  // Horizontal scrolling destination cards on map view
  mapDestinationsContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    maxHeight: 160,
  },
  mapDestinationsContent: {
    paddingHorizontal: spacing.section,
  },
  
  // Individual destination card in map view
  mapDestinationCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    padding: spacing.section,
    marginRight: spacing.section,
    width: 200,
    ...shadows.medium,
  },
  
  // Map destination step indicator
  mapDestinationIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 2,
  },
  
  // Status variants for map destination indicators
  mapDestinationPending: {
    backgroundColor: colors.text.tertiary,
  },
  mapDestinationCurrent: {
    backgroundColor: colors.palette.orange,
  },
  mapDestinationCompleted: {
    backgroundColor: colors.palette.green,
  },
  mapDestinationNumber: {
    color: colors.text.light,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.bodySmall,
  },
  
  // Content area for map destination cards
  mapDestinationContent: {
    flex: 1,
  },
  mapDestinationId: {
    fontSize: typography.fontSize.tiny,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  mapDestinationAddress: {
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs + 1,
  },
  
  // Recipient details in map destination card
  mapDestinationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 1,
  },
  mapDestinationPerson: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
    marginLeft: spacing.xs + 1,
    flex: 1,
  },
  
  // Footer with distance and time metrics
  mapDestinationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs + 1,
  },
  mapDestinationMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapDestinationMetricText: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
    marginLeft: spacing.xs - 1,
  }
});

export default styles;