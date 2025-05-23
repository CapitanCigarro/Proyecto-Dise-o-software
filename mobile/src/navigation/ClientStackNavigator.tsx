// filepath: c:\Users\slimm\Documents\GitHub\Proyecto-Dise-o-software\mobile\src\navigation\ClientStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';

// Client screens
import PackageTracking from '../screens/client/PackageTracking';
import PackageDetail from '../screens/client/PackageDetail'; 
import PackageRegistration from '../screens/client/PackageRegistration';

export type ClientStackParamList = {
  [ROUTES.CLIENT.PACKAGE_TRACKING_LIST]: undefined;
  [ROUTES.CLIENT.PACKAGE_DETAIL]: { package: any };
  [ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM]: undefined;
};

const ClientStack = createStackNavigator<ClientStackParamList>();

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