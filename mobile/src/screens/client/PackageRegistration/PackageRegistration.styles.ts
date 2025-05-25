import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container for the package registration screen
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header bar with screen title
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Progress indicator showing current step in registration flow
  progressContainer: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepCircleActive: {
    backgroundColor: '#007AFF',
  },
  stepCircleInactive: {
    backgroundColor: '#e0e0e0',
  },
  stepText: {
    fontSize: 12,
  },
  stepTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  stepTextInactive: {
    color: '#999',
  },
  
  // Progress bar showing overall completion
  progressBarContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  
  // Form container for input fields
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stepContainer: {
    padding: 20,
  },
  
  // Input field styling and groups
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  
  // Address input with clear button
  addressInputContainer: {
    position: 'relative',
  },
  addressInput: {
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  
  // Error state for form validation
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 5,
  },
  
  // Multiline text area input
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // Navigation buttons for form steps
  navigationButtons: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navigationButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#ff3b3018',
    borderWidth: 1,
    borderColor: '#ff3b3050',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  navigationButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  backButtonText: {
    color: '#666',
  },
  cancelButtonText: {
    color: '#ff3b30',
  },
  
  // Address suggestions dropdown
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 120,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  
  // Information box for additional guidance
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    lineHeight: 20,
  },
  
  // Package type selection options
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  packageTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  packageTypeOption: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  packageTypeSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  packageTypeText: {
    marginTop: 5,
    color: '#666',
    fontSize: 14,
  },
  packageTypeTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  
  // Package dimensions input row
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Cost estimation display
  costEstimation: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  costEstimationText: {
    fontSize: 16,
    color: '#333',
  },
  costEstimationAmount: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  costEstimationNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  
  // Review form section for final confirmation
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  reviewSection: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 5,
  },
  reviewRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewLabel: {
    fontSize: 15,
    color: '#666',
    width: 100,
  },
  reviewValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  
  // Cost summary display in review
  costSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
  },
  costSummaryLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  costSummaryValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Terms confirmation checkbox
  confirmationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmationText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  
  // Loading indicator modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default styles;