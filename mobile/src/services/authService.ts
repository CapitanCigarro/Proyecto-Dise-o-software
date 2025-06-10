import { apiRequest } from './api';

/**
 * Authentication service for handling user login, registration, etc.
 */
export const authService = {
  /**
   * Login a user with email and password
   */
  login: async (email: string, password: string, rolSelected: string) => {
    try {
      // Convertir el rol seleccionado a número según tu base de datos
      const rolId = rolSelected === 'cliente' ? 2 : 
                   rolSelected === 'conductor' ? 3 : 2; // Default a cliente (2)
      
      return await apiRequest(
        '/users/login',
        'POST',
        { 
          usuario_correo: email, 
          usuario_password: password,
          usuario_rol: rolId  // Añadir el rol seleccionado
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    try {
      return await apiRequest(
        '/users/reset-password',
        'POST',
        { email }
      );
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  register: async (userData: any) => {
    try {
      return await apiRequest(
        '/users/register',
        'POST',
        userData
      );
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
};