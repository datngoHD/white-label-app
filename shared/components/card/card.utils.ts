import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Card container variants using CVA
 * Consistent with web frontend pattern per 010-spec
 */
export const cardVariants = cva(
  // Base classes
  'bg-card rounded-xl overflow-hidden',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        outlined: 'border border-border',
        elevated: 'shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Card header variants
 */
export const cardHeaderVariants = cva(
  'flex-row items-start justify-between gap-4 px-4 pt-4'
);

/**
 * Card title variants
 */
export const cardTitleVariants = cva(
  'text-lg font-semibold text-card-foreground flex-1'
);

/**
 * Card description variants
 */
export const cardDescriptionVariants = cva(
  'text-sm text-muted-foreground mt-1'
);

/**
 * Card content variants
 */
export const cardContentVariants = cva('px-4 py-4');

/**
 * Card footer variants
 */
export const cardFooterVariants = cva(
  'flex-row items-center px-4 pb-4 pt-2'
);

/**
 * Card action variants
 */
export const cardActionVariants = cva('ml-auto');

/**
 * Export variant props type for TypeScript
 */
export type CardVariantProps = VariantProps<typeof cardVariants>;

// Legacy function exports for backward compatibility
export function getCardClassName(variant: CardVariantProps['variant']): string {
  return cardVariants({ variant });
}

export function getCardHeaderClassName(): string {
  return cardHeaderVariants();
}

export function getCardTitleClassName(): string {
  return cardTitleVariants();
}

export function getCardDescriptionClassName(): string {
  return cardDescriptionVariants();
}

export function getCardContentClassName(): string {
  return cardContentVariants();
}

export function getCardFooterClassName(): string {
  return cardFooterVariants();
}

export function getCardActionClassName(): string {
  return cardActionVariants();
}
