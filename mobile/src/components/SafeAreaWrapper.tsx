import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Props interface for the SafeAreaWrapper component
interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: any;
}

// Component that handles safe area insets for consistent UI across different devices
const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      style={[
        styles.container, 
        { paddingTop: insets.top }, 
        style
      ]}
    >
      {children}
    </View>
  );
};

// Base styles for the wrapper component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default SafeAreaWrapper;