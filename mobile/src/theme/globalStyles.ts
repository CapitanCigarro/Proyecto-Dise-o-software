export const colors = {
  // Primary colors
  primary: '#007AFF',  // Azul principal
  
  // Background colors
  background: {
    main: '#f5f5f5',
    card: '#fff',
  },
  
  // Text colors
  text: {
    primary: '#333',
    secondary: '#666',
    tertiary: '#999',
    light: '#fff',
  },
  
  // UI elements
  border: '#f0f0f0',
  shadow: '#000',
  
  // Status colors - colores para indicadores de estado
  status: {
    delivered: '#4CAF50',   // Verde - entregado
    inProgress: '#FF9800',  // Naranja - en progreso
    pending: '#F44336',     // Rojo - pendiente
    info: '#2196F3'         // Azul - información
  },
  
  // Notification dot
  notification: '#007AFF',  // Mismo azul que primary para el punto de notificación
  
  // General palette if needed elsewhere
  palette: {
    blue: '#007AFF',
    green: '#4CAF50',
    orange: '#FF9800',
    red: '#F44336',
  }
};

export const typography = {
  fontSize: {
    heading: 24,
    title: 20,      // Añadido porque lo usas en sectionTitle
    subheading: 18,
    body: 16,
    bodySmall: 14,
    caption: 13,
    tiny: 12,
  },
  fontWeight: {
    regular: 'normal',
    medium: '500',
    semiBold: '600',  // Corregido a 'semiBold' como se usa en statusBadgeText
    bold: 'bold',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 15,
};

export const borderRadius = {
  small: 6,
  medium: 12,
  large: 16,
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};