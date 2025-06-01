import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';

import PackageTracking from '../screens/client/PackageTracking/PackageTracking';
import PackageDetail from '../screens/client/PackageDetail/PackageDetail'; 
import PackageRegistration from '../screens/client/PackageRegistration/PackageRegistration';

// Type definitions for client navigation stack parameters
export type ClientStackParamList = {
  [ROUTES.CLIENT.PACKAGE_TRACKING_LIST]: undefined;
  [ROUTES.CLIENT.PACKAGE_DETAIL]: { package: any };
  [ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM]: undefined;
};

// Creates the stack navigator instance for client routes
const ClientStack = createStackNavigator<ClientStackParamList>();

// Navigation stack for package tracking and details screens
export const PackageTrackingStack = () => {
  return (
    <ClientStack.Navigator screenOptions={{ headerShown: false }}>
      <ClientStack.Screen
        name={ROUTES.CLIENT.PACKAGE_TRACKING_LIST}
        component={PackageTracking}
      />
      <ClientStack.Screen
        name={ROUTES.CLIENT.PACKAGE_DETAIL}
        component={PackageDetail}
      />
    </ClientStack.Navigator>
  );
};

// Navigation stack for package registration functionality
export const PackageRegistrationStack = () => {
  return (
    <ClientStack.Navigator screenOptions={{ headerShown: false }}>
      <ClientStack.Screen
        name={ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM}
        component={PackageRegistration}
      />
    </ClientStack.Navigator>
  );
};