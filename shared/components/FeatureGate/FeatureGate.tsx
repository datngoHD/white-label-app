import React, { ReactNode } from 'react';
import { useFeatureFlag } from '../../../core/hooks/useFeatureFlag';
import { FeatureFlagKey } from '../../../core/config/featureFlags.types';

interface FeatureGateProps {
  /** Feature flag key to check */
  feature: FeatureFlagKey | string;
  /** Content to render when feature is enabled */
  children: ReactNode;
  /** Optional fallback content when feature is disabled */
  fallback?: ReactNode;
  /** Invert the logic (show when feature is disabled) */
  invert?: boolean;
}

/**
 * Gate component that conditionally renders children based on feature flag
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback = null,
  invert = false,
}) => {
  const isEnabled = useFeatureFlag(feature);
  const shouldRender = invert ? !isEnabled : isEnabled;

  return <>{shouldRender ? children : fallback}</>;
};

/**
 * Higher-order component for feature gating
 */
export const withFeatureGate = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  feature: FeatureFlagKey | string,
  FallbackComponent?: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const isEnabled = useFeatureFlag(feature);

    if (isEnabled) {
      return <WrappedComponent {...props} />;
    }

    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return null;
  };
};
