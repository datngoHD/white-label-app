// Configuration exports
export { environment, isDev, isStaging, isProd, currentEnv } from './environment.config';
export {
  currentBrand,
  getBrand,
  getAvailableBrands,
  brandExists,
  getCurrentBrandId,
} from './brand.config';
export {
  validateBrandConfig,
  formatValidationErrors,
  assertValidBrandConfig,
} from './brandValidator';
export {
  getDefaultTenantConfig,
  validateTenantConfig,
  isTenantAvailable,
  getTenantStatusMessage,
} from './tenant.config';
export { FEATURE_FLAGS, DEFAULT_FLAGS } from './featureFlags.types';
export type { Brand, BrandAssets, BrandTheme, BrandConfig } from './types';
export type {
  Tenant,
  TenantStatus,
  TenantMetadata,
  FeatureFlags,
  TenantConfig,
} from './tenant.types';
export type { FeatureFlag, FeatureFlagsConfig, FeatureFlagKey } from './featureFlags.types';
