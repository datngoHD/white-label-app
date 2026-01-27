import { useTenantContext } from '@app/providers/TenantProvider';

import { DEFAULT_FLAGS, FeatureFlagKey } from '../config/featureFlags.types';

/**
 * Hook to check if a feature flag is enabled
 */
export const useFeatureFlag = (flagKey: FeatureFlagKey | string): boolean => {
  const { tenant } = useTenantContext();

  // Check tenant-specific feature flags first
  if (tenant?.features && flagKey in tenant.features) {
    return tenant.features[flagKey];
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

  return flagKeys.reduce(
    (result, key) => {
      result[key] = flags[key] ?? false;
      return result;
    },
    {} as Record<string, boolean>
  );
};
