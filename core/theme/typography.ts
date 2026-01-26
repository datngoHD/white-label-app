import { Typography } from '../types';

/**
 * Default typography settings
 * Can be overridden by brand/tenant theme configuration
 */
export const defaultTypography: Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

/**
 * Font weights mapped to React Native values
 */
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Line heights relative to font size
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Create typography settings from partial overrides
 */
export const createTypography = (
  overrides?: Partial<Typography>,
  base: Typography = defaultTypography
): Typography => {
  if (!overrides) return base;

  return {
    fontFamily: {
      ...base.fontFamily,
      ...overrides.fontFamily,
    },
    fontSize: {
      ...base.fontSize,
      ...overrides.fontSize,
    },
  };
};
