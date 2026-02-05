import { useTenantContext } from '@app/providers/tenant-provider';

import { DEFAULT_FLAGS, FeatureFlagKey } from '../config/feature-flags.types';

/**
 * Hook to check if a feature flag is enabled
 */
export const useFeatureFlag = (flagKey: FeatureFlagKey | string): boolean => {
  const { tenant } = useTenantContext();

  // Check tenant-specific feature flags first
  if (tenant?.features && flagKey in tenant.features) {
    return tenant.features[flagKey] ?? false;
  }

  // Fall back to default flags
  if (flagKey in DEFAULT_FLAGS) {
    return DEFAULT_FLAGS[flagKey as FeatureFlagKey];
  }

  // Unknown flags default to false
  return false;
};

/**
 * Hook to get all feature flags
 */
export const useFeatureFlags = (): Record<string, boolean> => {
  const { tenant } = useTenantContext();

  return {
    ...DEFAULT_FLAGS,
    ...tenant?.features,
  };
};

/**
 * Hook to check multiple feature flags at once
 */
export const useFeatureFlagsMultiple = (
  flagKeys: (FeatureFlagKey | string)[]
): Record<string, boolean> => {
  const flags = useFeatureFlags();

  return flagKeys.reduce<Record<string, boolean>>((result, key) => {
    result[key] = flags[key] ?? false;
    return result;
  }, {});
};
