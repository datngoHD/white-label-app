import { ButtonSize, ButtonVariant } from './button.types';

const BASE_BUTTON_CLASSES = [
  'flex-row',
  'items-center',
  'justify-center',
  'rounded-lg',
];

/**
 * Get variant-specific classes for button container
 */
function getVariantClasses(variant: ButtonVariant): string[] {
  switch (variant) {
    case 'default':
      return ['bg-primary'];
    case 'destructive':
      return ['bg-red-500'];
    case 'outline':
      return ['bg-transparent', 'border', 'border-gray-300'];
    case 'secondary':
      return ['bg-gray-200'];
    case 'ghost':
      return ['bg-transparent'];
    case 'link':
      return ['bg-transparent'];
  }
}

/**
 * Get size-specific classes for button container
 */
function getSizeClasses(size: ButtonSize): string[] {
  switch (size) {
    case 'sm':
      return ['min-h-[32px]', 'px-3', 'py-2', 'gap-1.5'];
    case 'default':
      return ['min-h-[44px]', 'px-4', 'py-3', 'gap-2'];
    case 'lg':
      return ['min-h-[52px]', 'px-6', 'py-4', 'gap-2'];
    case 'icon':
      return ['min-h-[44px]', 'w-[44px]', 'p-2'];
  }
}

/**
 * Get container class names based on variant and size
 */
export function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean
): string {
  const classes = [
    ...BASE_BUTTON_CLASSES,
    ...getVariantClasses(variant),
    ...getSizeClasses(size),
  ];

  if (fullWidth) {
    classes.push('w-full');
  }

  if (disabled) {
    classes.push('opacity-50');
  }

  return classes.join(' ');
}

/**
 * Get variant-specific text classes
 */
function getVariantTextClasses(variant: ButtonVariant): string[] {
  switch (variant) {
    case 'default':
      return ['text-white'];
    case 'destructive':
      return ['text-white'];
    case 'outline':
      return ['text-gray-900'];
    case 'secondary':
      return ['text-gray-900'];
    case 'ghost':
      return ['text-primary'];
    case 'link':
      return ['text-primary', 'underline'];
  }
}

/**
 * Get size-specific text classes
 */
function getSizeTextClasses(size: ButtonSize): string[] {
  switch (size) {
    case 'sm':
      return ['text-sm'];
    case 'default':
      return ['text-base'];
    case 'lg':
      return ['text-lg'];
    case 'icon':
      return ['text-base'];
  }
}

/**
 * Get text class names based on variant and size
 */
export function getButtonTextClassName(
  variant: ButtonVariant,
  size: ButtonSize
): string {
  return [
    'font-semibold',
    ...getVariantTextClasses(variant),
    ...getSizeTextClasses(size),
  ].join(' ');
}

/**
 * Get variant-specific icon classes
 */
function getVariantIconClasses(variant: ButtonVariant): string[] {
  switch (variant) {
    case 'default':
      return ['text-white'];
    case 'destructive':
      return ['text-white'];
    case 'outline':
      return ['text-gray-900'];
    case 'secondary':
      return ['text-gray-900'];
    case 'ghost':
      return ['text-primary'];
    case 'link':
      return ['text-primary'];
  }
}

/**
 * Get size-specific icon classes
 */
function getSizeIconClasses(size: ButtonSize): string[] {
  switch (size) {
    case 'sm':
      return ['w-4', 'h-4'];
    case 'default':
      return ['w-5', 'h-5'];
    case 'lg':
      return ['w-6', 'h-6'];
    case 'icon':
      return ['w-5', 'h-5'];
  }
}

/**
 * Get icon class names based on variant and size
 */
export function getButtonIconClassName(
  variant: ButtonVariant,
  size: ButtonSize
): string {
  return [
    ...getVariantIconClasses(variant),
    ...getSizeIconClasses(size),
  ].join(' ');
}

/**
 * Get ActivityIndicator color based on variant
 */
export function getLoadingColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'default':
    case 'destructive':
      return '#ffffff';
    case 'outline':
    case 'secondary':
      return '#1f2937';
    case 'ghost':
    case 'link':
      return '#007AFF';
  }
}
