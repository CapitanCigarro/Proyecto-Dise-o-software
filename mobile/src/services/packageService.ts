import { apiRequest } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Service for handling all package-related API operations
 */
export const packageService = {
  /**
   * Fetch available shipping routes from the server
   */
  getRoutes: async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const { token } = JSON.parse(userInfo || '{}');
      
      return await apiRequest(
        '/rutas',
        'GET',
        null,
        { 'Authorization': `Bearer ${token}` }
      );
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  /**
   * Register a new package in the system
   */
  createPackage: async (packageData) => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const { token } = JSON.parse(userInfo || '{}');
      
      return await apiRequest(
        '/paquetes',
        'POST',
        packageData,
        { 'Authorization': `Bearer ${token}` }
      );
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },

  /**
   * Retrieve all packages associated with a specific user email
   */
  getUserPackages: async (userEmail) => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const { token } = JSON.parse(userInfo || '{}');
      
      return await apiRequest(
        `/paquetes/${userEmail}`,
        'GET',
        null,
        { 'Authorization': `Bearer ${token}` }
      );
    } catch (error) {
      console.error('Error fetching user packages:', error);
      throw error;
    }
  },
};