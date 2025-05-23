import React from 'react';
import { SafeAreaView, StyleSheet, View, Platform, StatusBar } from 'react-native';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: any;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, style }) => {
  // En iOS usamos SafeAreaView, en Android aplicamos un paddingTop
  if (Platform.OS === 'ios') {
    return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
  } else {
    return (
      <View style={[styles.container, { paddingTop: StatusBar.currentHeight || 0 }, style]}>
        {children}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default SafeAreaWrapper;