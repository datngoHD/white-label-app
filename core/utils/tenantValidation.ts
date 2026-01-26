import { Tenant, TenantStatus } from '../config/tenant.types';
import { logger } from '../logging/logger';

/**
 * Tenant validation utilities
 * Used to enforce tenant boundaries and validate access
 */

export interface TenantValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate that a resource belongs to the expected tenant
 */
export const validateTenantResource = (
  resourceTenantId: string,
  currentTenantId: string
): TenantValidationResult => {
  if (resourceTenantId !== currentTenantId) {
    logger.warn('Tenant boundary violation detected', {
      resourceTenantId,
      currentTenantId,
    });

    return {
      valid: false,
      reason: 'Resource does not belong to current tenant',
    };
  }

  return { valid: true };
};

/**
 * Validate that tenant is in active status
 */
export const validateTenantStatus = (
  tenant: Tenant
): TenantValidationResult => {
  if (tenant.status !== 'active') {
    return {
      valid: false,
      reason: getStatusMessage(tenant.status),
    };
  }

  return { valid: true };
};

/**
 * Get user-friendly message for tenant status
 */
export const getStatusMessage = (status: TenantStatus): string => {
  switch (status) {
    case 'suspended':
      return 'This account has been suspended. Please contact support for assistance.';
    case 'maintenance':
      return 'Service is temporarily unavailable for scheduled maintenance. Please try again later.';
    default:
      return 'Service is currently unavailable.';
  }
};

/**
 * Validate API response tenant header
 */
export const validateResponseTenant = (
  responseTenantId: string | undefined,
  expectedTenantId: string
): boolean => {
  if (!responseTenantId) {
    logger.debug('No tenant ID in response header');
    return true; // Allow responses without tenant header
  }

  if (responseTenantId !== expectedTenantId) {
    logger.error('Response tenant mismatch', {
      responseTenantId,
      expectedTenantId,
    });
    return false;
  }

  return true;
};

/**
 * Sanitize tenant ID for safe use
 */
export const sanitizeTenantId = (tenantId: string): string => {
  // Remove any characters that could be used for injection
  return tenantId.replace(/[^a-zA-Z0-9-_]/g, '');
};
