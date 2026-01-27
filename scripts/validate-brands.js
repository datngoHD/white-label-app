#!/usr/bin/env node
/**
 * Validates all brand configurations
 * Used in CI/CD pipelines to ensure brand configs are valid before building
 */

const fs = require('fs');
const path = require('path');

const BRANDS_DIR = path.join(__dirname, '..', 'core', 'config', 'brands');
const REQUIRED_FIELDS = [
  'id',
  'appName',
  'slug',
  'ios',
  'android',
  'defaultTenantId',
  'assetsPath',
];

const REQUIRED_IOS_FIELDS = ['bundleId'];
const REQUIRED_ANDROID_FIELDS = ['packageName'];

function validateBrand(brandFile) {
  const brandPath = path.join(BRANDS_DIR, brandFile);
  const brandName = path.basename(brandFile, '.json');

  console.log(`\nValidating brand: ${brandName}`);

  try {
    const content = fs.readFileSync(brandPath, 'utf-8');
    const brand = JSON.parse(content);

    const errors = [];

    // Check required top-level fields
    for (const field of REQUIRED_FIELDS) {
      if (!brand[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check iOS fields
    if (brand.ios) {
      for (const field of REQUIRED_IOS_FIELDS) {
        if (!brand.ios[field]) {
          errors.push(`Missing required iOS field: ios.${field}`);
        }
      }
    }

    // Check Android fields
    if (brand.android) {
      for (const field of REQUIRED_ANDROID_FIELDS) {
        if (!brand.android[field]) {
          errors.push(`Missing required Android field: android.${field}`);
        }
      }
    }

    // Check assets path exists
    if (brand.assetsPath) {
      const assetsFullPath = path.join(__dirname, '..', brand.assetsPath);
      if (!fs.existsSync(assetsFullPath)) {
        errors.push(`Assets path does not exist: ${brand.assetsPath}`);
      }
    }

    // Check id matches filename
    if (brand.id !== brandName) {
      errors.push(`Brand id "${brand.id}" does not match filename "${brandName}"`);
    }

    if (errors.length > 0) {
      console.log(`  ❌ Validation failed:`);
      errors.forEach((err) => console.log(`     - ${err}`));
      return false;
    }

    console.log(`  ✓ Brand config valid`);
    return true;
  } catch (error) {
    console.log(`  ❌ Error reading brand config: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('=== Brand Configuration Validation ===');

  if (!fs.existsSync(BRANDS_DIR)) {
    console.error(`Brands directory not found: ${BRANDS_DIR}`);
    process.exit(1);
  }

  const brandFiles = fs.readdirSync(BRANDS_DIR).filter((f) => f.endsWith('.json'));

  if (brandFiles.length === 0) {
    console.error('No brand configuration files found');
    process.exit(1);
  }

  console.log(`Found ${brandFiles.length} brand(s)`);

  let allValid = true;

  for (const brandFile of brandFiles) {
    if (!validateBrand(brandFile)) {
      allValid = false;
    }
  }

  console.log('\n=== Validation Summary ===');

  if (allValid) {
    console.log('✓ All brand configurations are valid');
    process.exit(0);
  } else {
    console.log('❌ Some brand configurations are invalid');
    process.exit(1);
  }
}

main();
