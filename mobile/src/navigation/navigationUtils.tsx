import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from './routes';

type IconName = keyof typeof Ionicons.glyphMap;

type IconMapping = {
  [key: string]: {
    default: IconName;
    focused: IconName;
  };
};

const CLIENT_ICONS: IconMapping = {
  [ROUTES.CLIENT.HOME]: { default: 'home-outline', focused: 'home' },
  [ROUTES.CLIENT.PACKAGE_REGISTRATION]: { default: 'add-circle-outline', focused: 'add-circle' },
  [ROUTES.CLIENT.PACKAGE_TRACKING]: { default: 'locate-outline', focused: 'locate' },
  [ROUTES.CLIENT.PROFILE]: { default: 'person-outline', focused: 'person' },
};

const DRIVER_ICONS: IconMapping = {
  [ROUTES.DRIVER.HOME]: { default: 'home-outline', focused: 'home' },
  [ROUTES.DRIVER.ROUTE_VISUALIZATION]: { default: 'map-outline', focused: 'map' },
  [ROUTES.DRIVER.PROFILE]: { default: 'person-outline', focused: 'person' },
};

export const getClientTabIcon = (route: string, focused: boolean) => {
  const iconConfig = CLIENT_ICONS[route] || { default: 'help-outline', focused: 'help' };
  const iconName = focused ? iconConfig.focused : iconConfig.default;
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={iconName} size={size} color={color} />
  );
};

export const getDriverTabIcon = (route: string, focused: boolean) => {
  const iconConfig = DRIVER_ICONS[route] || { default: 'help-outline', focused: 'help' };
  const iconName = focused ? iconConfig.focused : iconConfig.default;
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={iconName} size={size} color={color} />
  );
};