import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';

import { ClientTabNavigator } from './src/navigation/ClientTabNavigator';
import { DriverTabNavigator } from './src/navigation/DriverTabNavigator';
import { ROUTES } from './src/navigation/routes';
import { RootStackParamList } from './src/navigation/types';
import { NavigationStyles } from './src/navigation/Navigation.styles';

import { AuthProvider, useAuth } from './src/context/AuthContext';

import Login from './src/screens/Login/Login';

// Create main stack navigator for the application
const Stack = createStackNavigator<RootStackParamList>();

// Main navigation component that handles authentication flow and role-based routing
const AppNavigator = () => {
  const { isLoading, userToken, userRole } = useAuth();

  // Display loading indicator while authentication state is being determined
  if (isLoading) {
    return (
      <View style={NavigationStyles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Main navigation container with conditional routing based on authentication state
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

// Root component that provides authentication context to the entire application
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}