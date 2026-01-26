/**
 * Brand Configuration Types
 * Build-time configuration for white-label branding
 */

export interface Brand {
  /** Unique brand identifier (slug format) */
  id: string;
  /** Display name shown in app stores */
  appName: string;
  /** URL-safe slug for the brand */
  slug: string;
  /** iOS-specific configuration */
  ios: {
    bundleId: string;
    teamId: string;
  };
  /** Android-specific configuration */
  android: {
    packageName: string;
  };
  /** Default tenant ID for this brand */
  defaultTenantId: string;
  /** Path to brand assets directory */
  assetsPath: string;
}

export interface BrandAssets {
  icon: string;
  splash: string;
  adaptiveIconForeground?: string;
  logo: string;
  favicon?: string;
}

export interface BrandTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background?: string;
    surface?: string;
  };
  fontFamily?: {
    regular?: string;
    medium?: string;
    bold?: string;
  };
}

export interface BrandConfig extends Brand {
  theme?: BrandTheme;
}
