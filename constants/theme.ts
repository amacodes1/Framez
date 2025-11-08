export const Colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#f8f8f8',
  surface: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  border: '#f0f0f0',
  error: '#FF3B30',
  success: '#34C759',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
};