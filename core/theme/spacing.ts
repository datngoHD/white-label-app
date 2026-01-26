import { Spacing } from '../types';

/**
 * Default spacing scale (in pixels)
 * Based on 4px base unit
 */
export const defaultSpacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Common layout constants
 */
export const layout = {
  screenPadding: 16,
  cardPadding: 16,
  inputHeight: 48,
  buttonHeight: 48,
  headerHeight: 56,
  tabBarHeight: 64,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;

/**
 * Create spacing settings from partial overrides
 */
export const createSpacing = (
  overrides?: Partial<Spacing>,
  base: Spacing = defaultSpacing
): Spacing => {
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
  };
};
