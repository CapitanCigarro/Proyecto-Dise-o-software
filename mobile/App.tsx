import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';

// Import navigation components
import { ClientTabNavigator } from './src/navigation/ClientTabNavigator';
import { DriverTabNavigator } from './src/navigation/DriverTabNavigator';
import { ROUTES } from './src/navigation/routes';
import { RootStackParamList } from './src/navigation/types';
import { NavigationStyles } from './src/navigation/NavigationStyles';

// Import auth context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import screens
import Login from './src/screens/Login';

const Stack = createStackNavigator<RootStackParamList>();

// Main navigation component
const AppNavigator = () => {
  const { isLoading, userToken, userRole } = useAuth();

  if (isLoading) {
    return (
      <View style={NavigationStyles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <Stack.Screen name={ROUTES.AUTH.LOGIN} component={Login} />
        ) : userRole === 'cliente' ? (
          <Stack.Screen name={ROUTES.CLIENT.TABS} component={ClientTabNavigator} />
        ) : (
          <Stack.Screen name={ROUTES.DRIVER.TABS} component={DriverTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Root component wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}