import { ROUTES } from './routes';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type ClientTabParamList = {
  [ROUTES.CLIENT.HOME]: undefined;
  [ROUTES.CLIENT.PACKAGE_REGISTRATION]: undefined;
  [ROUTES.CLIENT.PACKAGE_TRACKING]: undefined;
  [ROUTES.CLIENT.PROFILE]: undefined;
};

export type ClientStackParamList = {
  [ROUTES.CLIENT.PACKAGE_TRACKING_LIST]: undefined;
  [ROUTES.CLIENT.PACKAGE_DETAIL]: { package: any };
  [ROUTES.CLIENT.PACKAGE_REGISTRATION_FORM]: undefined;
};

export type DriverTabParamList = {
  [ROUTES.DRIVER.HOME]: undefined;
  [ROUTES.DRIVER.ROUTE_VISUALIZATION]: undefined;
  [ROUTES.DRIVER.PROFILE]: undefined;
};

export type DriverStackParamList = {
  [ROUTES.DRIVER.ROUTE_VISUALIZATION_MAIN]: undefined | { packageId: string };
};

export type RootStackParamList = {
  [ROUTES.AUTH.LOGIN]: undefined;
  [ROUTES.CLIENT.TABS]: undefined;
  [ROUTES.DRIVER.TABS]: undefined;
};

// Navigation props types
export type PackageTrackingScreenNavigationProp = StackNavigationProp<
  ClientStackParamList,
  typeof ROUTES.CLIENT.PACKAGE_TRACKING_LIST
>;

export type PackageDetailScreenRouteProp = RouteProp<
  ClientStackParamList,
  typeof ROUTES.CLIENT.PACKAGE_DETAIL
>;

export type PackageDetailScreenNavigationProp = StackNavigationProp<
  ClientStackParamList,
  typeof ROUTES.CLIENT.PACKAGE_DETAIL
>;
