import { ReactNode, RefObject } from 'react';
import { TextInput, TextInputProps, ViewStyle } from 'react-native';

export type InputVariant = 'default' | 'filled' | 'outline';

export type InputSize = 'sm' | 'default' | 'lg';

export interface InputProps extends TextInputProps {
  /** Visual variant of the input */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Label text above the input */
  label?: string;
  /** Error message below the input */
  error?: string;
  /** Hint text below the input (shown when no error) */
  hint?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Left addon element (icon or text) */
  leftAddon?: ReactNode;
  /** Right addon element (icon or text) */
  rightAddon?: ReactNode;
  /** Container style overrides */
  containerStyle?: ViewStyle;
  /** Additional className for Uniwind styling */
  className?: string;
  /** Container className */
  containerClassName?: string;
  /** Ref to the TextInput (React 19 style - no forwardRef needed) */
  ref?: RefObject<TextInput>;
}
