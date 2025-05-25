import { StyleSheet } from 'react-native';

// Styles for the navigation components
export const NavigationStyles = StyleSheet.create({
  // Bottom tab bar styling
  tabBar: {
    display: 'flex',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  
  // Container for screen content
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});