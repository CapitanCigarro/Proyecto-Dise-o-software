import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import DriverHome from '../screens/driver/DriverHome/DriverHome';
import RouteVisualization from '../screens/driver/RouteVisualization/RouteVisualization';
import DriverProfile from '../screens/driver/DriverProfile/DriverProfile';

import { NavigationStyles } from './Navigation.styles';
import { ROUTES } from './routes';
import { getDriverTabIcon } from './navigationUtils';
import { DriverTabParamList } from './types';

// Create navigators for driver app screens
const DriverTab = createBottomTabNavigator<DriverTabParamList>();
const DriverStack = createStackNavigator();

// Stack navigator for route visualization screens
const RouteVisualizationStack = () => {
  return (
    <DriverStack.Navigator screenOptions={{ headerShown: false }}>
      <DriverStack.Screen 
        name={ROUTES.DRIVER.ROUTE_VISUALIZATION_MAIN} 
        component={RouteVisualization} 
      />
    </DriverStack.Navigator>
  );
};

// Main tab navigator for driver interface
export const DriverTabNavigator = () => {
  return (
    <DriverTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return getDriverTabIcon(route.name, focused)({ color, size });
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: NavigationStyles.tabBar,
        headerShown: false,
      })}
    >
      <DriverTab.Screen 
        name={ROUTES.DRIVER.HOME} 
        component={DriverHome}
      />
      <DriverTab.Screen 
        name={ROUTES.DRIVER.ROUTE_VISUALIZATION} 
        component={RouteVisualizationStack}
      />
      <DriverTab.Screen 
        name={ROUTES.DRIVER.PROFILE} 
        component={DriverProfile}
      />
    </DriverTab.Navigator>
  );
};