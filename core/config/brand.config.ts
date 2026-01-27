import brandA from './brands/brand-a.json';
import defaultBrand from './brands/default.json';
import { BrandConfig } from './types';

const BRAND_ID = process.env.BRAND || 'default';

const brands: Record<string, BrandConfig> = {
  default: defaultBrand as BrandConfig,
  'brand-a': brandA as BrandConfig,
};

/**
 * Get the current brand configuration
 * Brand is determined at build time via BRAND environment variable
 */
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.default;

/**
 * Get a brand configuration by ID
 */
export const getBrand = (brandId?: string): BrandConfig => {
  const id = brandId || BRAND_ID;
  return brands[id] || brands.default;
};

/**
 * Get all available brand IDs
 */
export const getAvailableBrands = (): string[] => {
  return Object.keys(brands);
};

/**
 * Check if a brand exists
 */
export const brandExists = (brandId: string): boolean => {
  return brandId in brands;
};

/**
 * Get the current brand ID
 */
export const getCurrentBrandId = (): string => {
  return BRAND_ID;
};
