import { BrandConfig } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate brand configuration completeness
 * Used to fail builds on incomplete brand config
 */
export const validateBrandConfig = (brand: BrandConfig): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!brand.id) {
    errors.push({ field: 'id', message: 'Brand ID is required' });
  } else if (!/^[a-z0-9-]+$/.test(brand.id)) {
    errors.push({ field: 'id', message: 'Brand ID must be lowercase alphanumeric with hyphens' });
  }

  if (!brand.appName) {
    errors.push({ field: 'appName', message: 'App name is required' });
  } else if (brand.appName.length < 2 || brand.appName.length > 30) {
    errors.push({ field: 'appName', message: 'App name must be 2-30 characters' });
  }

  if (!brand.slug) {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (!/^[a-z0-9-]+$/.test(brand.slug)) {
    errors.push({ field: 'slug', message: 'Slug must be lowercase alphanumeric with hyphens' });
  }

  // iOS configuration
  if (!brand.ios) {
    errors.push({ field: 'ios', message: 'iOS configuration is required' });
  } else {
    if (!brand.ios.bundleId) {
      errors.push({ field: 'ios.bundleId', message: 'iOS bundle ID is required' });
    } else if (!/^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+$/.test(brand.ios.bundleId)) {
      errors.push({ field: 'ios.bundleId', message: 'Invalid iOS bundle ID format' });
    }

    if (!brand.ios.teamId) {
      errors.push({ field: 'ios.teamId', message: 'iOS team ID is required' });
    }
  }

  // Android configuration
  if (!brand.android) {
    errors.push({ field: 'android', message: 'Android configuration is required' });
  } else {
    if (!brand.android.packageName) {
      errors.push({ field: 'android.packageName', message: 'Android package name is required' });
    } else if (!/^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+$/.test(brand.android.packageName)) {
      errors.push({ field: 'android.packageName', message: 'Invalid Android package name format' });
    }
  }

  if (!brand.defaultTenantId) {
    errors.push({ field: 'defaultTenantId', message: 'Default tenant ID is required' });
  }

  if (!brand.assetsPath) {
    errors.push({ field: 'assetsPath', message: 'Assets path is required' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (result: ValidationResult): string => {
  if (result.valid) {
    return 'Brand configuration is valid';
  }

  return result.errors
    .map((e) => `  - ${e.field}: ${e.message}`)
    .join('\n');
};

/**
 * Assert brand configuration is valid, throw if not
 */
export const assertValidBrandConfig = (brand: BrandConfig): void => {
  const result = validateBrandConfig(brand);
  if (!result.valid) {
    throw new Error(
      `Invalid brand configuration:\n${formatValidationErrors(result)}`
    );
  }
};
