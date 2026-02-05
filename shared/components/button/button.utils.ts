import { cva, type VariantProps } from 'class-variance-authority';

import { defaultColors } from '@core/theme/colors';

/**
 * Button container variants using CVA
 * Consistent with web frontend pattern per 010-spec
 */
export const buttonVariants = cva(
  // Base classes
  'flex-row items-center justify-center rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        outline: 'bg-transparent border border-input',
        secondary: 'bg-secondary',
        ghost: 'bg-transparent',
        link: 'bg-transparent',
      },
      size: {
        sm: 'min-h-[32px] px-3 py-2 gap-1.5',
        default: 'min-h-[44px] px-4 py-3 gap-2',
        lg: 'min-h-[52px] px-6 py-4 gap-2',
        icon: 'min-h-[44px] w-[44px] p-2',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      disabled: false,
    },
  }
);

/**
 * Button text variants using CVA
 */
export const buttonTextVariants = cva(
  // Base classes
  'font-semibold',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-primary',
        link: 'text-primary underline',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
        icon: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Button icon variants using CVA
 */
export const buttonIconVariants = cva(
  // Base classes (empty)
  '',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-primary',
        link: 'text-primary',
      },
      size: {
        sm: 'w-4 h-4',
        default: 'w-5 h-5',
        lg: 'w-6 h-6',
        icon: 'w-5 h-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Export variant props type for TypeScript
 */
export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/**
 * Get ActivityIndicator color based on variant
 * Note: ActivityIndicator requires direct color value, cannot use className
 */
export function getLoadingColor(variant: ButtonVariantProps['variant']): string {
  switch (variant) {
    case 'default':
    case 'destructive':
      return defaultColors.text.inverse;
    case 'outline':
    case 'secondary':
      return defaultColors.text.primary;
    case 'ghost':
    case 'link':
      return defaultColors.primary;
    default:
      return defaultColors.text.inverse;
  }
}

// Legacy function exports for backward compatibility
export function getButtonClassName(
  variant: ButtonVariantProps['variant'],
  size: ButtonVariantProps['size'],
  fullWidth: boolean,
  disabled: boolean
): string {
  return buttonVariants({ variant, size, fullWidth, disabled });
}

export function getButtonTextClassName(
  variant: ButtonVariantProps['variant'],
  size: ButtonVariantProps['size']
): string {
  return buttonTextVariants({ variant, size });
}

export function getButtonIconClassName(
  variant: ButtonVariantProps['variant'],
  size: ButtonVariantProps['size']
): string {
  return buttonIconVariants({ variant, size });
}
