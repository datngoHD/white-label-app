import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { withUniwind } from 'uniwind';

import { useTheme } from '@core/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';
type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse' | 'error' | 'success';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  bold?: boolean;
  center?: boolean;
  className?: string;
}

const TextBase: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  bold = false,
  center = false,
  style,
  ...props
}) => {
  const theme = useTheme();

  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.colors.text.primary;
      case 'secondary':
        return theme.colors.text.secondary;
      case 'disabled':
        return theme.colors.text.disabled;
      case 'inverse':
        return theme.colors.text.inverse;
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.text.primary;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'body':
        return styles.body;
      case 'bodySmall':
        return styles.bodySmall;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      default:
        return styles.body;
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color: getColor() },
        bold && styles.bold,
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const Text = withUniwind(TextBase);

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
  },
  center: {
    textAlign: 'center',
  },
});
