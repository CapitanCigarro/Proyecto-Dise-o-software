import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../../theme/globalStyles';

// Get screen width for responsive layouts
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header section with navigation and package ID
  header: {
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.section,
    borderBottomLeftRadius: borderRadius.large,
    borderBottomRightRadius: borderRadius.large,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.section,
  },
  
  // Navigation buttons in header
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Package info header with icon and ID
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
    marginRight: spacing.section,
  },
  packageInfo: {
    flex: 1,
  },
  packageId: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  
  // Status indicator with colored dot
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs + 2,
  },
  statusText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
  },
  
  // Main content container
  content: {
    flex: 1,
    padding: spacing.section,
  },
  
  // Tracking timeline container
  trackingContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    padding: spacing.section,
    marginBottom: spacing.section,
    ...shadows.small,
  },
  trackingTimeline: {
    position: 'relative',
    paddingLeft: 30,
    marginTop: spacing.sm + 2,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 15,
    bottom: 15,
    width: 2,
    backgroundColor: colors.border,
    zIndex: 1,
  },
  
  // Individual tracking step in timeline
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl + 5,
    position: 'relative',
    zIndex: 2,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.section,
    marginLeft: -15,
  },
  stepCompleted: {
    backgroundColor: colors.status.delivered,
  },
  stepPending: {
    backgroundColor: colors.border,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  stepDate: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  
  // Delivery metrics display (time, distance, cost)
  deliveryInfoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    padding: spacing.section,
    marginBottom: spacing.section,
    ...shadows.small,
  },
  deliveryInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs + 1,
  },
  deliveryInfoText: {
    marginLeft: spacing.sm + 2,
  },
  deliveryInfoLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
  },
  deliveryInfoValue: {
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  
  // Section containers with titles
  section: {
    marginBottom: spacing.section,
  },
  sectionTitle: {
    fontSize: typography.fontSize.subheading,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm + 2,
    color: colors.text.primary,
    paddingHorizontal: spacing.xs + 1,
  },
  
  // Package details card with specifications
  detailCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    padding: spacing.section,
    ...shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 2,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  
  // Origin and destination address card
  addressCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    padding: spacing.section,
    ...shadows.small,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm + 2,
  },
  addressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: `${colors.primary}22`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.section,
  },
  addressDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs + 1,
    marginLeft: 45,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.text.secondary,
  },
  addressText: {
    fontSize: typography.fontSize.body - 1,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  addressSecondary: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  
  // Package description card
  descriptionCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    padding: spacing.section,
    ...shadows.small,
    marginBottom: spacing.section,
  },
  description: {
    fontSize: typography.fontSize.body - 1,
    color: colors.text.primary,
    lineHeight: 22,
  },
});

export default styles;