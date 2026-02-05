import { ReactNode } from 'react';
import { PressableProps, ViewStyle } from 'react-native';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Text to show during loading (optional) */
  loadingText?: string;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Additional className for Uniwind styling */
  className?: string;
  /** Children - use ButtonText and ButtonIcon for compound pattern */
  children?: ReactNode;
  /** Legacy: title prop for backward compatibility */
  title?: string;
  /** Additional style overrides */
  style?: ViewStyle;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing the result of the action */
  accessibilityHint?: string;
}

export interface ButtonTextProps {
  children: ReactNode;
  className?: string;
}

export interface ButtonIconProps {
  children: ReactNode;
  className?: string;
}
