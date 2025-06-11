import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';

import PackageTracking from '../screens/client/PackageTracking/PackageTracking';
import PackageDetail from '../screens/client/PackageDetail/PackageDetail'; 
import PackageRegistration from '../screens/client/PackageRegistration/PackageRegistration';
import ClientHome from '../screens/client/ClientHome/ClientHome';

// Type definitions for client navigation stack parameters
export type ClientStackParamList = {
  [ROUTES.CLIENT.PACKAGE_TRACKING_LIST]: undefined;
  [ROUTES.CLIENT.PACKAGE_DETAIL]: { package: any };
  [ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM]: undefined;
};

// Type definitions for home navigation stack parameters
export type ClientHomeStackParamList = {
  [ROUTES.CLIENT.HOME]: undefined;
  [ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM]: undefined;
};

// Creates the stack navigator instance for client routes
const ClientStack = createStackNavigator<ClientStackParamList>();
const HomeStack = createStackNavigator<ClientHomeStackParamList>();

// Navigation stack for package tracking and details screens
export const PackageTrackingStack = () => {
  return (
    <ClientStack.Navigator 
      initialRouteName={ROUTES.CLIENT.PACKAGE_TRACKING_LIST}
      screenOptions={{ headerShown: false }}
    >
      <ClientStack.Screen
        name={ROUTES.CLIENT.PACKAGE_TRACKING_LIST}
        component={PackageTracking}
      />
      <ClientStack.Screen
        name={ROUTES.CLIENT.PACKAGE_DETAIL}
        component={PackageDetail}
      />
      <ClientStack.Screen
        name={ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM}
        component={PackageRegistration}
      />
    </ClientStack.Navigator>
  );
};

// Navigation stack for home screen and package registration
export const ClientHomeStack = () => {
  return (
    <HomeStack.Navigator 
      initialRouteName={ROUTES.CLIENT.HOME}
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen
        name={ROUTES.CLIENT.HOME}
        component={ClientHome}
      />
      <HomeStack.Screen
        name={ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM}
        component={PackageRegistration}
      />
    </HomeStack.Navigator>
  );
};