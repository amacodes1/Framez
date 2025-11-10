export const Colors = {
  // Primary brand colors
  primary: '#E1306C', // Instagram pink
  secondary: '#1DA1F2', // Twitter blue
  accent: '#405DE6', // Instagram purple
  
  // Background colors
  background: '#000000', // Dark background
  backgroundLight: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2A2A2A',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#8E8E93',
  
  // UI colors
  border: '#38383A',
  borderLight: '#48484A',
  divider: '#2C2C2E',
  
  // Status colors
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  
  // Gradient colors
  gradientStart: '#833AB4',
  gradientMiddle: '#FD1D1D',
  gradientEnd: '#FCB045',
  
  // Interactive colors
  like: '#FF3040',
  comment: '#8E8E93',
  share: '#1DA1F2',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};