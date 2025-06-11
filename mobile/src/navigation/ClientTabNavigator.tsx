import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ClientHomeStack, PackageTrackingStack } from './ClientStackNavigator';
import ClientProfile from '../screens/client/ClientProfile/ClientProfile';

import { NavigationStyles } from './Navigation.styles';
import { getClientTabIcon } from './navigationUtils';
import { ROUTES } from './routes';
import { ClientTabParamList } from './types';

// Create tab navigator for client application screens
const ClientTab = createBottomTabNavigator<ClientTabParamList>();

// Main tab navigation component for client user interface
export const ClientTabNavigator = () => {
  return (
    <ClientTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return getClientTabIcon(route.name, focused)({ color, size });
        },
        tabBarStyle: NavigationStyles.tabBar,
        headerShown: false, 
      })}
    >
      <ClientTab.Screen 
        name={ROUTES.CLIENT.HOME} 
        component={ClientHomeStack}
      />
      <ClientTab.Screen 
        name={ROUTES.CLIENT.PACKAGE_TRACKING} 
        component={PackageTrackingStack}
      />
      <ClientTab.Screen 
        name={ROUTES.CLIENT.PROFILE} 
        component={ClientProfile}
      />
    </ClientTab.Navigator>
  );
};