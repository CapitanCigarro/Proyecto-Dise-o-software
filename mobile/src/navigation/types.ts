import { ROUTES } from './routes';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Parameters for client tab navigation screens
export type ClientTabParamList = {
  [ROUTES.CLIENT.HOME]: undefined;
  [ROUTES.CLIENT.PACKAGE_REGISTRATION]: undefined;
  [ROUTES.CLIENT.PACKAGE_TRACKING]: undefined;
  [ROUTES.CLIENT.PROFILE]: undefined;
};

// Parameters for client stack navigation screens with their props
export type ClientHomeStackParamList = {
  [ROUTES.CLIENT.HOME_SCREEN]: undefined; // Cambia esto para usar HOME_SCREEN
  [ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM]: undefined;
};

// Parameters for driver tab navigation screens
export type DriverTabParamList = {
  [ROUTES.DRIVER.HOME]: undefined;
  [ROUTES.DRIVER.ROUTE_VISUALIZATION]: undefined;
  [ROUTES.DRIVER.PROFILE]: undefined;
};

// Parameters for driver stack navigation screens with their props
export type DriverStackParamList = {
  [ROUTES.DRIVER.ROUTE_VISUALIZATION_MAIN]: undefined | { packageId: string };
};

// Parameters for root navigation stack defining main application flow
export type RootStackParamList = {
  [ROUTES.AUTH.LOGIN]: undefined;
  [ROUTES.CLIENT.TABS]: undefined;
  [ROUTES.DRIVER.TABS]: undefined;
};

// Navigation prop type for package tracking screen
export type PackageTrackingScreenNavigationProp = StackNavigationProp<
  ClientStackParamList,
  typeof ROUTES.CLIENT.PACKAGE_TRACKING_LIST
>;

// Route prop type for package detail screen
export type PackageDetailScreenRouteProp = RouteProp<
  ClientStackParamList,
  typeof ROUTES.CLIENT.PACKAGE_DETAIL
>;

// Navigation prop type for package detail screen
export type PackageDetailScreenNavigationProp = StackNavigationProp<
  ClientStackParamList,
  typeof ROUTES.CLIENT.PACKAGE_DETAIL
>;
