#!/usr/bin/env node
/**
 * Switch Brand Script
 *
 * Quickly switch between white-label brand configurations without running prebuild.
 * Reads brand config from core/config/brands/{brand-id}.json and updates native files.
 *
 * Usage:
 *   yarn brand              # Show current brand and available brands
 *   yarn brand <brand-id>   # Switch to specified brand
 *
 * Example:
 *   yarn brand brand-a      # Switch to brand-a configuration
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// Constants
// =============================================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const BRANDS_DIR = path.join(ROOT_DIR, 'core', 'config', 'brands');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets', 'brands');
const CURRENT_BRAND_FILE = path.join(ROOT_DIR, '.current-brand');

/**
 * Android icon sizes for all densities
 * @type {Array<{density: string, launcherSize: number, foregroundSize: number}>}
 */
const ANDROID_ICON_SIZES = [
  { density: 'mdpi', launcherSize: 48, foregroundSize: 108 },
  { density: 'hdpi', launcherSize: 72, foregroundSize: 162 },
  { density: 'xhdpi', launcherSize: 96, foregroundSize: 216 },
  { density: 'xxhdpi', launcherSize: 144, foregroundSize: 324 },
  { density: 'xxxhdpi', launcherSize: 192, foregroundSize: 432 },
];

// Sharp library reference (loaded dynamically)
let sharp = null;

// =============================================================================
// Core Utilities (Phase 2: Foundational)
// =============================================================================

/**
 * Get the brands directory path
 * @returns {string}
 */
function getBrandsDirectory() {
  return BRANDS_DIR;
}

/**
 * Get list of available brand IDs
 * @returns {string[]}
 */
function getAvailableBrands() {
  const brandsDir = getBrandsDirectory();
  if (!fs.existsSync(brandsDir)) {
    return [];
  }
  return fs
    .readdirSync(brandsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));
}

/**
 * Load brand configuration from JSON file
 * @param {string} brandId
 * @returns {Object|null}
 */
function loadBrandConfig(brandId) {
  const brandPath = path.join(getBrandsDirectory(), `${brandId}.json`);
  if (!fs.existsSync(brandPath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(brandPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Validate brand configuration has required fields
 * @param {Object} config
 * @returns {{valid: boolean, errors: string[]}}
 */
function validateBrandConfig(config) {
  const errors = [];

  if (!config.appName) {
    errors.push('Missing required field: appName');
  }
  if (!config.ios?.bundleId) {
    errors.push('Missing required field: ios.bundleId');
  }
  if (!config.android?.packageName) {
    errors.push('Missing required field: android.packageName');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get currently active brand from .current-brand file
 * @returns {string|null}
 */
function getCurrentBrand() {
  if (!fs.existsSync(CURRENT_BRAND_FILE)) {
    return null;
  }
  try {
    return fs.readFileSync(CURRENT_BRAND_FILE, 'utf8').trim();
  } catch {
    return null;
  }
}

/**
 * Save current brand to .current-brand file
 * @param {string} brandId
 */
function saveCurrentBrand(brandId) {
  fs.writeFileSync(CURRENT_BRAND_FILE, brandId);
}

// =============================================================================
// iOS Platform Updates (Phase 3: User Story 1)
// =============================================================================

/**
 * Find iOS project files (project.pbxproj and Info.plist)
 * @returns {{pbxproj: string|null, infoPlist: string|null}}
 */
function findIosProjectFiles() {
  const iosDir = path.join(ROOT_DIR, 'ios');
  if (!fs.existsSync(iosDir)) {
    return { pbxproj: null, infoPlist: null };
  }

  let pbxproj = null;
  let infoPlist = null;

  // Find .xcodeproj directory
  const entries = fs.readdirSync(iosDir);
  const xcodeproj = entries.find((e) => e.endsWith('.xcodeproj'));
  if (xcodeproj) {
    const pbxprojPath = path.join(iosDir, xcodeproj, 'project.pbxproj');
    if (fs.existsSync(pbxprojPath)) {
      pbxproj = pbxprojPath;
    }
  }

  // Find Info.plist in app directory (look for directory containing Info.plist)
  for (const e of entries) {
    if (
      !e.startsWith('.') &&
      !e.endsWith('.xcodeproj') &&
      !e.endsWith('.xcworkspace') &&
      e !== 'Pods' &&
      e !== 'build'
    ) {
      const dirPath = path.join(iosDir, e);
      if (fs.statSync(dirPath).isDirectory()) {
        const infoPlistPath = path.join(dirPath, 'Info.plist');
        if (fs.existsSync(infoPlistPath)) {
          infoPlist = infoPlistPath;
          break;
        }
      }
    }
  }

  return { pbxproj, infoPlist };
}

/**
 * Update iOS bundle identifier in project.pbxproj
 * @param {string} pbxprojPath
 * @param {string} bundleId
 * @returns {boolean}
 */
function updateIosBundleId(pbxprojPath, bundleId) {
  try {
    let content = fs.readFileSync(pbxprojPath, 'utf8');
    // Match PRODUCT_BUNDLE_IDENTIFIER with or without quotes
    content = content.replace(
      /PRODUCT_BUNDLE_IDENTIFIER = "?[^";]+"?;/g,
      `PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";`
    );
    fs.writeFileSync(pbxprojPath, content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update iOS display name in Info.plist
 * @param {string} infoPlistPath
 * @param {string} appName
 * @returns {boolean}
 */
function updateIosDisplayName(infoPlistPath, appName) {
  try {
    let content = fs.readFileSync(infoPlistPath, 'utf8');
    // Update CFBundleDisplayName
    content = content.replace(
      /(<key>CFBundleDisplayName<\/key>\s*<string>)([^<]*)(<\/string>)/,
      `$1${appName}$3`
    );
    fs.writeFileSync(infoPlistPath, content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update all iOS platform files
 * @param {Object} config
 * @returns {{success: boolean, warnings: string[]}}
 */
function updateIosPlatform(config) {
  const warnings = [];
  const files = findIosProjectFiles();

  if (!files.pbxproj && !files.infoPlist) {
    return { success: false, warnings: ['iOS directory not found, skipping iOS updates'] };
  }

  console.log('\n🍎 Updating iOS...');

  if (files.pbxproj) {
    if (updateIosBundleId(files.pbxproj, config.ios.bundleId)) {
      console.log(`   ✅ Updated Bundle ID: ${config.ios.bundleId}`);
    } else {
      warnings.push('Failed to update iOS bundle identifier');
    }
  }

  if (files.infoPlist) {
    if (updateIosDisplayName(files.infoPlist, config.appName)) {
      console.log(`   ✅ Updated display name: ${config.appName}`);
    } else {
      warnings.push('Failed to update iOS display name');
    }
  }

  return { success: true, warnings };
}

// =============================================================================
// Android Platform Updates (Phase 3: User Story 1)
// =============================================================================

/**
 * Find Android project files (build.gradle and strings.xml)
 * @returns {{buildGradle: string|null, stringsXml: string|null}}
 */
function findAndroidProjectFiles() {
  const androidDir = path.join(ROOT_DIR, 'android');
  if (!fs.existsSync(androidDir)) {
    return { buildGradle: null, stringsXml: null };
  }

  const buildGradlePath = path.join(androidDir, 'app', 'build.gradle');
  const stringsXmlPath = path.join(
    androidDir,
    'app',
    'src',
    'main',
    'res',
    'values',
    'strings.xml'
  );

  return {
    buildGradle: fs.existsSync(buildGradlePath) ? buildGradlePath : null,
    stringsXml: fs.existsSync(stringsXmlPath) ? stringsXmlPath : null,
  };
}

/**
 * Update Android package name in build.gradle
 * @param {string} buildGradlePath
 * @param {string} packageName
 * @returns {boolean}
 */
function updateAndroidPackageName(buildGradlePath, packageName) {
  try {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    // Update namespace
    content = content.replace(/namespace\s+['"].*['"]/, `namespace '${packageName}'`);
    // Update applicationId
    content = content.replace(/applicationId\s+['"].*['"]/, `applicationId '${packageName}'`);
    fs.writeFileSync(buildGradlePath, content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update Android app name in strings.xml
 * @param {string} stringsXmlPath
 * @param {string} appName
 * @returns {boolean}
 */
function updateAndroidAppName(stringsXmlPath, appName) {
  try {
    let content = fs.readFileSync(stringsXmlPath, 'utf8');
    content = content.replace(
      /<string name="app_name">.*<\/string>/,
      `<string name="app_name">${appName}</string>`
    );
    fs.writeFileSync(stringsXmlPath, content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update all Android platform files
 * @param {Object} config
 * @returns {{success: boolean, warnings: string[]}}
 */
function updateAndroidPlatform(config) {
  const warnings = [];
  const files = findAndroidProjectFiles();

  if (!files.buildGradle && !files.stringsXml) {
    return { success: false, warnings: ['Android directory not found, skipping Android updates'] };
  }

  console.log('\n📱 Updating Android...');

  if (files.buildGradle) {
    if (updateAndroidPackageName(files.buildGradle, config.android.packageName)) {
      console.log(`   ✅ Updated packageName: ${config.android.packageName}`);
    } else {
      warnings.push('Failed to update Android package name');
    }
  }

  if (files.stringsXml) {
    if (updateAndroidAppName(files.stringsXml, config.appName)) {
      console.log(`   ✅ Updated app_name: ${config.appName}`);
    } else {
      warnings.push('Failed to update Android app name');
    }
  }

  return { success: true, warnings };
}

// =============================================================================
// Error Handlers (Phase 5: User Story 3)
// =============================================================================

/**
 * Handle brand not found error
 * @param {string} brandId
 * @param {string[]} availableBrands
 */
function handleBrandNotFound(brandId, availableBrands) {
  console.error(`\n❌ Brand '${brandId}' not found\n`);
  console.log('Available brands:');
  availableBrands.forEach((b) => console.log(`  • ${b}`));
  process.exit(1);
}

/**
 * Handle missing platform warning
 * @param {string} platform
 */
function handleMissingPlatform(platform) {
  console.warn(`\n⚠️  ${platform} directory not found, skipping ${platform} updates`);
}

/**
 * Handle no platforms available error
 */
function handleNoPlatforms() {
  console.error('\n❌ No native directories found (ios/ or android/)');
  console.log('\nRun prebuild first:');
  console.log('   yarn prebuild');
  process.exit(1);
}

/**
 * Handle invalid config error
 * @param {string[]} errors
 */
function handleInvalidConfig(errors) {
  console.error('\n❌ Invalid brand configuration:\n');
  errors.forEach((e) => console.error(`   • ${e}`));
  process.exit(1);
}

// =============================================================================
// Icon Processing (Phase 6: User Story 4)
// =============================================================================

/**
 * Check if sharp library is available
 * @returns {{available: boolean, error?: string}}
 */
function checkSharpAvailability() {
  try {
    sharp = require('sharp');
    return { available: true };
  } catch {
    return {
      available: false,
      error: 'sharp library not found',
    };
  }
}

/**
 * Handle missing sharp library warning
 */
function handleMissingSharp() {
  console.warn('\n⚠️  sharp library not found, skipping icon update');
  console.log('   Install with: yarn add sharp --dev');
}

/**
 * Get brand assets directory path
 * @param {string} brandId
 * @returns {string}
 */
function getBrandAssetsPath(brandId) {
  return path.join(ASSETS_DIR, brandId);
}

/**
 * Get brand icon path
 * @param {string} brandId
 * @returns {string|null}
 */
function getBrandIconPath(brandId) {
  const iconPath = path.join(getBrandAssetsPath(brandId), 'icon.png');
  return fs.existsSync(iconPath) ? iconPath : null;
}

/**
 * Get brand adaptive icon path (optional)
 * @param {string} brandId
 * @returns {string|null}
 */
function getBrandAdaptiveIconPath(brandId) {
  const iconPath = path.join(getBrandAssetsPath(brandId), 'adaptive-icon.png');
  return fs.existsSync(iconPath) ? iconPath : null;
}

/**
 * Validate icon size is at least 1024x1024
 * @param {string} iconPath
 * @returns {Promise<{valid: boolean, width?: number, height?: number, error?: string}>}
 */
async function validateIconSize(iconPath) {
  try {
    const metadata = await sharp(iconPath).metadata();
    const valid = metadata.width >= 1024 && metadata.height >= 1024;
    return {
      valid,
      width: metadata.width,
      height: metadata.height,
      error: valid
        ? undefined
        : `Icon must be at least 1024x1024, got ${metadata.width}x${metadata.height}`,
    };
  } catch (err) {
    return {
      valid: false,
      error: `Failed to read icon metadata: ${err.message}`,
    };
  }
}

/**
 * Handle missing icon warning
 * @param {string} brandId
 */
function handleMissingIcon(brandId) {
  console.warn(`\n⚠️  Icon not found for brand '${brandId}', skipping icon update`);
}

/**
 * Handle invalid icon size error
 * @param {number} width
 * @param {number} height
 */
function handleInvalidIconSize(width, height) {
  console.error(`\n❌ Icon too small: ${width}x${height} (minimum 1024x1024)`);
}

/**
 * Find iOS AppIcon.appiconset directory
 * @returns {string|null}
 */
function findIosAppIconPath() {
  const iosDir = path.join(ROOT_DIR, 'ios');
  if (!fs.existsSync(iosDir)) {
    return null;
  }

  // Find app directory (same logic as findIosProjectFiles)
  const entries = fs.readdirSync(iosDir);
  for (const e of entries) {
    if (
      !e.startsWith('.') &&
      !e.endsWith('.xcodeproj') &&
      !e.endsWith('.xcworkspace') &&
      e !== 'Pods' &&
      e !== 'build'
    ) {
      const dirPath = path.join(iosDir, e);
      if (fs.statSync(dirPath).isDirectory()) {
        const appIconPath = path.join(dirPath, 'Images.xcassets', 'AppIcon.appiconset');
        if (fs.existsSync(appIconPath)) {
          return appIconPath;
        }
      }
    }
  }
  return null;
}

/**
 * Update iOS app icon by copying 1024x1024 icon
 * @param {string} brandId
 * @returns {Promise<{success: boolean, path?: string, error?: string}>}
 */
async function updateIosAppIcon(brandId) {
  const iconPath = getBrandIconPath(brandId);
  if (!iconPath) {
    return { success: false, error: 'Icon not found' };
  }

  const appIconDir = findIosAppIconPath();
  if (!appIconDir) {
    return { success: false, error: 'AppIcon.appiconset not found' };
  }

  const targetPath = path.join(appIconDir, 'App-Icon-1024x1024@1x.png');

  try {
    fs.copyFileSync(iconPath, targetPath);
    return { success: true, path: targetPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Generate Android launcher icon at specific density
 * @param {string} iconPath
 * @param {string} density
 * @param {number} size
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function generateAndroidLauncherIcon(iconPath, density, size) {
  const outputDir = path.join(
    ROOT_DIR,
    'android',
    'app',
    'src',
    'main',
    'res',
    `mipmap-${density}`
  );
  if (!fs.existsSync(outputDir)) {
    return { success: false, error: `Directory not found: mipmap-${density}` };
  }

  const outputPath = path.join(outputDir, 'ic_launcher.webp');

  try {
    await sharp(iconPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90 })
      .toFile(outputPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Generate Android round icon at specific density with circular mask
 * @param {string} iconPath
 * @param {string} density
 * @param {number} size
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function generateAndroidRoundIcon(iconPath, density, size) {
  const outputDir = path.join(
    ROOT_DIR,
    'android',
    'app',
    'src',
    'main',
    'res',
    `mipmap-${density}`
  );
  if (!fs.existsSync(outputDir)) {
    return { success: false, error: `Directory not found: mipmap-${density}` };
  }

  const outputPath = path.join(outputDir, 'ic_launcher_round.webp');

  try {
    // Create circular mask
    const mask = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
    );

    await sharp(iconPath)
      .resize(size, size, { fit: 'cover' })
      .composite([{ input: mask, blend: 'dest-in' }])
      .webp({ quality: 90 })
      .toFile(outputPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Generate Android adaptive icon foreground at specific density
 * @param {string} iconPath
 * @param {string} density
 * @param {number} size
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function generateAndroidForegroundIcon(iconPath, density, size) {
  const outputDir = path.join(
    ROOT_DIR,
    'android',
    'app',
    'src',
    'main',
    'res',
    `mipmap-${density}`
  );
  if (!fs.existsSync(outputDir)) {
    return { success: false, error: `Directory not found: mipmap-${density}` };
  }

  const outputPath = path.join(outputDir, 'ic_launcher_foreground.webp');

  try {
    await sharp(iconPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90 })
      .toFile(outputPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Update all Android icons
 * @param {string} brandId
 * @returns {Promise<{success: boolean, launcherCount: number, roundCount: number, foregroundCount: number, errors: string[]}>}
 */
async function updateAndroidIcons(brandId) {
  const iconPath = getBrandIconPath(brandId);
  if (!iconPath) {
    return {
      success: false,
      launcherCount: 0,
      roundCount: 0,
      foregroundCount: 0,
      errors: ['Icon not found'],
    };
  }

  // Use adaptive icon for foreground if available, otherwise use main icon
  const adaptiveIconPath = getBrandAdaptiveIconPath(brandId) || iconPath;

  const errors = [];
  let launcherCount = 0;
  let roundCount = 0;
  let foregroundCount = 0;

  for (const { density, launcherSize, foregroundSize } of ANDROID_ICON_SIZES) {
    // Generate launcher icon
    const launcherResult = await generateAndroidLauncherIcon(iconPath, density, launcherSize);
    if (launcherResult.success) {
      launcherCount++;
    } else {
      errors.push(`launcher-${density}: ${launcherResult.error}`);
    }

    // Generate round icon
    const roundResult = await generateAndroidRoundIcon(iconPath, density, launcherSize);
    if (roundResult.success) {
      roundCount++;
    } else {
      errors.push(`round-${density}: ${roundResult.error}`);
    }

    // Generate foreground icon
    const foregroundResult = await generateAndroidForegroundIcon(
      adaptiveIconPath,
      density,
      foregroundSize
    );
    if (foregroundResult.success) {
      foregroundCount++;
    } else {
      errors.push(`foreground-${density}: ${foregroundResult.error}`);
    }
  }

  return {
    success: errors.length === 0,
    launcherCount,
    roundCount,
    foregroundCount,
    errors,
  };
}

/**
 * Update all app icons (iOS and Android)
 * @param {string} brandId
 * @returns {Promise<{attempted: boolean, success: boolean, ios?: Object, android?: Object, warnings: string[]}>}
 */
async function updateIcons(brandId) {
  const warnings = [];

  // Check if sharp is available
  const sharpCheck = checkSharpAvailability();
  if (!sharpCheck.available) {
    handleMissingSharp();
    return { attempted: false, success: true, warnings: ['sharp not available'] };
  }

  // Check if icon exists
  const iconPath = getBrandIconPath(brandId);
  if (!iconPath) {
    handleMissingIcon(brandId);
    return { attempted: false, success: true, warnings: ['icon not found'] };
  }

  // Validate icon size
  const validation = await validateIconSize(iconPath);
  if (!validation.valid) {
    handleInvalidIconSize(validation.width || 0, validation.height || 0);
    return { attempted: true, success: false, warnings: [validation.error] };
  }

  console.log('\n🖼️  Updating icons...');

  let iosResult = null;
  let androidResult = null;

  // Update iOS icon
  const iosDir = path.join(ROOT_DIR, 'ios');
  if (fs.existsSync(iosDir)) {
    iosResult = await updateIosAppIcon(brandId);
    if (iosResult.success) {
      console.log('   ✅ iOS: Copied icon to AppIcon.appiconset');
    } else {
      warnings.push(`iOS: ${iosResult.error}`);
    }
  }

  // Update Android icons
  const androidDir = path.join(ROOT_DIR, 'android');
  if (fs.existsSync(androidDir)) {
    androidResult = await updateAndroidIcons(brandId);
    if (androidResult.launcherCount > 0) {
      console.log(`   ✅ Android: Generated ${androidResult.launcherCount} launcher icons`);
    }
    if (androidResult.roundCount > 0) {
      console.log(`   ✅ Android: Generated ${androidResult.roundCount} round icons`);
    }
    if (androidResult.foregroundCount > 0) {
      console.log(`   ✅ Android: Generated ${androidResult.foregroundCount} foreground icons`);
    }
    if (androidResult.errors.length > 0) {
      warnings.push(...androidResult.errors);
    }
  }

  return {
    attempted: true,
    success: warnings.length === 0,
    ios: iosResult,
    android: androidResult,
    warnings,
  };
}

// =============================================================================
// Main Functions
// =============================================================================

/**
 * Switch to a different brand
 * @param {string} brandId
 */
async function switchBrand(brandId) {
  console.log(`\n🔄 Switching to brand: ${brandId}`);

  // Load and validate brand config
  const config = loadBrandConfig(brandId);
  if (!config) {
    const availableBrands = getAvailableBrands();
    handleBrandNotFound(brandId, availableBrands);
    return;
  }

  const validation = validateBrandConfig(config);
  if (!validation.valid) {
    handleInvalidConfig(validation.errors);
    return;
  }

  // Check platforms exist
  const iosDir = path.join(ROOT_DIR, 'ios');
  const androidDir = path.join(ROOT_DIR, 'android');
  const hasIos = fs.existsSync(iosDir);
  const hasAndroid = fs.existsSync(androidDir);

  if (!hasIos && !hasAndroid) {
    handleNoPlatforms();
    return;
  }

  // Update platforms
  if (hasAndroid) {
    updateAndroidPlatform(config);
  } else {
    handleMissingPlatform('Android');
  }

  if (hasIos) {
    updateIosPlatform(config);
  } else {
    handleMissingPlatform('iOS');
  }

  // Update icons (US4)
  await updateIcons(brandId);

  // Save current brand
  saveCurrentBrand(brandId);
  console.log('\n📝 Saved current brand to .current-brand');

  // Print success message
  console.log(`\n✨ Successfully switched to brand: ${brandId}`);
  console.log('\nYou can now run:');
  console.log('   yarn ios');
  console.log('   yarn android\n');
}

/**
 * Format brand list for display
 * @param {Array<{id: string, appName: string, isCurrent: boolean}>} brands
 * @returns {string}
 */
function formatBrandList(brands) {
  return brands
    .map((b) => `  • ${b.id} - ${b.appName}${b.isCurrent ? ' (current)' : ''}`)
    .join('\n');
}

/**
 * Show current brand status and available brands
 */
function showStatus() {
  const currentBrand = getCurrentBrand();
  const availableIds = getAvailableBrands();

  const brands = availableIds.map((id) => {
    const config = loadBrandConfig(id);
    return {
      id,
      appName: config?.appName || 'Unknown',
      isCurrent: id === currentBrand,
    };
  });

  if (currentBrand) {
    console.log(`\nCurrent brand: ${currentBrand}\n`);
  } else {
    console.log('\nNo brand currently set\n');
  }

  console.log('Available brands:');
  console.log(formatBrandList(brands));
  console.log('');
}

// =============================================================================
// CLI Entry Point
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const brandId = args[0];

  if (!brandId) {
    // No arguments - show status
    showStatus();
  } else {
    // Switch to specified brand
    await switchBrand(brandId);
  }
}

main().catch((err) => {
  console.error('\n❌ Unexpected error:', err.message);
  process.exit(1);
});
