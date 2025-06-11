import { apiRequest } from './api';

/**
 * Service for handling authentication and user account operations
 */
export const authService = {
  /**
   * Authenticate user with credentials and role selection
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
   * Send password recovery email to user
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
   * Create new user account with provided information
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