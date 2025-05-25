import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  // Main container for the entire screen
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header section with title and subtitle
  header: {
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 10,
  },
  headerContent: {
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  
  // Collapsed header state for scrolling
  collapsedHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    bottom: 0,
  },
  
  // Header action buttons container
  headerActions: {
    position: 'absolute',
    right: 20,
    bottom: 15,
    flexDirection: 'row',
  },
  sortButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Sort options dropdown menu
  sortOptionsContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
    width: 210,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedSortOption: {
    backgroundColor: '#f0f7ff',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSortOptionText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  
  // Search bar for finding packages
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  
  // Status filter buttons row
  filterContainer: {
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterIcon: {
    marginRight: 5,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Search results counter
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Package list container
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  
  // Date group headers for package lists
  dateHeader: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 5,
    marginTop: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  
  // Individual package card
  packageItem: {
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  
  // Package card header with ID and status
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  packageId: {
    flex: 1,
  },
  idText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Package status indicator
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  // Package details section
  packageDetails: {
    padding: 15,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 10,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  
  // Footer for package card with timestamp
  packageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  packageFooterText: {
    fontSize: 12,
    color: '#999',
    marginRight: 5,
  },
  
  // Loading state container
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  
  // Error state display
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Empty state when no packages found
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Register new package button
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 5,
  },
  registerButtonIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Floating action button for quick actions
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default styles;