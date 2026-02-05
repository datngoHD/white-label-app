import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Theme } from '../types';
import { useThemeContext } from './theme-provider';

/**
 * Hook to access the current theme
 */
export const useTheme = (): Theme => {
  const { theme } = useThemeContext();
  return theme;
};

/**
 * Hook to check if dark mode is active
 */
export const useIsDarkMode = (): boolean => {
  const { isDark } = useThemeContext();
  return isDark;
};

/**
 * Hook to create themed styles
 * Memoizes styles based on theme changes
 */
export const useThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleCreator: (theme: Theme) => T
): T => {
  const theme = useTheme();
  return useMemo(() => styleCreator(theme), [theme, styleCreator]);
};

/**
 * Hook to get theme colors
 */
export const useColors = () => {
  const { theme } = useThemeContext();
  return theme.colors;
};

/**
 * Hook to get theme typography
 */
export const useTypography = () => {
  const { theme } = useThemeContext();
  return theme.typography;
};

/**
 * Hook to get theme spacing
 */
export const useSpacing = () => {
  const { theme } = useThemeContext();
  return theme.spacing;
};
