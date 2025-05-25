import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container for the entire home screen
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Welcome header with user greeting
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  
  // Stats overview cards showing delivery metrics
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  statIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.7,
  },
  
  // Content section cards for packages and notifications
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 15,
    marginTop: 5,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  
  // Packages list container
  packagesList: {
    marginTop: 5,
  },
  
  // Individual package item in list
  packageItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  packageDestination: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  packageDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  
  // Status badge for delivery status
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  
  // Notifications list container
  notificationsList: {
    marginTop: 5,
  },
  
  // Individual notification item
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  
  // Empty state when no data is available
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
  },
  
  // New package creation button
  newPackageButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  newPackageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  }
});

export default styles;