import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container for the entire profile screen
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header section with user avatar and basic info
  header: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  role: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    marginBottom: 15,
  },
  
  // User statistics display in header
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 5,
    width: '80%',
    justifyContent: 'center',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  
  // Edit profile button in header
  editProfileButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  
  // Section containers for profile information
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  
  // Card container for info groups
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  
  // Information row layout with icon and text
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  icon: {
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  
  // Preference row with label and toggle
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333',
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  
  // Logout button at bottom of screen
  logoutButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // App version display
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 30,
  },
  
  // Modal for editing profile information
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  
  // Modal header with title and close button
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Form container and input fields
  formContainer: {
    maxHeight: '70%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  
  // Save button for form submission
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default styles;