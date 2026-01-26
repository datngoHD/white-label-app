import { logger } from './logger';

/**
 * Access event types for audit logging
 */
export type AccessEventType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'TOKEN_REFRESH'
  | 'RESOURCE_ACCESS'
  | 'RESOURCE_CREATE'
  | 'RESOURCE_UPDATE'
  | 'RESOURCE_DELETE'
  | 'PERMISSION_DENIED'
  | 'TENANT_BOUNDARY_VIOLATION';

export interface AccessEvent {
  type: AccessEventType;
  userId?: string;
  tenantId: string;
  resourceType?: string;
  resourceId?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Log an access event for audit purposes
 */
export const logAccessEvent = (event: Omit<AccessEvent, 'timestamp'>): void => {
  const fullEvent: AccessEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Log at different levels based on event type
  switch (event.type) {
    case 'PERMISSION_DENIED':
    case 'TENANT_BOUNDARY_VIOLATION':
      logger.warn('Security event', fullEvent);
      break;
    case 'LOGIN':
    case 'LOGOUT':
      logger.info('Auth event', fullEvent);
      break;
    default:
      logger.debug('Access event', fullEvent);
  }

  // TODO: Send to backend audit log service
  // auditService.logEvent(fullEvent);
};

/**
 * Log a successful authentication
 */
export const logLogin = (userId: string, tenantId: string): void => {
  logAccessEvent({
    type: 'LOGIN',
    userId,
    tenantId,
  });
};

/**
 * Log a logout
 */
export const logLogout = (userId: string, tenantId: string): void => {
  logAccessEvent({
    type: 'LOGOUT',
    userId,
    tenantId,
  });
};

/**
 * Log a permission denied event
 */
export const logPermissionDenied = (
  userId: string,
  tenantId: string,
  resourceType: string,
  action: string
): void => {
  logAccessEvent({
    type: 'PERMISSION_DENIED',
    userId,
    tenantId,
    resourceType,
    action,
  });
};

/**
 * Log a tenant boundary violation attempt
 */
export const logTenantBoundaryViolation = (
  userId: string,
  sourceTenantId: string,
  targetTenantId: string,
  resourceType: string,
  resourceId: string
): void => {
  logAccessEvent({
    type: 'TENANT_BOUNDARY_VIOLATION',
    userId,
    tenantId: sourceTenantId,
    resourceType,
    resourceId,
    metadata: {
      targetTenantId,
      severity: 'HIGH',
    },
  });
};
