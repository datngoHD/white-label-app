import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Input container variants using CVA
 * Consistent with web frontend pattern per 010-spec
 */
export const inputVariants = cva(
  // Base classes
  'flex-row items-center rounded-lg border',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        filled: 'bg-muted border-transparent',
        outline: 'bg-transparent border-input',
      },
      size: {
        sm: 'min-h-[36px] px-3',
        default: 'min-h-[44px] px-4',
        lg: 'min-h-[52px] px-4',
      },
      hasError: {
        true: 'border-destructive bg-destructive/10',
        false: '',
      },
      isFocused: {
        true: 'border-primary',
        false: '',
      },
    },
    // Compound variants: error takes precedence over focus
    compoundVariants: [
      {
        hasError: true,
        isFocused: true,
        className: 'border-destructive', // Error style wins
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasError: false,
      isFocused: false,
    },
  }
);

/**
 * Text input variants using CVA
 */
export const textInputVariants = cva(
  // Base classes
  'flex-1 text-foreground',
  {
    variants: {
      size: {
        sm: 'text-sm py-2',
        default: 'text-base py-3',
        lg: 'text-lg py-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Label variants using CVA
 */
export const labelVariants = cva(
  'text-sm font-medium text-foreground mb-1.5'
);

/**
 * Hint/error text variants using CVA
 */
export const hintVariants = cva(
  // Base classes
  'text-xs mt-1',
  {
    variants: {
      isError: {
        true: 'text-destructive',
        false: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      isError: false,
    },
  }
);

/**
 * Export variant props types for TypeScript
 */
export type InputVariantProps = VariantProps<typeof inputVariants>;
export type TextInputVariantProps = VariantProps<typeof textInputVariants>;

/**
 * Get addon container class names
 */
export function getAddonClassName(): string {
  return 'justify-center items-center';
}

// Legacy function exports for backward compatibility
export function getInputClassName(
  variant: InputVariantProps['variant'],
  size: InputVariantProps['size'],
  hasError: boolean,
  isFocused: boolean
): string {
  return inputVariants({ variant, size, hasError, isFocused });
}

export function getTextInputClassName(size: TextInputVariantProps['size']): string {
  return textInputVariants({ size });
}

export function getLabelClassName(): string {
  return labelVariants();
}

export function getHintClassName(isError: boolean): string {
  return hintVariants({ isError });
}
