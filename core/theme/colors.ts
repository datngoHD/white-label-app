import { ColorPalette } from '../types';

/**
 * Default color palette
 * Can be overridden by brand/tenant theme configuration
 */
export const defaultColors: ColorPalette = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: {
    primary: '#000000',
    secondary: '#6B6B6B',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#007AFF',
};

/**
 * Dark mode color palette
 */
export const darkColors: ColorPalette = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF9F0A',
  background: '#000000',
  surface: '#1C1C1E',
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    disabled: '#3A3A3C',
    inverse: '#000000',
  },
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  info: '#0A84FF',
};

/**
 * Create a color palette from partial overrides
 */
export const createColorPalette = (
  overrides?: Partial<ColorPalette>,
  base: ColorPalette = defaultColors
): ColorPalette => {
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    text: {
      ...base.text,
      ...overrides.text,
    },
  };
};
