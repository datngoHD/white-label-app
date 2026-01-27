import React, { ReactNode } from 'react';

import {
  useHasAllPermissions,
  useHasAnyPermission,
  useHasPermission,
} from '@core/hooks/useHasPermission';
import { useHasRole } from '@core/hooks/useUserRole';
import { Permission } from '@core/permissions/permissions';
import { UserRole } from '@core/types';

interface RoleGateProps {
  /** Required role(s) - user must have this role */
  role?: UserRole;
  /** Required permission - user must have this permission */
  permission?: Permission;
  /** Required permissions (all) - user must have ALL these permissions */
  allPermissions?: Permission[];
  /** Required permissions (any) - user must have AT LEAST ONE of these permissions */
  anyPermissions?: Permission[];
  /** Content to render when authorized */
  children: ReactNode;
  /** Optional fallback content when unauthorized */
  fallback?: ReactNode;
}

/**
 * Gate component that conditionally renders children based on user role/permissions
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  role,
  permission,
  allPermissions,
  anyPermissions,
  children,
  fallback = null,
}) => {
  const hasRole = useHasRole(role ?? 'user');
  const hasPermission = useHasPermission(permission ?? ('' as Permission));
  const hasAllPerms = useHasAllPermissions(allPermissions ?? []);
  const hasAnyPerm = useHasAnyPermission(anyPermissions ?? []);

  // Determine if user is authorized
  let isAuthorized = true;

  if (role) {
    isAuthorized = isAuthorized && hasRole;
  }

  if (permission) {
    isAuthorized = isAuthorized && hasPermission;
  }

  if (allPermissions && allPermissions.length > 0) {
    isAuthorized = isAuthorized && hasAllPerms;
  }

  if (anyPermissions && anyPermissions.length > 0) {
    isAuthorized = isAuthorized && hasAnyPerm;
  }

  return <>{isAuthorized ? children : fallback}</>;
};

/**
 * Higher-order component for role-based access control
 */
export const withRoleGate = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    role?: UserRole;
    permission?: Permission;
    allPermissions?: Permission[];
    anyPermissions?: Permission[];
  },
  FallbackComponent?: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <RoleGate
      role={options.role}
      permission={options.permission}
      allPermissions={options.allPermissions}
      anyPermissions={options.anyPermissions}
      fallback={FallbackComponent ? <FallbackComponent {...props} /> : null}
    >
      <WrappedComponent {...props} />
    </RoleGate>
  );
};
