import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ThemeMode, ThemeOverrides } from '../types';
import { lightTheme, darkTheme, createTheme, mergeBrandTheme } from './theme';
import { currentBrand } from '../config/brand.config';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  isDark: false,
  themeMode: 'system',
});

interface ThemeProviderProps {
  children: ReactNode;
  mode?: ThemeMode;
  overrides?: ThemeOverrides;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  mode = 'system',
  overrides,
}) => {
  const systemColorScheme = useColorScheme();

  const value = useMemo(() => {
    // Determine if dark mode
    const isDark =
      mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

    // Start with light or dark base theme
    let baseTheme = isDark ? darkTheme : lightTheme;

    // Apply brand theme colors
    if (currentBrand.theme?.colors) {
      baseTheme = mergeBrandTheme(currentBrand.theme.colors, baseTheme);
    }

    // Apply tenant/runtime overrides
    const theme = overrides ? createTheme(overrides, baseTheme) : baseTheme;

    return {
      theme,
      isDark,
      themeMode: mode,
    };
  }, [mode, systemColorScheme, overrides]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
