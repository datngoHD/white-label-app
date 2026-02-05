import { CardVariant } from './card.types';

/**
 * Get variant-specific classes for card
 */
function getVariantClasses(variant: CardVariant): string[] {
  switch (variant) {
    case 'default':
      return ['shadow-sm'];
    case 'outlined':
      return ['border', 'border-gray-200'];
    case 'elevated':
      return ['shadow-lg'];
  }
}

/**
 * Get card container class names based on variant
 */
export function getCardClassName(variant: CardVariant): string {
  const baseClasses = ['bg-white', 'rounded-xl', 'overflow-hidden'];

  return [...baseClasses, ...getVariantClasses(variant)].join(' ');
}

/**
 * Get card header class names
 */
export function getCardHeaderClassName(): string {
  return 'flex-row items-start justify-between gap-4 px-4 pt-4';
}

/**
 * Get card title class names
 */
export function getCardTitleClassName(): string {
  return 'text-lg font-semibold text-gray-900 flex-1';
}

/**
 * Get card description class names
 */
export function getCardDescriptionClassName(): string {
  return 'text-sm text-gray-500 mt-1';
}

/**
 * Get card content class names
 */
export function getCardContentClassName(): string {
  return 'px-4 py-4';
}

/**
 * Get card footer class names
 */
export function getCardFooterClassName(): string {
  return 'flex-row items-center px-4 pb-4 pt-2';
}

/**
 * Get card action class names
 */
export function getCardActionClassName(): string {
  return 'ml-auto';
}
