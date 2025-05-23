import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ClientHome from '../screens/client/ClientHome';
import ClientProfile from '../screens/client/ClientProfile';
import { PackageTrackingStack, PackageRegistrationStack } from './ClientStackNavigator';

import { NavigationStyles } from './NavigationStyles';
import { getClientTabIcon } from './navigationUtils';
import { ROUTES } from './routes';
import { ClientTabParamList } from './types';

const ClientTab = createBottomTabNavigator<ClientTabParamList>();

export const ClientTabNavigator = () => {
  return (
    <ClientTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return getClientTabIcon(route.name, focused)({ color, size });
        },
        tabBarStyle: NavigationStyles.tabBar,
        headerShown: false, // Ocultar todos los headers del TabNavigator
      })}
    >
      <ClientTab.Screen 
        name={ROUTES.CLIENT.HOME} 
        component={ClientHome}
      />
      <ClientTab.Screen 
        name={ROUTES.CLIENT.PACKAGE_REGISTRATION} 
        component={PackageRegistrationStack}
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