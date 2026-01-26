import { Theme, ColorPalette, Typography, Spacing, ThemeOverrides } from '../types';
import { defaultColors, darkColors, createColorPalette } from './colors';
import { defaultTypography, createTypography } from './typography';
import { defaultSpacing, createSpacing } from './spacing';

/**
 * Default light theme
 */
export const lightTheme: Theme = {
  colors: defaultColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
};

/**
 * Default dark theme
 */
export const darkTheme: Theme = {
  colors: darkColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
};

/**
 * Create a theme from overrides
 */
export const createTheme = (
  overrides?: ThemeOverrides,
  base: Theme = lightTheme
): Theme => {
  if (!overrides) return base;

  return {
    colors: createColorPalette(overrides.colors, base.colors),
    typography: createTypography(overrides.typography, base.typography),
    spacing: base.spacing,
  };
};

/**
 * Merge brand theme with base theme
 */
export const mergeBrandTheme = (
  brandColors?: { primary?: string; secondary?: string; accent?: string },
  base: Theme = lightTheme
): Theme => {
  if (!brandColors) return base;

  return createTheme(
    {
      colors: {
        primary: brandColors.primary,
        secondary: brandColors.secondary,
        accent: brandColors.accent,
      },
    },
    base
  );
};
