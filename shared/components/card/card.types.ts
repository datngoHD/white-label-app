import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export type CardVariant = 'default' | 'outlined' | 'elevated';

export interface CardProps {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Children content */
  children: ReactNode;
  /** Additional className for Uniwind styling */
  className?: string;
  /** Style overrides */
  style?: ViewStyle;
  /** Press handler (makes card interactive) */
  onPress?: () => void;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label for interactive cards */
  accessibilityLabel?: string;
  /** Accessibility hint for interactive cards */
  accessibilityHint?: string;
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export interface CardActionProps {
  children: ReactNode;
  className?: string;
}
