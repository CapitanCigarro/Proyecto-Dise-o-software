import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from './routes';

// Type definition for Ionicons names
type IconName = keyof typeof Ionicons.glyphMap;

// Interface for mapping routes to their icon states
type IconMapping = {
  [key: string]: {
    default: IconName;
    focused: IconName;
  };
};

// Icon configuration for client navigation tabs
const CLIENT_ICONS: IconMapping = {
  [ROUTES.CLIENT.HOME]: { default: 'home-outline', focused: 'home' },
  [ROUTES.CLIENT.PACKAGE_REGISTRATION]: { default: 'add-circle-outline', focused: 'add-circle' },
  [ROUTES.CLIENT.PACKAGE_TRACKING]: { default: 'locate-outline', focused: 'locate' },
  [ROUTES.CLIENT.PROFILE]: { default: 'person-outline', focused: 'person' },
};

// Icon configuration for driver navigation tabs
const DRIVER_ICONS: IconMapping = {
  [ROUTES.DRIVER.HOME]: { default: 'home-outline', focused: 'home' },
  [ROUTES.DRIVER.ROUTE_VISUALIZATION]: { default: 'map-outline', focused: 'map' },
  [ROUTES.DRIVER.PROFILE]: { default: 'person-outline', focused: 'person' },
};

// Returns appropriate icon component for client navigation tabs based on route and focus state
export const getClientTabIcon = (route: string, focused: boolean) => {
  const iconConfig = CLIENT_ICONS[route] || { default: 'help-outline', focused: 'help' };
  const iconName = focused ? iconConfig.focused : iconConfig.default;
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={iconName} size={size} color={color} />
  );
};

// Returns appropriate icon component for driver navigation tabs based on route and focus state
export const getDriverTabIcon = (route: string, focused: boolean) => {
  const iconConfig = DRIVER_ICONS[route] || { default: 'help-outline', focused: 'help' };
  const iconName = focused ? iconConfig.focused : iconConfig.default;
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={iconName} size={size} color={color} />
  );
};