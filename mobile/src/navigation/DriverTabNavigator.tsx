import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import driver screens
import DriverHome from '../screens/driver/DriverHome';
import RouteVisualization from '../screens/driver/RouteVisualization';
import DriverProfile from '../screens/driver/DriverProfile';

// Import navigation utilities
import { NavigationStyles } from './NavigationStyles';
import { ROUTES } from './routes';
import { getDriverTabIcon } from './navigationUtils';
import { DriverTabParamList } from './types';

const DriverTab = createBottomTabNavigator<DriverTabParamList>();
const DriverStack = createStackNavigator();

// Route visualization stack to handle map navigation
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
        headerShown: false, // Ocultar todos los headers del TabNavigator
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