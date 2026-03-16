

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


/**
 * BarbApp Global Color Palette
 * Based on the Premium Dark design
 */
export const Colors = {
  background: '#2A2C30',    // Dark charcoal
  surface: '#36393F',       // Lighter grey for inputs
  primary: '#C5B396',       // Gold/Sand accent
  text: '#EAEAEA',          // Off-white
  textMuted: '#9CA3AF',     // Muted grey
  error: '#EF4444',
  success: '#10B981',
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui' },
  default: { sans: 'normal' },
});

  
