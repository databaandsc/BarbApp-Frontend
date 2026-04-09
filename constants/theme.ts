import { Platform } from 'react-native';

/**
 * Global Design System Tokens
 * 
 * Defined as constants to ensure visual consistency across the entire application.
 * Centralizing these tokens allows for effortless global UI updates (e.g., re-branding)
 * and maintains the 'Premium Dark' aesthetic designed for BarbApp.
 */
export const Colors = {
  background: '#2A2C30',    // Main background (Dark charcoal)
  surface: '#36393F',       // Container/Input background (Soft grey)
  primary: '#C5B396',       // High-emphasis elements (Gold/Sand accent)
  text: '#EAEAEA',          // High-contrast text
  textMuted: '#9CA3AF',     // Low-emphasis/Placeholder text
  error: '#F44336',         // Warning/Error semantic color (Rojo)
  success: '#4CAF50',       // Confirmation/Success semantic color (Verde)
  warning: '#FFC107',       // Alert/Pending semantic color (Amarillo)
};

/**
 * Typography Tokens
 * 
 * Leverages system-native sans-serif fonts to optimize performance
 * and provide a familiar user experience across different operating systems.
 */
export const Fonts = Platform.select({
  ios: { sans: 'system-ui' },
  default: { sans: 'normal' },
});


