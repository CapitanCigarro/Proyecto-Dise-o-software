import { StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions for responsive layouts
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header bar with title
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  
  // Tab navigation between list and map views
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF20',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  
  // Main content container for list view
  content: {
    flex: 1,
    padding: 15,
    paddingTop: 5,
  },
  
  // Destination card with step indicator
  destinationCard: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  // Step indicator showing delivery progress
  stepIndicatorContainer: {
    alignItems: 'center',
    paddingRight: 15,
    paddingTop: 20,
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999',
    marginBottom: 5,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Step indicator status variants
  stepPending: {
    backgroundColor: '#999',
  },
  stepCurrent: {
    backgroundColor: '#f0ad4e',
  },
  stepCompleted: {
    backgroundColor: '#5cb85c',
  },
  
  // Vertical line connecting step indicators
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
  },
  stepConnectorCompleted: {
    backgroundColor: '#5cb85c',
  },
  
  // Card content area for destination details
  destinationCardContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  
  // Header section of the destination card
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  destinationId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  destinationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  
  // Status badge indicating delivery status
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  
  // Content section of the destination card
  destinationDetails: {
    padding: 15,
  },
  
  // Detail items with icons
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 18,
    marginRight: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Loading indicator container
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  
  // Horizontal scrolling destination cards on map view
  mapDestinationsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    maxHeight: 160,
  },
  mapDestinationsContent: {
    paddingHorizontal: 15,
  },
  
  // Individual destination card in map view
  mapDestinationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // Map destination step indicator
  mapDestinationIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  
  // Status variants for map destination indicators
  mapDestinationPending: {
    backgroundColor: '#999',
  },
  mapDestinationCurrent: {
    backgroundColor: '#f0ad4e',
  },
  mapDestinationCompleted: {
    backgroundColor: '#5cb85c',
  },
  mapDestinationNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Content area for map destination cards
  mapDestinationContent: {
    flex: 1,
  },
  mapDestinationId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  mapDestinationAddress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  
  // Recipient details in map destination card
  mapDestinationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  mapDestinationPerson: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  
  // Footer with distance and time metrics
  mapDestinationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  mapDestinationMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapDestinationMetricText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
  }
});

export default styles;