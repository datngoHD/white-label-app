/**
 * Switch Brand Script - Type Contracts
 *
 * These types define the contracts for the switch-brand CLI script.
 * They are used for development reference and can be copied to the
 * implementation when creating the script.
 */

/**
 * Required fields from BrandConfig for the switch-brand script.
 * This is a subset of the full BrandConfig interface.
 */
export interface SwitchBrandConfig {
  /** Unique brand identifier */
  id: string;
  /** Display name for the app */
  appName: string;
  /** iOS-specific configuration */
  ios: {
    /** iOS bundle identifier (e.g., com.example.app) */
    bundleId: string;
  };
  /** Android-specific configuration */
  android: {
    /** Android package name (e.g., com.example.app) */
    packageName: string;
  };
}

/**
 * Validation result for brand configuration
 */
export interface BrandValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Result of updating a single file
 */
export interface FileUpdateResult {
  /** Relative path to the file */
  file: string;
  /** Field/property that was updated */
  field: string;
  /** Previous value (if available) */
  oldValue?: string;
  /** New value applied */
  newValue: string;
  /** Whether the update succeeded */
  success: boolean;
  /** Error message if update failed */
  error?: string;
}

/**
 * Result of updating a platform (iOS or Android)
 */
export interface PlatformUpdateResult {
  /** Platform identifier */
  platform: 'ios' | 'android';
  /** Whether the platform directory exists */
  exists: boolean;
  /** Individual file update results */
  updates: FileUpdateResult[];
  /** Overall success for this platform */
  success: boolean;
}

/**
 * Overall result of the brand switch operation
 */
export interface SwitchBrandResult {
  /** Whether the overall operation succeeded */
  success: boolean;
  /** The brand ID that was switched to */
  brandId: string;
  /** Results for each platform */
  platforms: PlatformUpdateResult[];
  /** Warning messages (e.g., missing platform) */
  warnings: string[];
  /** Error message if operation failed */
  error?: string;
}

/**
 * CLI command options
 */
export interface SwitchBrandOptions {
  /** Brand ID to switch to (undefined = show current brand) */
  brandId?: string;
  /** Show list of available brands */
  list?: boolean;
  /** Verbose output */
  verbose?: boolean;
}

/**
 * Available brand information
 */
export interface AvailableBrand {
  /** Brand ID */
  id: string;
  /** Brand display name */
  appName: string;
  /** Whether this is the currently active brand */
  isCurrent: boolean;
}

/**
 * Script exit codes
 */
export enum ExitCode {
  /** Operation completed successfully */
  Success = 0,
  /** Brand not found */
  BrandNotFound = 1,
  /** Invalid brand configuration */
  InvalidConfig = 2,
  /** No native directories found */
  NoPlatforms = 3,
  /** File operation error */
  FileError = 4,
  /** Icon processing error */
  IconError = 5,
  /** Missing dependency (sharp) */
  MissingDependency = 6,
}

// =============================================================================
// Icon Processing Types (US4)
// =============================================================================

/**
 * Android icon density configuration
 */
export type AndroidDensity = 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi';

/**
 * Icon size configuration for each Android density
 */
export interface IconSizeConfig {
  /** Android density identifier */
  density: AndroidDensity;
  /** Launcher icon size (ic_launcher, ic_launcher_round) */
  launcherSize: number;
  /** Adaptive icon foreground size (ic_launcher_foreground) */
  foregroundSize: number;
}

/**
 * Android icon sizes for all densities
 */
export const ANDROID_ICON_SIZES: IconSizeConfig[] = [
  { density: 'mdpi', launcherSize: 48, foregroundSize: 108 },
  { density: 'hdpi', launcherSize: 72, foregroundSize: 162 },
  { density: 'xhdpi', launcherSize: 96, foregroundSize: 216 },
  { density: 'xxhdpi', launcherSize: 144, foregroundSize: 324 },
  { density: 'xxxhdpi', launcherSize: 192, foregroundSize: 432 },
];

/**
 * Brand icon source configuration
 */
export interface BrandIconConfig {
  /** Path to main icon (1024x1024 PNG) */
  iconPath: string | null;
  /** Path to adaptive icon foreground (optional) */
  adaptiveIconPath: string | null;
  /** Whether icon files exist and are valid */
  valid: boolean;
  /** Validation errors if any */
  errors: string[];
}

/**
 * Result of iOS icon update
 */
export interface IosIconUpdateResult {
  /** Whether iOS icon was updated */
  updated: boolean;
  /** Path to updated icon */
  path?: string;
  /** Error message if update failed */
  error?: string;
}

/**
 * Result of Android icon update
 */
export interface AndroidIconUpdateResult {
  /** Whether Android icons were updated */
  updated: boolean;
  /** Number of launcher icons updated */
  launcherCount: number;
  /** Number of round icons updated */
  roundCount: number;
  /** Number of foreground icons updated */
  foregroundCount: number;
  /** Error messages for failed updates */
  errors: string[];
}

/**
 * Overall result of icon update operation
 */
export interface IconUpdateResult {
  /** Whether icon update was attempted */
  attempted: boolean;
  /** Whether overall update succeeded */
  success: boolean;
  /** iOS icon update result */
  ios?: IosIconUpdateResult;
  /** Android icon update result */
  android?: AndroidIconUpdateResult;
  /** Warning messages (e.g., missing icon file) */
  warnings: string[];
}

/**
 * Sharp library availability check result
 */
export interface SharpAvailability {
  /** Whether sharp is available */
  available: boolean;
  /** Error message if not available */
  error?: string;
}
