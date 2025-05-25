import { StyleSheet, Dimensions } from 'react-native';

// Get screen width for responsive layouts
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header section with navigation and package ID
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginRight: 15,
  },
  packageInfo: {
    flex: 1,
  },
  packageId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Status indicator with colored dot
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Main content container
  content: {
    flex: 1,
    padding: 15,
  },
  
  // Tracking timeline container
  trackingContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trackingTimeline: {
    position: 'relative',
    paddingLeft: 30,
    marginTop: 10,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 15,
    bottom: 15,
    width: 2,
    backgroundColor: '#ddd',
    zIndex: 1,
  },
  
  // Individual tracking step in timeline
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    position: 'relative',
    zIndex: 2,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: -15,
  },
  stepCompleted: {
    backgroundColor: '#5cb85c',
  },
  stepPending: {
    backgroundColor: '#ddd',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stepDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  
  // Delivery metrics display (time, distance, cost)
  deliveryInfoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  deliveryInfoText: {
    marginLeft: 10,
  },
  deliveryInfoLabel: {
    fontSize: 12,
    color: '#666',
  },
  deliveryInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  
  // Section containers with titles
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingHorizontal: 5,
  },
  
  // Package details card with specifications
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
  },
  
  // Origin and destination address card
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  addressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    marginLeft: 45,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
    marginBottom: 2,
  },
  addressSecondary: {
    fontSize: 14,
    color: '#666',
  },
  
  // Package description card
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default styles;