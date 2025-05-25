import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions for responsive layouts
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header section with title and subtitle
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  
  // Statistics cards container for delivery metrics
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 3,
    color: '#333',
  },
  statsLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  
  // Route summary card with delivery route information
  routeSummaryCard: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summarySubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  
  // Progress indicator for route completion
  summaryStatus: {
    alignItems: 'flex-end',
  },
  progressContainer: {
    width: 100,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5cb85c',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  
  // Route details information with time and distance
  summaryDetails: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItemText: {
    marginLeft: 10,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryItemValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Container for listing package deliveries
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  packagesList: {
    padding: 15,
    paddingBottom: 30,
  },
  
  // Individual package card styles
  packageItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  packageIdContainer: {
    flex: 1,
  },
  packageId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateIcon: {
    marginRight: 4,
  },
  packageDate: {
    fontSize: 12,
    color: '#999',
  },
  
  // Status badge showing package delivery status
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  
  // Package content details styles
  packageDetails: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailIcon: {
    width: 24,
    marginRight: 8,
  },
  recipientText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    flex: 1,
  },
  
  // Action buttons container for package operations
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  actionText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Modal for package status updates
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  
  // Package summary in the status update modal
  packageSummary: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalPackageId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalPackageDestination: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  modalPackageAddress: {
    fontSize: 14,
    color: '#777',
  },
  
  // Status option selector in modal
  statusOptionDivider: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  statusOptionDividerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusOptionContent: {
    flex: 1,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  
  // Loading state container
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  
  // Empty state when no packages are available
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    minHeight: 300,
  },
  emptyImage: {
    width: 96,
    height: 96,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  // Empty timeline state when all deliveries are completed
  timelineEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timelineEmptyText: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  timelineEmptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  
  // "View all" button for navigation
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
  
  // Next delivery card styles
  nextDeliveryContainer: {
    marginBottom: 20,
  },
  nextDeliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nextDeliveryContent: {
    padding: 15,
  },
  nextDeliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  nextDeliveryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextDeliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Primary action button (blue background)
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 20,  
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  
  // Secondary action button (outlined)
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20, 
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default styles;