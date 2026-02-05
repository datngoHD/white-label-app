import { InputSize, InputVariant } from './input.types';

/**
 * Get variant-specific classes for input container
 */
function getVariantClasses(variant: InputVariant): string[] {
  switch (variant) {
    case 'default':
      return ['bg-white', 'border-gray-300'];
    case 'filled':
      return ['bg-gray-100', 'border-transparent'];
    case 'outline':
      return ['bg-transparent', 'border-gray-300'];
  }
}

/**
 * Get size-specific classes for input container
 */
function getSizeClasses(size: InputSize): string[] {
  switch (size) {
    case 'sm':
      return ['min-h-[36px]', 'px-3'];
    case 'default':
      return ['min-h-[44px]', 'px-4'];
    case 'lg':
      return ['min-h-[52px]', 'px-4'];
  }
}

/**
 * Get input container class names based on variant and size
 */
export function getInputClassName(
  variant: InputVariant,
  size: InputSize,
  hasError: boolean,
  isFocused: boolean
): string {
  const baseClasses = ['flex-row', 'items-center', 'rounded-lg', 'border'];

  const classes = [
    ...baseClasses,
    ...getVariantClasses(variant),
    ...getSizeClasses(size),
  ];

  if (hasError) {
    classes.push('border-red-500', 'bg-red-50');
  } else if (isFocused) {
    classes.push('border-primary');
  }

  return classes.join(' ');
}

/**
 * Get size-specific text input classes
 */
function getSizeTextInputClasses(size: InputSize): string[] {
  switch (size) {
    case 'sm':
      return ['text-sm', 'py-2'];
    case 'default':
      return ['text-base', 'py-3'];
    case 'lg':
      return ['text-lg', 'py-4'];
  }
}

/**
 * Get text input class names based on size
 */
export function getTextInputClassName(size: InputSize): string {
  return ['flex-1', 'text-gray-900', ...getSizeTextInputClasses(size)].join(
    ' '
  );
}

/**
 * Get label class names
 */
export function getLabelClassName(): string {
  return 'text-sm font-medium text-gray-700 mb-1.5';
}

/**
 * Get hint/error class names
 */
export function getHintClassName(isError: boolean): string {
  const baseClasses = ['text-xs', 'mt-1'];

  if (isError) {
    return [...baseClasses, 'text-red-500'].join(' ');
  }

  return [...baseClasses, 'text-gray-500'].join(' ');
}

/**
 * Get addon container class names
 */
export function getAddonClassName(): string {
  return 'justify-center items-center';
}
