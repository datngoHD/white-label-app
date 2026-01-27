import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@core/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  onBackPress?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  showLogo?: boolean;
  style?: ViewStyle;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  onBackPress,
  onBack,
  showBack = false,
  showLogo = false,
  style,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const handleBack = onBack || onBackPress;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        !transparent && { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && handleBack && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={[styles.backText, { color: theme.colors.primary }]}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          {showLogo && (
            <Text style={[styles.logoText, { color: theme.colors.primary }]}>
              Logo
            </Text>
          )}
          {leftAction}
        </View>

        <View style={styles.center}>
          <Text
            style={[styles.title, { color: theme.colors.text.primary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: theme.colors.text.secondary }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.right}>{rightAction}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backText: {
    fontSize: 17,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
